import { defineField, defineType } from 'sanity'

export const message = defineType({
  name: 'message',
  title: 'Messages',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'message', type: 'text' }),
    defineField({ name: 'submittedAt', type: 'datetime' }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'email' },
  },
})