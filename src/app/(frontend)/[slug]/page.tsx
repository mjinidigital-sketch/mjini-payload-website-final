import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getServerSideURL } from '@/utilities/getURL'
import type { Media, Page } from '@/payload-types'
import { aggregateRatingSchema } from '@/components/Schemas/AggregateRatingSchema'
import { imageSchema } from '@/components/Schemas/ImageSchema'
import { getLocalBusinessSchema } from '@/components/Schemas/LocalBusiness'
import { offerCatalogSchema } from '@/components/Schemas/OfferCatalogSchema'
import { getOrganizationSchema } from '@/components/Schemas/OrganizationSchema'
import { getProductSchema } from '@/components/Schemas/ProductSchema'
import { getProfessionalServiceSchema } from '@/components/Schemas/ProfessionalServiceSchema'
import { getWebsiteSchema } from '@/components/Schemas/WebsiteSchema'
import { getPersonSchemas } from '@/components/Schemas/PersonSchema'
import { breadcrumbSchema } from '@/components/Schemas/BreadcrumbSchema'
import { articleSchema } from '@/components/Schemas/ArticleSchema'
import { siteNavigationSchema } from '@/components/Schemas/SiteNavigationSchema'
import { videoExplainerSchema } from '@/components/Schemas/VideoExplainerSchema'
import { getGoogleReviews } from '@/utilities/getGoogleReviews'
import Script from 'next/script'
import SocialShareButtons from '@/components/SocialShareButton'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

// Cached document payload fetch routine
const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

// Resolves any pricingBlock entries in the layout into a flat `plans` array
// so downstream components stay presentational (no Payload imports).
async function resolveLayoutData(layout: Page['layout']) {
  if (!Array.isArray(layout)) return layout

  const payload = await getPayload({ config: configPromise })

  return Promise.all(
    layout.map(async (block: any) => {
      if (block?.blockType !== 'pricingBlock') return block

      let docs: any[] = []

      if (block.populateBy === 'service' && block.service) {
        const serviceId = typeof block.service === 'object' ? block.service.id : block.service

        if (serviceId) {
          const result = await payload.find({
            collection: 'pricing',
            where: { service: { equals: serviceId } },
            limit: block.limit ?? 6,
            depth: 0,
          })
          docs = result.docs
        }
      } else if (block.populateBy === 'selection' && Array.isArray(block.selectedDocs)) {
        const ids = block.selectedDocs
          .map((d: any) => (typeof d === 'object' ? d.id : d))
          .filter(Boolean)

        if (ids.length > 0) {
          const result = await payload.find({
            collection: 'pricing',
            where: { id: { in: ids } },
            limit: ids.length,
            depth: 0,
          })
          docs = result.docs
        }
      }

      return { ...block, plans: docs }
    }),
  )
}

// Dynamic Next.js Page Generation Handler
export default async function Page(props: Args) {
  const { slug = 'home' } = await props.params
  const url = `${getServerSideURL()}/${slug}`

  const page = await queryPageBySlug({ slug })

  if (!page) {
    return notFound()
  }

  const resolvedLayout = await resolveLayoutData(page.layout)
  // Fetch Google reviews, agency settings in parallel
  const payload = await getPayload({ config: configPromise })

  const [googleData, agencySettings] = await Promise.all([
    getGoogleReviews(),
    payload.findGlobal({
      slug: 'agency-settings',
      depth: 2,
      overrideAccess: true,
    }),
  ])

  const [personSchemas] = await Promise.all([getPersonSchemas()])

  const dynamicSchema = [
    await getOrganizationSchema({ agencySettings, googleReviews: googleData }),
    await getLocalBusinessSchema({ agencySettings }),
    await getWebsiteSchema({ agencySettings }),
    await getProfessionalServiceSchema({ agencySettings, googleReviews: googleData }),
    await getProductSchema({ agencySettings, googleReviews: googleData }),
    aggregateRatingSchema({
      ratingValue: googleData?.rating,
      reviewCount: googleData?.reviewCount,
    }),
    breadcrumbSchema({
      items: [
        { name: 'Home', url: url },
        { name: page.title, url: url },
      ],
    }),
    articleSchema(page),
    imageSchema(page.meta?.image as Media),
    siteNavigationSchema(),
    videoExplainerSchema({}),
    ...personSchemas,
  ].filter(Boolean)

  return (
    <>
      <Script id="schema-jsonld" type="application/ld+json" strategy={'lazyOnload'}>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': dynamicSchema,
        })}
      </Script>
      <article className="pt-16 pb-24">
        <LivePreviewListener />

        {/* Render core user interfaces */}
        <RenderHero {...page.hero} />
        <RenderBlocks blocks={resolvedLayout as Page['layout']} />

        {/* Social Share — bottom of each page, meta values from Payload SEO fields */}
        <div className="container mx-auto max-w-4xl px-4 md:px-8 pb-8">
          <SocialShareButtons
            url={url}
            title={page.meta?.title || page.title}
            description={page.meta?.description || ''}
            imageUrl={
              typeof page.meta?.image === 'object' && page.meta?.image !== null
                ? (page.meta.image as any).url || ''
                : ''
            }
          />
        </div>
      </article>
    </>
  )
}

// 2. Next.js Metadata Compiler capturing SEO plugin fields + manual properties
export async function generateMetadata(props: Args): Promise<Metadata> {
  const { slug = 'home' } = await props.params
  const page = await queryPageBySlug({ slug })

  if (!page) return {}

  const meta = (page as any).meta || {}
  const location = (page as any).location || {}
  const social = (page as any).social || {}

  const metaImageUrl =
    typeof meta.image === 'object' && meta.image !== null ? (meta.image as any).url : undefined

  const serverUrl = getServerSideURL()
  const isHome = slug === 'home' || slug === '/'
  const canonicalUrl =
    meta.robots?.canonicalUrl ||
    meta.canonicalUrl ||
    (isHome ? `${serverUrl}/` : `${serverUrl}/${slug}`)

  return {
    title: meta.title || page.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: social.ogTitle || meta.title || page.title,
      description: social.ogDescription || meta.description,
      type: 'website',
      url: canonicalUrl,
      images: metaImageUrl ? [{ url: metaImageUrl }] : [],
    },
    twitter: {
      card: social.twitterCard || 'summary_large_image',
      title: social.twitterTitle || meta.title,
      description: social.twitterDescription || meta.description,
      images: metaImageUrl ? [metaImageUrl] : [],
    },
    other: {
      ...(location.placeName && { 'geo.placename': location.placeName }),
      ...(location.latitude &&
        location.longitude && {
          'geo.position': `${location.latitude};${location.longitude}`,
          ICBM: `${location.latitude}, ${location.longitude}`,
        }),
    },
  }
}

// Static generation route criteria mapping values down
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return pages.docs?.filter((doc) => doc.slug !== 'home').map(({ slug }) => ({ slug })) || []
}
