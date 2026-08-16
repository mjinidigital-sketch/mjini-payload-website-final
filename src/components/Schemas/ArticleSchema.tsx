import { Media, User } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { personSchema } from './PersonSchema'

export const articleSchema = (props: any) => {
  const image = props.meta?.image as Media
  const authors = props.authors as (User | any)[]
  const url = getServerSideURL()

  const settings = props.agencySettings
  const commerceSettings = settings?.commerce

  // Safely format ISO strings to prevent application crashes
  const formatDate = (dateString: any) => {
    if (!dateString) return undefined
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? undefined : date.toISOString()
  }

  // Construct absolute image URL safely using modern URL constructor
  let imageUrl = ''
  if (image?.filename && process.env.S3_ENDPOINT && process.env.S3_BUCKET) {
    try {
      imageUrl = new URL(`${process.env.S3_BUCKET}/${image.filename}`, process.env.S3_ENDPOINT).href
    } catch {
      imageUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${image.filename}`
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title?.substring(0, 110),
    description: props.excerpt || props.meta?.description,
    image: imageUrl ? [imageUrl] : [],
    articleBody: props.content,
    sameAs: props.socialLinks || [],

    // Uses safe formatting function
    datePublished: formatDate(props.createdAt),
    dateModified: formatDate(props.updatedAt),

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': props.slug ? `${url}/${props?.path || ''}/${props.slug}` : url,
    },

    // Cleaner author extraction fallback loop
    author: Array.isArray(authors)
      ? authors.map((author: any) => {
          if (author && typeof author === 'object') {
            return personSchema(author)
          }
          return {
            '@type': 'Person',
            name: String(author || 'Anonymous'),
          }
        })
      : [],

    publisher: {
      '@type': 'Organization',
      name: settings?.identity?.name || 'Mjini Digital',
      url: url,
      logo: {
        '@type': 'ImageObject',
        url: `${url}/logo.png`,
      },
    },

    // Strict string conversion for keywords mapping
    keywords: [
      ...new Set([
        ...(commerceSettings?.defaultKeywords || []).map((k: any) => String(k?.keyword || k)),
        'Mjini Digital',
        'Web Design Kenya',
        'SEO Agency Nairobi',
        'Digital Marketing Africa',
      ]),
    ]
      .filter(Boolean)
      .join(', '),
  }
}
