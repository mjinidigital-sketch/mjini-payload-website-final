import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const meta = (doc?.meta as any) || {}

  const ogImage = getImageURL(meta.image)

  const title = meta.title ? meta.title + ' | Mjini Digital' : 'Mjini Digital'

  const description = meta.description
  const url = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug || '/'
  const serverUrl = getServerSideURL()
  const fullUrl = `${serverUrl}/${url === 'home' || url === '/' ? '' : url}`

  const { robots, social, customMetaTags, location } = meta

  let robotsMeta: Metadata['robots'] = undefined
  if (robots) {
    robotsMeta = {
      index: !robots.noIndex,
      follow: !robots.noFollow,
      noarchive: robots.noArchive,
      noimageindex: robots.noImageIndex,
    }
  }

  const canonicalUrl = robots?.canonicalUrl || meta?.canonicalUrl || fullUrl

  let customOther: Record<string, string> = {}
  if (Array.isArray(customMetaTags)) {
    customMetaTags.forEach((tag) => {
      if (tag.type && tag.key && tag.content) {
        customOther[tag.key] = tag.content
      }
    })
  }

  if (location) {
    if (location.latitude && location.longitude) {
      customOther['ICBM'] = `${location.latitude}, ${location.longitude}`
      customOther['geo.position'] = `${location.latitude};${location.longitude}`
    }
    if (location.placeName) {
      customOther['geo.placename'] = location.placeName
    }
  }

  const openGraphTitle = social?.ogTitle || title
  const openGraphDescription = social?.ogDescription || description
  const twitterTitle = social?.twitterTitle || title
  const twitterDescription = social?.twitterDescription || description

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: robotsMeta,
    openGraph: mergeOpenGraph({
      description: openGraphDescription || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: openGraphTitle,
      url: fullUrl,
    }),
    twitter: {
      card: social?.twitterCard || 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    other: Object.keys(customOther).length > 0 ? customOther : undefined,
  }
}
