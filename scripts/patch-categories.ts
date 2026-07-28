/**
 * One-time patch script: backfill the "category" field on already-migrated
 * articles in Sanity, matched by slug.
 *
 * WHAT THIS DOES
 * - Looks up each article document by its slug
 * - Sets (patches) its "category" field to the value from the map below
 * - Uses the same .env.migration credentials as migrate-posts.ts
 *
 * HOW TO RUN
 * Place this file at: scripts/patch-categories.ts (same folder as
 * migrate-posts.ts), then run:
 *
 *   npx tsx scripts/patch-categories.ts --dry-run
 *
 * to preview without writing anything, then run without --dry-run to apply:
 *
 *   npx tsx scripts/patch-categories.ts
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.migration' })
import { createClient } from '@sanity/client'

const DRY_RUN = process.argv.includes('--dry-run')

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const apiVersion = process.env.SANITY_API_VERSION || '2024-01-01'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing SANITY_PROJECT_ID, SANITY_DATASET, or SANITY_API_TOKEN.\n' +
      'Make sure .env.migration has all four values filled in (see migrate-posts.ts).'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

// slug -> category, taken directly from the migration warning output
const slugToCategory: Record<string, string> = {
  'beginners-skincare-routine': 'Beginner Guide',
  'top-7-ingredients-for-acne-prone-skin': 'Acne Care',
  'how-to-choose-the-right-sunscreen': 'Sun Protection',
  'layering-actives-guide': 'Routine Building',
  'vitamin-c-vs-niacinamide': 'Ingredient Guide',
  'understanding-skin-barrier': 'Skin Science',
  'nighttime-skincare-routine': 'Routine Building',
}

async function main() {
  const slugs = Object.keys(slugToCategory)
  console.log(`Patching category for ${slugs.length} articles...${DRY_RUN ? ' (DRY RUN)' : ''}`)

  for (const slug of slugs) {
    const category = slugToCategory[slug]

    // Find the article document by slug
    const doc = await client.fetch(
      `*[_type == "article" && slug.current == $slug][0]{_id, title, category}`,
      { slug }
    )

    if (!doc) {
      console.warn(`  ! No article found for slug "${slug}" -- skipping`)
      continue
    }

    console.log(`\n"${doc.title}" (slug: ${slug})`)
    console.log(`  current category: ${doc.category ?? '(none)'}`)
    console.log(`  will set category: ${category}`)

    if (DRY_RUN) {
      console.log('  (dry-run) would patch this document')
      continue
    }

    await client.patch(doc._id).set({ category }).commit()
    console.log(`  ✓ Patched _id: ${doc._id}`)
  }

  console.log('\nDone.')
}

main()