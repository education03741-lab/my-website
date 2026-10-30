import { defineField, defineType } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fieldsets: [
    { name: 'search', title: 'Search appearance (SEO)', options: { collapsible: true, collapsed: true } },
    { name: 'answers', title: 'Direct answers and questions (AEO)', options: { collapsible: true, collapsed: true } },
    { name: 'trust', title: 'Editorial identity and references', options: { collapsible: true, collapsed: true } },
  ],
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
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      fieldset: 'search',
      description: 'Optional search-result title. Leave blank to use the article title.',
      validation: (Rule) => Rule.max(65).warning('Consider keeping this title at 65 characters or fewer.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      fieldset: 'search',
      description: 'Optional summary for search snippets and social previews. Leave blank for the existing fallback.',
      validation: (Rule) => Rule.max(165).warning('Consider keeping this description at 165 characters or fewer.'),
    }),
    defineField({
      name: 'directAnswer',
      title: 'Answer at a glance',
      type: 'text',
      rows: 4,
      fieldset: 'answers',
      description: 'A factual 40–60 word answer to the article’s main question, displayed near the top. Do not invent claims.',
    }),
    defineField({
      name: 'faqs',
      title: 'Reader questions and answers',
      type: 'array',
      fieldset: 'answers',
      description: 'Use genuine reader questions, preferably from Search Console. These answers will also be visible in the article.',
      of: [
        {
          type: 'object',
          name: 'articleFaq',
          title: 'Question and answer',
          fields: [
            defineField({ name: 'question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'question', subtitle: 'answer' } },
        },
      ],
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      fieldset: 'trust',
      description: 'Only enter a real, identifiable writer or a confirmed editorial team name.',
    }),
    defineField({
      name: 'authorBio',
      title: 'Author background',
      type: 'text',
      rows: 3,
      fieldset: 'trust',
      description: 'Optional, verifiable editorial background. Never invent qualifications or professional credentials.',
    }),
    defineField({
      name: 'reviewerName',
      title: 'Expert reviewer (only if verified)',
      type: 'string',
      fieldset: 'trust',
      description: 'Leave blank unless an actual qualified reviewer has reviewed this specific article.',
    }),
    defineField({
      name: 'sources',
      title: 'References and further reading',
      type: 'array',
      fieldset: 'trust',
      description: 'Cite real studies, dermatology organizations or official guidance supporting specific article claims.',
      of: [
        {
          type: 'object',
          name: 'articleSource',
          title: 'Source',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'url',
              type: 'url',
              validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'url' } },
        },
      ],
    }),
  ],
})