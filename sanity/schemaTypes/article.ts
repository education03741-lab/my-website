import { defineField, defineType } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'mainImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'excerpt', type: 'text' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner Guide', value: 'Beginner Guide' },
          { title: 'Acne Care', value: 'Acne Care' },
          { title: 'Sun Protection', value: 'Sun Protection' },
          { title: 'Routine Building', value: 'Routine Building' },
          { title: 'Ingredient Guide', value: 'Ingredient Guide' },
          { title: 'Skin Science', value: 'Skin Science' },
        ],
      },
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
            },
          ],
        },
      ],
    }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
  ],
})