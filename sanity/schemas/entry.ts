import { defineType, defineField } from 'sanity'

export const entry = defineType({
  name: 'entry',
  title: 'World Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'entryType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: '📚 Book', value: 'book' },
          { title: '🎬 Movie', value: 'movie' },
          { title: '🎨 Artwork (my painting)', value: 'artwork' },
          { title: '📷 Photo', value: 'photo' },
          { title: '💭 Thought / Idea', value: 'thought' },
          { title: '🧍 Character', value: 'character' },
          { title: '🎵 Music', value: 'music' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description / Content',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'entryType', media: 'image' },
  },
})
