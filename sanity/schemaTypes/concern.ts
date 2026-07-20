import { defineField, defineType } from 'sanity'

export const concern = defineType({
  name: 'concern',
  title: 'Skin Concern',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'emoji', type: 'string' }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'overview', type: 'text' }),

    defineField({ name: 'causesIntro', type: 'text' }),
    defineField({
      name: 'causes',
      title: 'Causes',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({ name: 'treatmentsIntro', type: 'text' }),
    defineField({
      name: 'treatments',
      title: 'Treatments',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({ name: 'avoidIntro', type: 'text' }),
    defineField({
      name: 'avoid',
      title: 'Avoid',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({ name: 'routineIntro', type: 'text' }),
    defineField({
      name: 'routine',
      title: 'Routine',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'routineStep',
          fields: [
            defineField({
              name: 'time',
              title: 'Time',
              type: 'string',
              options: { list: ['AM', 'PM'] },
            }),
            defineField({
              name: 'steps',
              title: 'Steps',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
        },
      ],
    }),

    defineField({ name: 'dermIntro', type: 'text' }),
    defineField({
      name: 'seeADermatologistIf',
      title: 'See a Dermatologist If',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})