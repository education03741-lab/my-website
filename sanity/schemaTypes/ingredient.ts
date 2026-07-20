import { defineField, defineType } from 'sanity'

export const ingredient = defineType({
  name: 'ingredient',
  title: 'Ingredient',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description', type: 'text' }),

    defineField({
      name: 'benefits',
      title: 'Benefits (short teaser chips)',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({ name: 'howItWorks', type: 'text' }),

    defineField({
      name: 'keyBenefits',
      title: 'Key Benefits',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'keyBenefit',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'detail', type: 'text' }),
          ],
        },
      ],
    }),

    defineField({
      name: 'bestFor',
      title: 'Best For',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({ name: 'howToUse', type: 'text' }),

    defineField({
      name: 'pairsWith',
      title: 'Pairs With',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({
      name: 'avoidWith',
      title: 'Avoid With',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({ name: 'proTip', type: 'text' }),

    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faq',
          fields: [
            defineField({ name: 'question', type: 'string' }),
            defineField({ name: 'answer', type: 'text' }),
          ],
        },
      ],
    }),
  ],
})