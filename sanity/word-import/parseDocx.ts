// Browser-only DOCX reader. Uses the ZIP central directory and native
// DecompressionStream so the Studio does not need a new runtime dependency.
// Never render XML or Word HTML as unsafe HTML.
import { articleTopics } from "../../app/data/articleTopics"

export type RichSpan = { text: string; marks: string[] }
export type LinkDefinition = { _key: string; _type: "link"; href: string }
export type TextNode = {
  kind: "text"
  style: "normal" | "h1" | "h2" | "h3" | "h4"
  children: RichSpan[]
  markDefs: LinkDefinition[]
  listItem?: "bullet" | "number"
  level?: number
}
export type ImageNode = { kind: "image"; imageId: string }
export type TableNode = { kind: "table"; rows: string[][] }
export type ImportNode = TextNode | ImageNode | TableNode
export type ImportedImage = {
  id: string
  fileName: string
  mimeType: string
  bytes: Uint8Array
  alt: string
}
export type ImportFAQ = { question: string; answer: string }
export type ImportSource = { title: string; url: string }
export type ParsedWordArticle = {
  title: string
  slug: string
  category: string
  topics: string[]
  excerpt: string
  seoTitle: string
  seoDescription: string
  directAnswer: string
  coverAlt: string
  authorName: string
  authorBio: string
  reviewerName: string
  publishedAt: string
  body: ImportNode[]
  images: ImportedImage[]
  coverImageId: string
  faqs: ImportFAQ[]
  sources: ImportSource[]
  warnings: string[]
}

const decoder = new TextDecoder()
const MAX_FILE = 25 * 1024 * 1024
const MAX_ENTRY = 45 * 1024 * 1024
const MAX_TOTAL = 110 * 1024 * 1024
const IMAGE_MIME: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  webp: "image/webp", gif: "image/gif",
}
const key = () => crypto.randomUUID().replace(/-/g, "").slice(0, 14)
const children = (el: Element) => Array.from(el.children)
const child = (el: Element, name: string) => children(el).find((node) => node.localName === name)
const descendants = (el: Element, name: string) => Array.from(el.getElementsByTagNameNS("*", name))
const val = (el: Element | undefined, attr: string) =>
  el?.getAttribute("w:" + attr) ?? el?.getAttribute(attr) ?? ""
const plain = (block: TextNode) => block.children.map((piece) => piece.text).join("").trim()

function xmlDoc(source: string): Document {
  const doc = new DOMParser().parseFromString(source, "application/xml")
  if (doc.getElementsByTagName("parsererror").length) {
    throw new Error("The Word document contains malformed XML.")
  }
  return doc
}

type ZipEntry = { offset: number; length: number; plainLength: number; method: number }
class DocxZip {
  private bytes: Uint8Array
  private entries = new Map<string, ZipEntry>()
  private cached = new Map<string, Promise<Uint8Array | undefined>>()

  constructor(buffer: ArrayBuffer) {
    this.bytes = new Uint8Array(buffer)
    const view = new DataView(buffer)
    let end = -1
    for (let i = buffer.byteLength - 22; i >= Math.max(0, buffer.byteLength - 65557); i--) {
      if (view.getUint32(i, true) === 0x06054b50) { end = i; break }
    }
    if (end < 0) throw new Error("Not a valid .docx ZIP archive.")
    const count = view.getUint16(end + 10, true)
    const directory = view.getUint32(end + 16, true)
    if (count > 4000 || directory > buffer.byteLength) throw new Error("Word document is too complex to import.")
    let offset = directory, total = 0
    for (let i = 0; i < count; i++) {
      if (offset + 46 > buffer.byteLength || view.getUint32(offset, true) !== 0x02014b50) {
        throw new Error("Corrupted DOCX central directory.")
      }
      const flags = view.getUint16(offset + 8, true)
      const method = view.getUint16(offset + 10, true)
      const length = view.getUint32(offset + 20, true)
      const plainLength = view.getUint32(offset + 24, true)
      const nameLength = view.getUint16(offset + 28, true)
      const extraLength = view.getUint16(offset + 30, true)
      const commentLength = view.getUint16(offset + 32, true)
      const localOffset = view.getUint32(offset + 42, true)
      const nameEnd = offset + 46 + nameLength
      if (nameEnd > buffer.byteLength || length === 0xffffffff || plainLength === 0xffffffff) {
        throw new Error("Zip64 DOCX files are not supported.")
      }
      const name = decoder.decode(this.bytes.subarray(offset + 46, nameEnd))
      total += plainLength
      if (flags & 1 || plainLength > MAX_ENTRY || total > MAX_TOTAL) {
        throw new Error("Encrypted or oversized DOCX content cannot be imported.")
      }
      if (!name.endsWith("/")) this.entries.set(name, { offset: localOffset, length, plainLength, method })
      offset = nameEnd + extraLength + commentLength
    }
  }

  async read(name: string): Promise<Uint8Array | undefined> {
    const cached = this.cached.get(name)
    if (cached) return cached
    const task = this.extract(name)
    this.cached.set(name, task)
    return task
  }

  private async extract(name: string): Promise<Uint8Array | undefined> {
    const entry = this.entries.get(name)
    if (!entry) return undefined
    const data = new DataView(this.bytes.buffer)
    if (entry.offset + 30 > this.bytes.length || data.getUint32(entry.offset, true) !== 0x04034b50) {
      throw new Error("DOCX contains an invalid ZIP entry.")
    }
    const nameLength = data.getUint16(entry.offset + 26, true)
    const extraLength = data.getUint16(entry.offset + 28, true)
    const start = entry.offset + 30 + nameLength + extraLength
    if (start + entry.length > this.bytes.length) throw new Error("Truncated DOCX file.")
    const compressed = this.bytes.slice(start, start + entry.length)
    if (entry.method === 0) return compressed
    if (entry.method !== 8) throw new Error("Unsupported Word compression method.")
    if (typeof DecompressionStream === "undefined") {
      throw new Error("Please use an up-to-date Chrome, Firefox, Edge or Safari browser to import .docx files.")
    }
    let decompressor: DecompressionStream
    try { decompressor = new DecompressionStream("deflate-raw") }
    catch { throw new Error("This browser does not support DOCX decompression. Please update your browser.") }
    const compressedBytes = new Uint8Array(compressed.byteLength)
    compressedBytes.set(compressed)
    const output = await new Response(new Blob([compressedBytes.buffer]).stream().pipeThrough(decompressor)).arrayBuffer()
    if (output.byteLength > MAX_ENTRY || output.byteLength !== entry.plainLength) {
      throw new Error("DOCX entry failed size validation.")
    }
    return new Uint8Array(output)
  }
}
const safeUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : ""
  } catch { return "" }
}
export const slugify = (value: string) =>
  value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90)

export async function parseDocx(file: File): Promise<ParsedWordArticle> {
  if (!/\.docx$/i.test(file.name) || file.size < 200 || file.size > MAX_FILE) {
    throw new Error("Select a .docx Word document smaller than 25 MB (not .doc).")
  }
  const zip = new DocxZip(await file.arrayBuffer())
  const xml = await zip.read("word/document.xml")
  if (!xml) throw new Error("This file does not contain a Word article document.")
  const doc = xmlDoc(decoder.decode(xml))
  const body = descendants(doc.documentElement, "body")[0]
  if (!body) throw new Error("The Word article is empty.")
  const warnings: string[] = []

  const rels = new Map<string, string>()
  const relXml = await zip.read("word/_rels/document.xml.rels")
  if (relXml) {
    const relationships = xmlDoc(decoder.decode(relXml))
    for (const item of descendants(relationships.documentElement, "Relationship")) {
      const id = item.getAttribute("Id") || ""
      const target = item.getAttribute("Target") || ""
      const mode = item.getAttribute("TargetMode") || ""
      if (mode === "External") {
        rels.set(id, target)
      } else if (target && !target.startsWith("/") && !target.includes("\\") && !target.includes("..")) {
        rels.set(id, new URL(target, "https://word.local/word/document.xml").pathname.slice(1))
      }
    }
  }
  // Word stores numbered-versus-bulleted list styles in a separate
  // numbering document. Preserve those semantics when they are present.
  const numberKinds = new Map<string, "bullet" | "number">()
  const numToAbstract = new Map<string, string>()
  const abstractFormats = new Map<string, "bullet" | "number">()
  const numberingXml = await zip.read("word/numbering.xml")
  if (numberingXml) {
    const numberingDoc = xmlDoc(decoder.decode(numberingXml))
    for (const abstract of descendants(numberingDoc.documentElement, "abstractNum")) {
      const id = val(abstract, "abstractNumId")
      const levelZero = children(abstract).find((node) => node.localName === "lvl" && val(node,"ilvl") === "0")
      const format = val(levelZero ? child(levelZero,"numFmt") : undefined,"val")
      abstractFormats.set(id, format === "bullet" ? "bullet" : "number")
    }
    for (const num of descendants(numberingDoc.documentElement, "num")) {
      const id = val(num,"numId")
      const abstractId = val(child(num,"abstractNumId"),"val")
      if (id && abstractId) numToAbstract.set(id,abstractId)
    }
    for (const [id,abstractId] of numToAbstract) {
      numberKinds.set(id,abstractFormats.get(abstractId) || "bullet")
    }
  }
  const imageMap = new Map<string, ImportedImage>()
  const parsed: ImportNode[] = []

  function textParagraph(p: Element): ImportNode[] {
    const properties = child(p, "pPr")
    const pStyle = val(properties ? child(properties, "pStyle") : undefined, "val").toLowerCase()
    let style: TextNode["style"] = "normal"
    if (/^(title|heading1|heading 1)$/.test(pStyle)) style = "h1"
    if (/^heading2|heading 2$/.test(pStyle)) style = "h2"
    if (/^heading3|heading 3$/.test(pStyle)) style = "h3"
    if (/^heading4|heading 4$/.test(pStyle)) style = "h4"
    const list = properties && child(properties, "numPr")
    const numbered = /listnumber|list number/.test(pStyle)
    const listNumId = list ? val(child(list,"numId"),"val") : ""
    const listItem = list || /listbullet|listnumber|list paragraph/.test(pStyle)
      ? listNumId && numberKinds.has(listNumId)
        ? numberKinds.get(listNumId)
        : numbered ? "number" as const : "bullet" as const
      : undefined
    const level = list ? Math.min(10, Number(val(child(list, "ilvl"), "val") || "0") + 1) : undefined
    const markDefs: LinkDefinition[] = []
    let spans: RichSpan[] = []
    const blocks: ImportNode[] = []
    const flush = () => {
      if (spans.some((span) => span.text.trim())) {
        blocks.push({kind:"text", style, children:spans, markDefs:[...markDefs], listItem, level})
      }
      spans = []
    }
    const appendText = (value: string, marks: string[]) => {
      if (!value) return
      const prev = spans[spans.length - 1]
      if (prev && prev.marks.join("|") === marks.join("|")) prev.text += value
      else spans.push({text:value, marks})
    }
    const walk = (node: Element, inherited: string[] = []) => {
      if (node.localName === "hyperlink") {
        const relId = node.getAttribute("r:id") || ""
        const url = safeUrl(rels.get(relId) || "")
        const linkMark = url ? key() : ""
        if (url) markDefs.push({_key:linkMark,_type:"link",href:url})
        for (const item of children(node)) walk(item, linkMark ? [...inherited, linkMark] : inherited)
        return
      }
      if (node.localName === "r") {
        const rPr = child(node, "rPr")
        const marks = [...inherited]
        if (rPr && child(rPr, "b")) marks.push("strong")
        if (rPr && child(rPr, "i")) marks.push("em")
        if (rPr && child(rPr, "u")) marks.push("underline")
        for (const item of children(node)) {
          if (item.localName === "t") appendText(item.textContent || "", marks)
          if (item.localName === "tab") appendText("\t", marks)
          if (item.localName === "br") appendText("\n", marks)
          if (item.localName === "drawing" || item.localName === "pict") {
            const blip = descendants(item, "blip")[0]
            const relId = blip?.getAttribute("r:embed") || ""
            const imagePath = rels.get(relId) || ""
            if (imagePath && imagePath.startsWith("word/media/")) {
              flush()
              const desc = descendants(item, "docPr")[0]
              const imageId = imagePath
              if (!imageMap.has(imageId)) imageMap.set(imageId,{
                id: imageId,
                fileName: imagePath.split("/").pop() || "image.png",
                mimeType: IMAGE_MIME[imagePath.split(".").pop()?.toLowerCase() || ""] || "",
                bytes: new Uint8Array(),
                alt: desc?.getAttribute("descr") || desc?.getAttribute("title") || "",
              })
              blocks.push({kind:"image",imageId})
            } else warnings.push("One Word image could not be linked to an embedded file.")
          }
        }
        return
      }
      if (node.localName === "del") return
      for (const item of children(node)) walk(item, inherited)
    }
    for (const item of children(p)) if (item.localName !== "pPr") walk(item)
    flush()
    return blocks
  }

  for (const el of children(body)) {
    if (el.localName === "p") parsed.push(...textParagraph(el))
    if (el.localName === "tbl") {
      const rows: string[][] = []
      for (const tr of children(el).filter((node) => node.localName === "tr")) {
        const cells: string[] = []
        for (const tc of children(tr).filter((node) => node.localName === "tc")) {
          const content = descendants(tc, "p").flatMap(textParagraph)
            .filter((node):node is TextNode => node.kind === "text").map(plain).join(" ")
          cells.push(content)
        }
        if (cells.some(Boolean)) rows.push(cells)
      }
      if (rows.length) parsed.push({kind:"table",rows})
    }
  }

  const images = Array.from(imageMap.values())
  for (const item of images) {
    const extension = item.fileName.split(".").pop()?.toLowerCase() || ""
    const mimeType = IMAGE_MIME[extension]
    const data = mimeType ? await zip.read(item.id) : undefined
    if (!mimeType || !data) {
      warnings.push("Unsupported or missing image: " + item.fileName)
      item.mimeType = ""
    } else {
      item.mimeType = mimeType
      item.bytes = data
    }
  }

  const article: ParsedWordArticle = {
    title:"",slug:"",category:"",topics:[],excerpt:"",seoTitle:"",seoDescription:"",
    directAnswer:"",coverAlt:"",authorName:"",authorBio:"",reviewerName:"",
    publishedAt:"",body:[],images:images.filter((image) => image.mimeType),
    coverImageId: images.find((image) => image.mimeType)?.id || "",
    faqs:[],sources:[],warnings,
  }
  const metadata: Record<string, keyof ParsedWordArticle> = {
    "title":"title","article title":"title","slug":"slug","category":"category",
    "seo title":"seoTitle","meta title":"seoTitle",
    "meta description":"seoDescription","seo description":"seoDescription",
    "excerpt":"excerpt","summary":"excerpt","direct answer":"directAnswer",
    "answer at a glance":"directAnswer","cover image alt":"coverAlt",
    "cover alt":"coverAlt","author":"authorName","author name":"authorName",
    "author bio":"authorBio","author background":"authorBio",
    "reviewer":"reviewerName","expert reviewer":"reviewerName",
    "published date":"publishedAt",
  }
  let section: "body" | "faq" | "sources" = "body"
  let lastFaq: ImportFAQ | null = null
  let leading = true
  const bodyBlocks: ImportNode[] = []
  for (const node of parsed) {
    if (node.kind !== "text") {
      if (node.kind === "image" || node.kind === "table") {
        if (section === "body") bodyBlocks.push(node)
      }
      continue
    }
    const text = plain(node)
    if (!text) continue
    if (/^(frequently asked questions|faqs|reader questions)$/i.test(text)) {
      section = "faq";leading = false;continue
    }
    if (/^(sources|references|further reading)$/i.test(text)) {
      section = "sources";leading = false;continue
    }
    if (leading) {
      const topicLine = text.match(/^topics?\s*:\s*(.+)$/i)
      if (topicLine) {
        const selected = topicLine[1].split(",").map((value) => value.trim()).filter(Boolean)
        for (const label of selected) {
          const topic = articleTopics.find((option) =>
            label.toLowerCase() === option.slug ||
            label.toLowerCase() === option.label.toLowerCase()
          )
          if (topic && !article.topics.includes(topic.slug)) article.topics.push(topic.slug)
          else if (!topic) warnings.push("Unknown topic in Word file: " + label)
        }
        continue
      }
      const match = text.match(/^([A-Za-z][A-Za-z ]{1,24})\s*:\s*(.+)$/)
      const field = match && metadata[match[1].trim().toLowerCase()]
      if (field) {
        const value = match![2].trim()
        if (typeof article[field] === "string") {
          // Only scalar metadata fields are recognized here.
          Object.assign(article, {[field]:value})
        }
        continue
      }
      if (/^cover image\s*:/i.test(text)) continue
      if (node.style === "h1") {
        if (!article.title) {
          article.title = text.replace(/^#\s*/, "")
          continue
        }
        // The public article template already renders the title as H1.
        // Avoid repeating an identical Word cover/title heading inside the body.
        if (slugify(text) === slugify(article.title)) {
          leading = false
          continue
        }
      }
      if (!article.title && bodyBlocks.length === 0) {
        article.title = text.replace(/^#\s*/, "")
        continue
      }
      leading = false
    }
    if (section === "faq") {
      const question = text.match(/^(?:Q(?:uestion)?\s*:\s*)?(.+\?)$/i)
      if (question && (node.style !== "normal" || /^Q(?:uestion)?\s*:/i.test(text))) {
        lastFaq = {question:question[1].trim(),answer:""}
        article.faqs.push(lastFaq)
      } else if (lastFaq) {
        lastFaq.answer += (lastFaq.answer ? " " : "") + text.replace(/^A(?:nswer)?\s*:\s*/i,"")
      }
      continue
    }
    if (section === "sources") {
      const linked = node.markDefs.find((mark) => safeUrl(mark.href))
      const found = text.match(/https?:\/\/\S+/)
      const url = safeUrl((found ? found[0] : linked?.href || "").replace(/[).,;]+$/,""))
      if (url) article.sources.push({title:(found ? text.replace(found[0],"") : text).replace(/^[-•\s:]+|[-•\s:]+$/g,"").trim() || url,url})
      else warnings.push("A source line has no valid link: " + text.slice(0,90))
      continue
    }
    if (node.style === "h1") node.style = "h2"
    bodyBlocks.push(node)
  }
  article.body = bodyBlocks
  article.faqs = article.faqs.filter((faq) => faq.question && faq.answer.trim())
  if (!article.title) warnings.push("Article title is missing.")
  if (!article.category) warnings.push("Choose a category before creating a draft.")
  if (!article.coverImageId) warnings.push("No supported cover image found in this Word file.")
  if (!article.seoTitle) warnings.push("SEO title is not provided; the article title will be used.")
  if (!article.seoDescription) warnings.push("SEO meta description is missing.")
  if (article.body.filter((node) => node.kind === "text").length < 2) warnings.push("Very little article text was found.")
  if (!article.slug) article.slug = slugify(article.title)
  if (!article.excerpt) article.excerpt = article.seoDescription
  if (article.publishedAt && Number.isNaN(Date.parse(article.publishedAt))) {
    warnings.push("Published date is invalid and will be ignored.")
    article.publishedAt = ""
  }
  return article
}
