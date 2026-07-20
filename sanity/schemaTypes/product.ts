import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'brand', type: 'string' }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'price', type: 'string' }),
    defineField({ name: 'buyLink', type: 'url' }),
    defineField({ name: 'rating', type: 'number' }),
    defineField({ name: 'reviewCount', type: 'number' }),
    defineField({ name: 'description', type: 'text' }),

    defineField({ name: 'featuresIntro', type: 'text' }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({ name: 'howToUseIntro', type: 'text' }),
    defineField({
      name: 'howToUse',
      title: 'How To Use',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({
      name: 'relatedArticleSlugs',
      title: 'Related Article Slugs',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Enter the slug of related blog articles (e.g. "5-simple-steps")',
    }),

    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'review',
          fields: [
            defineField({ name: 'name', type: 'string' }),
            defineField({ name: 'rating', type: 'number' }),
            defineField({ name: 'comment', type: 'text' }),
          ],
        },
      ],
    }),
  ],
})