import { Media, User } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { personSchema } from './PersonSchema'

export const articleSchema = (props: any) => {
  const image = props.meta?.image as Media
  const authors = props.authors as (User | any)[]
  const publisher = props.publisher?.[0] as any // Assuming first publisher object
  const url = getServerSideURL()

  // Construct absolute image URL safely
  const imageUrl = image?.filename
    ? `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${image.filename}`
    : ''

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title?.substring(0, 110), // Google limits headlines to 110 characters
    description: props.excerpt || props.meta?.description,
    image: imageUrl ? [imageUrl] : [],
    articleBody: props.content,
    sameAs: props.socialLinks || [],

    // ISO 8601 strings are strictly required instead of Date objects
    datePublished: props.createdAt ? new Date(props.createdAt).toISOString() : undefined,
    dateModified: props.updatedAt ? new Date(props.updatedAt).toISOString() : undefined,

    // MainEntity establishes the canonical URL of the article for Google
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${url}/articles/${props.slug}`,
    },

    // Dynamic Person schema integration for authors
    author:
      authors?.map((author: any) => {
        if (typeof author === 'object' && author !== null && 'name' in author) {
          return personSchema(author)
        }
        return {
          '@type': 'Person',
          name: String(author),
        }
      }) || [],


    // Critical for News/Article visibility and E-E-A-T rankings
    publisher: {
      '@type': 'Organization',
      name: publisher?.name || 'Your Brand Name',
      url: url,
      logo: {
        '@type': 'ImageObject',
        url: `${url}/logo.png`, // Must be a physical image asset
      },
    },

    // Explode tags array into strings if available
    keywords: props.tags?.map((tag: any) => tag.name).join(', ') || '',
  }
}
