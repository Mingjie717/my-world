import { groq } from 'next-sanity'

export const allEntriesQuery = groq`
  *[_type == "entry"] | order(_createdAt desc) {
    _id,
    title,
    entryType,
    description,
    image,
    date,
    tags
  }
`
