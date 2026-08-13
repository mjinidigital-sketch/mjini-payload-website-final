import { Media } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

export const imageSchema = (props: Media | string | null | undefined) => {
  if (!props) return null

  // If props is a string (ID or URL string)
  if (typeof props === 'string') {
    const isFullUrl = props.startsWith('http://') || props.startsWith('https://')
    const imageUrl = isFullUrl
      ? props
      : `${getServerSideURL()}${props.startsWith('/') ? '' : '/'}${props}`
    return {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: imageUrl,
      url: imageUrl,
    }
  }

  // Determine image URL safely across S3 and local URL patterns
  let imageUrl = props.url || ''

  if (!imageUrl && props.filename) {
    if (process.env.S3_ENDPOINT && process.env.S3_BUCKET) {
      imageUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${props.filename}`
    } else if (process.env.S3_ENDPOINT && process.env.S3_BUCKET) {
      imageUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${props.filename}`
    } else {
      imageUrl = `/media/${props.filename}`
    }
  }

  if (!imageUrl) return null

  // Ensure absolute URL for JSON-LD compliance
  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    const baseUrl = getServerSideURL()
    imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
  }

  const creditText = (props as any).creditext || (props as any).creditText || undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: imageUrl,
    url: imageUrl,
    creditText,
    creator: creditText
      ? {
          '@type': 'Person',
          name: creditText,
        }
      : undefined,
    thumbnailUrl: imageUrl,
    copyrightNotice: (props as any).creditText,
    width: (props as any).width,
    height: (props as any).height,
    caption: (props as any).caption,
    alt: (props as any).alt,
    abstract: (props as any).description,
    dateCreated: (props as any).createdAt,
    dateModified: (props as any).updatedAt,
  }
}
