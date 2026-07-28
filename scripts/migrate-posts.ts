/**
 * One-time migration script: data/posts.ts -> Sanity "post" documents
 * 
 * Run: npx tsx scripts/migrate-posts.ts
 * Test with: npx tsx scripts/migrate-posts.ts --dry-run
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.migration' })
import fs from 'fs'
import path from 'path'
import { createClient } from '@sanity/client'
import { posts, type Post } from '../app/data/posts'

const DRY_RUN = process.argv.includes('--dry-run')

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const apiVersion = process.env.SANITY_API_VERSION || '2024-01-01'
const token = process.env.SANITY_API_TOKEN

if (!DRY_RUN && (!projectId || !dataset || !token)) {
  console.error(
    'Missing SANITY_PROJECT_ID, SANITY_DATASET, or SANITY_API_TOKEN.\n' +
      'Create a .env.migration file (see comments at top of this script) or export them in your shell.'
  )
  process.exit(1)
}

const client = DRY_RUN
  ? null
  : createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    })

// ---- Helper functions ---------------------------------------------------

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

function looksLikeHeading(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false
  if (trimmed.startsWith('- ')) return false
  if (trimmed.startsWith('• ')) return false
  
  // Headings are typically:
  // 1. Short (under 100 chars)
  // 2. Don't end with period (usually)
  // 3. Not full paragraphs with multiple sentences
  
  const isShort = trimmed.length < 100
  const endsWithPeriod = /[.:]$/.test(trimmed)
  const hasMultipleSentences = (trimmed.match(/[.!?]/g) || []).length > 1
  const isQuestion = trimmed.endsWith('?')
  
  // Questions are usually headings
  if (isQuestion) return true
  
  // Short lines without periods are headings
  if (isShort && !endsWithPeriod) return true
  
  // Lines with no sentence-ending punctuation are headings
  if (!endsWithPeriod && !hasMultipleSentences) return true
  
  return false
}

function textBlock(style: 'normal' | 'h2' | 'h3', text: string) {
  return {
    _type: 'block',
    _key: randomKey(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: randomKey(), text: text.trim(), marks: [] }],
  }
}

function bulletBlock(text: string) {
  return {
    _type: 'block',
    _key: randomKey(),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: randomKey(), text: text.trim(), marks: [] }],
  }
}

function contentToBlocks(content: string) {
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const blocks = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Bullet points
    if (line.startsWith('- ')) {
      const bulletText = line.slice(2).trim()
      blocks.push(bulletBlock(bulletText))
      continue
    }
    
    // Check for headings
    if (looksLikeHeading(line)) {
      // Check if it's a major heading (short, all caps, or has ## style)
      const isH2 = line.length < 40 || line === line.toUpperCase() || line.startsWith('##')
      blocks.push(textBlock(isH2 ? 'h2' : 'h3', line))
      continue
    }
    
    // Regular paragraph
    blocks.push(textBlock('normal', line))
  }
  
  return blocks
}

// ---- Image upload ---------------------------------------------------------

async function uploadImageAsset(imagePublicPath: string) {
  // imagePublicPath looks like "/images/blog/beginners-skincare-routine.jpg"
  const localPath = path.join(process.cwd(), 'public', imagePublicPath)

  if (!fs.existsSync(localPath)) {
    console.warn(`  ⚠️  Image not found on disk: ${localPath}`)
    return null
  }

  if (DRY_RUN) {
    console.log(`  (dry-run) would upload image: ${path.basename(localPath)}`)
    return null
  }

  const asset = await client!.assets.upload('image', fs.createReadStream(localPath), {
    filename: path.basename(localPath),
  })
  return asset
}

// ---- Main migration --------------------------------------------------------

async function migratePost(post: Post) {
  console.log(`\n📝 Migrating: "${post.title}"`)
  console.log(`   Slug: ${post.slug}`)

  // Check if already exists
  if (!DRY_RUN) {
    const existing = await client!.fetch(
      `*[_type == "post" && slug.current == $slug][0]`,
      { slug: post.slug }
    )
    
    if (existing) {
      console.log(`   ⏭️  Already exists (ID: ${existing._id}), skipping...`)
      return
    }
  }

  // Convert content to Portable Text
  const body = contentToBlocks(post.content)
  console.log(`   📄 Converted ${body.length} blocks`)

  // Upload image
  const asset = await uploadImageAsset(post.image)
  if (asset) {
    console.log(`   🖼️  Uploaded image: ${asset._id}`)
  }

  // Create document (FIXED: removed 'date' field)
  const doc: any = {
    _type: 'post', // Must match your frontend query
    title: post.title,
    slug: { 
      _type: 'slug', 
      current: post.slug 
    },
    description: post.description || '',
    category: post.category || 'General',
    body: body,
    publishedAt: new Date().toISOString(), // Use current date
  }

  // Add mainImage if available
  if (asset) {
    doc.mainImage = {
      _type: 'image',
      asset: { 
        _type: 'reference', 
        _ref: asset._id 
      },
    }
  }

  if (DRY_RUN) {
    console.log('   (dry-run) would create document:')
    console.log(`   ${JSON.stringify(doc, null, 2).slice(0, 500)}...`)
    return
  }

  const created = await client!.create(doc)
  console.log(`   ✅ Created! ID: ${created._id}`)
}

async function main() {
  console.log(`\n🚀 Starting migration of ${posts.length} posts...`)
  console.log(`📌 Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE (writing to Sanity)'}`)
  console.log(`📁 Total posts: ${posts.length}\n`)

  let successCount = 0
  let skipCount = 0
  let failCount = 0

  for (const post of posts) {
    try {
      await migratePost(post)
      successCount++
    } catch (err) {
      console.error(`   ❌ Failed:`, err)
      failCount++
    }
  }

  console.log(`\n✨ Migration Complete!`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ⏭️  Skipped: ${skipCount}`)
  console.log(`   ❌ Failed: ${failCount}`)
  console.log(`   📊 Total: ${posts.length}\n`)
}

// Run it
main().catch(console.error)