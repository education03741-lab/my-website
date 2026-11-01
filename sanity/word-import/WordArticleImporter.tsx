"use client"

import {useEffect, useState, type CSSProperties} from "react"
import Image from "next/image"
import {useClient} from "sanity"
import {useRouter} from "sanity/router"
import {
  parseDocx, slugify, type ImportedImage, type ImportNode,
  type ParsedWordArticle, type RichSpan,
} from "./parseDocx"

const categories = [
  "Beginner Guide", "Acne Care", "Sun Protection",
  "Routine Building", "Ingredient Guide", "Skin Science",
]
type ArticleInput = keyof Pick<ParsedWordArticle,
  "title" | "slug" | "category" | "excerpt" | "seoTitle" | "seoDescription" |
  "directAnswer" | "authorName" | "authorBio" | "reviewerName" |
  "publishedAt" | "coverAlt"
>
type AssetRef = {_type: "reference"; _ref: string}
const makeKey = () => crypto.randomUUID().slice(0, 12)
const fieldStyle: CSSProperties = {
  width:"100%",border:"1px solid #d6c9c4",padding:"10px 12px",
  borderRadius:8,color:"#3b2932",background:"#fff",fontSize:14,
}
const labelStyle: CSSProperties = {
  display:"block",fontSize:12,fontWeight:700,marginBottom:6,
  color:"#6b4453",letterSpacing:"0.025em",
}
const cardStyle: CSSProperties = {
  border:"1px solid #e3d9d2",borderRadius:14,padding:20,
  background:"#fffdf9",marginBottom:18,
}

type ReadyBodyNode = {
  _type: string
  _key: string
  asset?: AssetRef
  alt?: string
  [key: string]: unknown
}
function makeBody(nodes: ImportNode[], assets: Map<string, AssetRef>, coverImageId: string): ReadyBodyNode[] {
  const output: ReadyBodyNode[] = []
  let removedCover = false
  for (const node of nodes) {
    if (node.kind === "image") {
      const ref = assets.get(node.imageId)
      if (!ref) continue
      if (node.imageId === coverImageId && !removedCover) {
        removedCover = true
        continue
      }
      output.push({_type:"image",_key:makeKey(),asset:ref,alt:""})
    } else if (node.kind === "table") {
      output.push({
        _type:"articleTable",_key:makeKey(),
        rows:node.rows.map((cells)=>({_key:makeKey(),_type:"articleTableRow",cells})),
      })
    } else {
      output.push({
        _type:"block",_key:makeKey(),
        style:node.style === "h1" ? "h2" : node.style,
        ...(node.listItem ? {listItem:node.listItem,level:node.level || 1} : {}),
        markDefs:node.markDefs,
        children:node.children.map((span:RichSpan)=>({
          _type:"span",_key:makeKey(),text:span.text,marks:span.marks,
        })),
      })
    }
  }
  return output
}

export default function WordArticleImporter() {
  const client = useClient({apiVersion:"2024-01-01"}).withConfig({useCdn:false,perspective:"raw"})
  const {navigateIntent} = useRouter()
  const [draft,setDraft] = useState<ParsedWordArticle|null>(null)
  const [fileName,setFileName] = useState("")
  const [busy,setBusy] = useState(false)
  const [progress,setProgress] = useState("")
  const [error,setError] = useState("")
  const [createdId,setCreatedId] = useState("")
  const [previews,setPreviews] = useState<Record<string,string>>({})
  const images = draft?.images

  useEffect(() => {
    if (!images) {setPreviews({});return}
    const objectUrls: Record<string,string> = {}
    for (const image of images) {
      const bytes = new Uint8Array(image.bytes.byteLength)
      bytes.set(image.bytes)
      objectUrls[image.id] = URL.createObjectURL(new Blob([bytes.buffer],{type:image.mimeType}))
    }
    setPreviews(objectUrls)
    return () => Object.values(objectUrls).forEach((url) => URL.revokeObjectURL(url))
  },[images])

  const update = (field:ArticleInput,value:string) => {
    setCreatedId("")
    setDraft((prev) => prev ? {...prev,[field]:value} : prev)
  }

  const loadFile = async (file?:File) => {
    if (!file) return
    setError("");setCreatedId("");setDraft(null);setFileName(file.name)
    setBusy(true);setProgress("Reading Word document…")
    try {
      const parsed = await parseDocx(file)
      setDraft(parsed)
      setProgress("")
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to read this Word file.")
      setProgress("")
    } finally {setBusy(false)}
  }

  const updateImageAlt = (imageId:string,alt:string) => {
    setDraft((prev) => prev ? {
      ...prev,images:prev.images.map((image) =>
        image.id === imageId ? {...image,alt} : image),
    } : prev)
  }

  const saveDraft = async () => {
    if (!draft || busy) return
    setError("");setCreatedId("")
    const title=draft.title.trim()
    const slug=draft.slug.trim()
    const category=draft.category.trim()
    if (!title || !slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
      setError("Enter a title and a URL slug using lowercase letters, numbers and hyphens.")
      return
    }
    if (!categories.includes(category)) {
      setError("Choose one of the article categories defined in Sanity.")
      return
    }
    if (!draft.body.some((node) => node.kind === "text")) {
      setError("No article paragraphs were found. Please check the Word file.")
      return
    }
    setBusy(true)
    try {
      setProgress("Checking whether this URL slug already exists…")
      const matches=await client.fetch<Array<{_id:string,title:string}>>(
        '*[_type == "article" && slug.current == $slug][0...5]{_id,title}',
        {slug},
      )
      if (matches.length) {
        throw new Error("An article already uses this slug. Open that article in Sanity instead; this importer never overwrites existing content.")
      }

      const assets=new Map<string,AssetRef>()
      for (let i=0;i<draft.images.length;i++) {
        const item:ImportedImage=draft.images[i]
        setProgress("Uploading image " + (i+1) + " of " + draft.images.length + "…")
        const bytes=new Uint8Array(item.bytes.byteLength)
        bytes.set(item.bytes)
        const file=new Blob([bytes.buffer],{type:item.mimeType})
        const result=await client.assets.upload("image",file,{filename:item.fileName})
        assets.set(item.id,{_type:"reference",_ref:result._id})
      }
      const body=makeBody(draft.body,assets,draft.coverImageId)
      // Apply Word image descriptions to Portable Text image blocks.
      for (let i=0;i<body.length;i++) {
        const block=body[i]
        if (block._type !== "image") continue
        const ref=(block.asset as AssetRef)?._ref
        block.alt=draft.images.find((img) => assets.get(img.id)?._ref === ref)?.alt || ""
      }
      setProgress("Saving an unpublished article draft…")
      const id="word-import-"+crypto.randomUUID()
      const date=draft.publishedAt && !Number.isNaN(Date.parse(draft.publishedAt))
        ? new Date(draft.publishedAt).toISOString() : undefined
      await client.create({
        _type:"article",
        _id:"drafts."+id,
        title,
        slug:{_type:"slug",current:slug},
        category,
        excerpt:draft.excerpt.trim() || undefined,
        seoTitle:draft.seoTitle.trim() || undefined,
        seoDescription:draft.seoDescription.trim() || undefined,
        directAnswer:draft.directAnswer.trim() || undefined,
        authorName:draft.authorName.trim() || undefined,
        authorBio:draft.authorBio.trim() || undefined,
        reviewerName:draft.reviewerName.trim() || undefined,
        publishedAt:date,
        mainImage:draft.coverImageId && assets.has(draft.coverImageId)
          ? {_type:"image",asset:assets.get(draft.coverImageId),alt:draft.coverAlt.trim() || draft.images.find((img) => img.id === draft.coverImageId)?.alt || ""}
          : undefined,
        body,
        faqs:draft.faqs.map((f) => ({_type:"articleFaq",_key:makeKey(),question:f.question,answer:f.answer})),
        sources:draft.sources.map((s) => ({_type:"articleSource",_key:makeKey(),title:s.title,url:s.url})),
      })
      setCreatedId(id)
      setProgress("")
    } catch(reason) {
      setProgress("")
      setError(reason instanceof Error ? reason.message : "Saving failed. No article was published.")
    } finally {setBusy(false)}
  }

  const textField = (name:ArticleInput,label:string,opts?:{multi?:boolean;placeholder?:string}) => (
    <div style={{marginBottom:14}}>
      <label htmlFor={"import-"+name} style={labelStyle}>{label}</label>
      {opts?.multi ? <textarea id={"import-"+name} rows={3} style={fieldStyle}
        placeholder={opts.placeholder} value={draft?.[name] || ""}
        onChange={(e) => update(name,e.target.value)} disabled={busy} /> :
        <input id={"import-"+name} style={fieldStyle} type="text"
          placeholder={opts?.placeholder} value={draft?.[name] || ""}
          onChange={(e)=>update(name,e.target.value)} disabled={busy}/>}
    </div>
  )

  return (
    <main style={{overflowY:"auto",height:"100%",padding:"22px 20px 90px",background:"#f8f3ee",color:"#32252a"}}>
      <div style={{maxWidth:1060,margin:"0 auto"}}>
        <header style={{marginBottom:22}}>
          <p style={{color:"#8b5364",fontSize:12,fontWeight:700,letterSpacing:"0.2em"}}>GLOWSKIN · EDITORIAL WORKFLOW</p>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(30px,4vw,46px)",margin:"8px 0"}}>Import an article from Word</h1>
          <p style={{lineHeight:1.7,color:"#6c5d57",maxWidth:720}}>
            Upload a .docx file containing your article, images, and optional labeled SEO fields.
            Review what was extracted, then create an <strong>unpublished draft</strong> in Sanity.
            Nothing is published or overwritten by this tool.
          </p>
        </header>

        <section style={cardStyle}>
          <label htmlFor="word-upload" style={labelStyle}>01 / CHOOSE YOUR WORD DOCUMENT</label>
          <input id="word-upload" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={busy} onChange={(e)=>void loadFile(e.target.files?.[0])} style={{display:"block",marginTop:10,maxWidth:"100%"}}/>
          <p style={{fontSize:12,marginTop:11,color:"#74645d"}}>
            Modern Word .docx only · Up to 25 MB · Best results with Word Heading 1/2/3 styles and images inserted inline.
          </p>
          <details style={{marginTop:15}}>
            <summary style={{cursor:"pointer",color:"#754155",fontWeight:600}}>Word template: how to format the file</summary>
            <div style={{marginTop:10,fontSize:13,lineHeight:1.9,whiteSpace:"pre-line",color:"#57494a"}}>
              {"Title: Nighttime Skincare Routine\nCategory: Routine Building\nSEO Title: Nighttime Skincare Routine: Steps & Order\nMeta Description: A concise original summary for search snippets.\nCover Image Alt: Skincare products used in an evening routine\nExcerpt: Short article summary\nDirect Answer: A short factual answer to the main question.\nAuthor: Verified writer name\n\n[Insert the cover image near the top]\n\n[Word Heading 1] Nighttime Skincare Routine\n[Word Heading 2] Step 1: Cleanse\nWrite paragraphs, links, lists, tables and inline images.\n\n[Word Heading 2] Frequently Asked Questions\nQ: How many steps do I need?\nA: A short, suitable routine can be enough.\n\n[Word Heading 2] Sources\nDermatology guidance — https://example.org/source"}
            </div>
          </details>
          {fileName && <p style={{fontSize:13,marginTop:10}}>Selected: <strong>{fileName}</strong></p>}
        </section>

        {error && <div role="alert" style={{...cardStyle,color:"#8a2639",background:"#ffebed",borderColor:"#eabac0"}}>{error}</div>}
        {progress && <div role="status" style={{...cardStyle,background:"#ecf2e6"}}>{progress}</div>}

        {draft && (
          <>
            <section style={cardStyle}>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:25,margin:"0 0 14px"}}>02 / Article and search preview</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:18}}>
                <div>
                  {textField("title","Article title")}
                  {textField("slug","URL slug")}
                  <div style={{marginBottom:14}}>
                    <label htmlFor="import-category" style={labelStyle}>Category</label>
                    <select id="import-category" value={draft.category} disabled={busy} onChange={(e)=>update("category",e.target.value)} style={fieldStyle}>
                      <option value="">Choose a category</option>
                      {categories.map((category)=><option key={category} value={category}>{category}</option>)}
                    </select>
                  </div>
                  <button type="button" disabled={busy} style={{background:"transparent",border:"1px solid #aa8d90",borderRadius:7,padding:"7px 12px",fontSize:12,marginBottom:15,cursor:"pointer"}} onClick={()=>update("slug",slugify(draft.title))}>
                    Regenerate slug from title
                  </button>
                  {textField("excerpt","Article excerpt / card summary",{multi:true})}
                </div>
                <div>
                  {textField("seoTitle","SEO title")}
                  {textField("seoDescription","Meta description",{multi:true})}
                  <div style={{fontSize:12,color:"#776767"}}>
                    SEO title: {draft.seoTitle.length}/65 · Meta description: {draft.seoDescription.length}/165
                  </div>
                  {textField("directAnswer","Answer at a glance",{multi:true})}
                </div>
              </div>
              <div style={{background:"#f6ece8",borderRadius:9,padding:13,marginTop:6}}>
                <span style={{fontSize:12,color:"#2a674d"}}>glowskin.blog/blog/{draft.slug || "your-article-slug"}</span>
                <h3 style={{fontSize:20,margin:"6px 0",color:"#304da1"}}>{draft.seoTitle || draft.title || "Article title"}</h3>
                <p style={{fontSize:13,color:"#514f4e",margin:0}}>{draft.seoDescription || draft.excerpt || "No meta description provided."}</p>
              </div>
            </section>

            <section style={cardStyle}>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:25,margin:"0 0 12px"}}>03 / Images and body review</h2>
              <p style={{fontSize:13,color:"#786961"}}>
                {draft.body.length} content blocks, {draft.images.length} embedded images,
                {" "}{draft.body.filter((node)=>node.kind==="table").length} tables.
                The first image becomes the cover by default. Change its alt text before publishing.
              </p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12,marginTop:15}}>
                {draft.images.map((image)=>(
                  <div key={image.id} style={{padding:10,border:"1px solid #e2d6d0",borderRadius:8}}>
                    {previews[image.id] && <Image unoptimized width={180} height={120} alt={image.alt || "Word article image preview"} src={previews[image.id]}
                      style={{width:"100%",height:120,objectFit:"cover",borderRadius:5}} />}
                    <p style={{fontSize:12,wordBreak:"break-word"}}>{image.fileName}</p>
                    <label style={labelStyle} htmlFor={"image-alt-"+image.id}>Image alt text</label>
                    <input id={"image-alt-"+image.id} style={fieldStyle} value={image.alt}
                      onChange={(e)=>updateImageAlt(image.id,e.target.value)} disabled={busy}/>
                    <label style={{fontSize:12,display:"flex",alignItems:"center",gap:7,marginTop:9}}>
                      <input type="radio" name="cover-image" checked={draft.coverImageId === image.id}
                        onChange={()=>setDraft((prev)=>prev ? {...prev,coverImageId:image.id}:prev)} disabled={busy}/>
                      Use as cover
                    </label>
                  </div>
                ))}
              </div>
              {textField("coverAlt","Cover image alt text")}
              <h3 style={{marginTop:20,fontSize:14}}>Content outline</h3>
              <div style={{maxHeight:270,overflow:"auto",background:"#f6f0ea",padding:15,borderRadius:8}}>
                {draft.body.slice(0,60).map((node,index)=>(
                  <div key={index} style={{padding:"4px 0",fontSize:13,color:node.kind==="text" && node.style!=="normal"?"#6e3d53":"#71655c"}}>
                    {node.kind==="text" ? (node.style==="normal"?"¶ ":"§ ")+node.children.map((p)=>p.text).join("").slice(0,150) : node.kind==="image"?"[Embedded image]":"[Table: "+node.rows.length+" rows]"}
                  </div>
                ))}
              </div>
            </section>

            <section style={cardStyle}>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:25,margin:"0 0 14px"}}>04 / Trust, references and publication</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:18}}>
                <div>
                  {textField("authorName","Real author / verified team")}
                  {textField("authorBio","Author background (verifiable)",{multi:true})}
                  {textField("reviewerName","Expert reviewer (only if reviewed)")}
                </div>
                <div>
                  {textField("publishedAt","Publication date (optional ISO date)")}
                  <p style={{fontSize:13}}>FAQs extracted: <strong>{draft.faqs.length}</strong></p>
                  {draft.faqs.map((faq,index)=><p key={index} style={{fontSize:12,margin:"8px 0"}}><strong>{faq.question}</strong> {faq.answer.slice(0,130)}</p>)}
                  <p style={{fontSize:13,marginTop:12}}>Source links extracted: <strong>{draft.sources.length}</strong></p>
                  {draft.sources.map((source,index)=><p key={index} style={{fontSize:12,overflowWrap:"anywhere"}}>{source.title} — {source.url}</p>)}
                </div>
              </div>
              {draft.warnings.length > 0 && (
                <div style={{background:"#fff4da",border:"1px solid #d9b76e",borderRadius:8,padding:15}}>
                  <strong style={{fontSize:13}}>Review before publishing</strong>
                  <ul style={{paddingLeft:19,fontSize:13,lineHeight:1.8,marginBottom:0}}>
                    {draft.warnings.map((item,index)=><li key={index}>{item}</li>)}
                  </ul>
                </div>
              )}
              <p style={{fontSize:13,marginTop:16,color:"#675861"}}>
                Creating a draft uploads its images to your Sanity media library. It will not publish
                the article, overwrite an existing slug, invent credentials or change any live page.
              </p>
              <button type="button" disabled={busy||Boolean(createdId)} onClick={()=>void saveDraft()}
                style={{border:0,borderRadius:9,padding:"14px 24px",fontWeight:700,color:"#fff",background:busy?"#99828b":"#662f42",cursor:busy?"wait":"pointer"}}>
                {busy ? "Working…" : createdId ? "Draft created" : "Create unpublished Sanity draft"}
              </button>
            </section>
            {createdId && (
              <div role="status" style={{...cardStyle,background:"#edf5ec",borderColor:"#b1cba8"}}>
                <h2 style={{fontSize:22,margin:"0 0 10px"}}>Draft successfully saved — not published</h2>
                <p>Open the article in Sanity Studio, verify the imported images and formatting, and publish only after reviewing the SEO and references.</p>
                <button type="button" onClick={()=>navigateIntent("edit",{id:createdId,type:"article",mode:"structure"})}
                  style={{background:"#4d6b4e",color:"#fff",border:0,padding:"12px 20px",borderRadius:8,cursor:"pointer"}}>
                  Open article draft in Studio
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
