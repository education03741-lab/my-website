import { defineField, defineType } from "sanity";

export const ingredient = defineType({
  name: "ingredient",
  title: "Ingredient",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),

    defineField({
      name: "introduction",
      title: "Introduction",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "howItWorks",
      title: "How It Works",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "bestFor",
      title: "Best For",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "howToUse",
      title: "How to Use",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "pairsWith",
      title: "Pairs Well With",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "avoidWith",
      title: "Use With Caution",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "proTip",
      title: "Pro Tip",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "faqs",
      title: "Frequently Asked Questions",
      type: "array",
      of: [
        {
          type: "object",
          name: "faq",
          title: "FAQ",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "answer",
              title: "Answer",
              type: "array",
              of: [{ type: "block" }],
              validation: (Rule) => Rule.required(),
            }),
          ],

          preview: {
            select: {
              title: "question",
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});