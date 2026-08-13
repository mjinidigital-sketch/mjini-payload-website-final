import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import RichText from '@/components/RichText'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ServiceHero } from '@/heros/ServicesHero'
import ContentNavigation from '@/components/ContentNavigation'
import { getServerSideURL } from '@/utilities/getURL'
import { articleSchema } from '@/components/Schemas/ArticleSchema'
import { Media, Page, Faq } from '@/payload-types'
import Script from 'next/script'
import SocialShareButtons from '@/components/SocialShareButton'
import { imageSchema } from '@/components/Schemas/ImageSchema'
import { offerCatalogSchema } from '@/components/Schemas/OfferCatalogSchema'
import { aggregateRatingSchema } from '@/components/Schemas/AggregateRatingSchema'
import { getProductSchema } from '@/components/Schemas/ProductSchema'
import { getGoogleReviews } from '@/utilities/getGoogleReviews'
import { getProfessionalServiceSchema } from '@/components/Schemas/ProfessionalServiceSchema'
import { getWebsiteSchema } from '@/components/Schemas/WebsiteSchema'
import { breadcrumbSchema } from '@/components/Schemas/BreadcrumbSchema'
import { faqSchema } from '@/components/Schemas/FAQSchema'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { getOrganizationSchema } from '@/components/Schemas/OrganizationSchema'
import { getLocalBusinessSchema } from '@/components/Schemas/LocalBusiness'
import { getPersonSchemas } from '@/components/Schemas/PersonSchema'
import { siteNavigationSchema } from '@/components/Schemas/SiteNavigationSchema'
import { videoExplainerSchema } from '@/components/Schemas/VideoExplainerSchema'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

// Resolves any pricingBlock entries in the layout into a flat `plans` array
async function resolveLayoutData(layout?: Page['layout'], serviceId?: number) {
  if (!Array.isArray(layout)) return layout

  const payload = await getPayload({ config: configPromise })

  return Promise.all(
    layout.map(async (block: any) => {
      if (block?.blockType !== 'pricingBlock') return block

      let docs: any[] = []

      const targetServiceId =
        (block.populateBy === 'service' && block.service
          ? typeof block.service === 'object'
            ? block.service.id
            : block.service
          : null) || serviceId

      if (block.populateBy === 'service' && targetServiceId) {
        const result = await payload.find({
          collection: 'pricing',
          where: { service: { equals: targetServiceId } },
          limit: block.limit ?? 6,
          depth: 0,
        })
        docs = result.docs
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

// 1. Cached Query containing complete selections to load custom block arrays
const queryServiceBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'services',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
    // Explicit selection array prevents Payload API from dropping fields
    select: {
      id: true,
      slug: true,
      title: true,
      subTitle: true,
      content: true,
      summary: true,
      meta: {
        title: true,
        description: true,
        image: true,
      },
      location: true, // Custom Location/Geo targeting fields group
      social: true, // Custom OpenGraph and Twitter fields group
      jsonLDBlocks: true, // FIXED: Corrected spelling typo from jsonLDBlooks
      layout: true,
    },
  })

  return result.docs?.[0] || null
})

export default async function Services({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise

  const decodedSlug = decodeURIComponent(slug)
  const service = await queryServiceBySlug({ slug: decodedSlug })

  if (!service) {
    return <PayloadRedirects url={`/services/${decodedSlug}`} />
  }

  const baseUrl = getServerSideURL()
  const serviceUrl = `${baseUrl}/services/${service.slug}`

  const resolvedLayout = await resolveLayoutData(
    (service as any).layout as Page['layout'],
    service.id,
  )

  // Fetch Google reviews, pricing, FAQs, and agency settings in parallel
  const payload = await getPayload({ config: configPromise })

  const [googleData, pricingDocs, faqDocs, agencySettings, personSchemas] = await Promise.all([
    getGoogleReviews(),
    payload.find({
      collection: 'pricing',
      where: { service: { equals: service.id } },
      limit: 10,
      depth: 1,
    }),
    payload.find({
      collection: 'faqs',
      where: { service: { equals: service.id } },
      sort: 'createdAt',
      limit: 20,
      depth: 0,
    }),
    payload.findGlobal({
      slug: 'agency-settings',
      depth: 2,
      overrideAccess: true,
    }),
    getPersonSchemas(),
  ])

  // Dynamic Schemas
  // FIXED: Passed live data fields straight into the rating runtime parameters
  const dynamicSchema = [
    await getOrganizationSchema({ agencySettings, googleReviews: googleData }),
    await getLocalBusinessSchema({ agencySettings }),

    breadcrumbSchema({
      items: [
        { name: 'Home', url: baseUrl },
        { name: 'Services', url: `${baseUrl}/services` },
        { name: service.title, url: serviceUrl },
      ],
    }),
    await getWebsiteSchema({ agencySettings }),
    await getProfessionalServiceSchema({
      agencySettings,
      service,
      pricings: pricingDocs.docs,
      googleReviews: googleData,
    }),
    await getProductSchema({
      agencySettings,
      service,
      pricings: pricingDocs.docs,
      googleReviews: googleData,
    }),
    aggregateRatingSchema({
      ratingValue: googleData?.rating,
      reviewCount: googleData?.reviewCount,
      url: serviceUrl,
    }),
    articleSchema(service),
    imageSchema(service.meta?.image as Media),
    offerCatalogSchema({
      service,
      pricings: pricingDocs.docs,
      agencySettings,
    }),
    // FAQs scoped to this service — returns null when none exist (filtered out below)
    faqSchema({
      service,
      faqs: faqDocs.docs as Faq[],
      url: serviceUrl,
    }),
    siteNavigationSchema(),
    videoExplainerSchema({}),
    ...personSchemas,
  ].filter(Boolean)

  return (
    <>
      {/* FIXED: Flattened structural array nested into a structured @graph container object */}
      <Script id="schema-jsonld" type="application/ld+json" strategy={'lazyOnload'}>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': dynamicSchema,
        })}
      </Script>

      <PayloadRedirects disableNotFound url={serviceUrl} />
      {draft && <LivePreviewListener />}

      <ServiceHero service={service} />

      <main className="border border-zinc-200 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16 xl:gap-20">
            {/* Content Display Article */}
            <article
              className="
                mx-auto w-full max-w-4xl text-zinc-600
                [&_h1]:mb-6 [&_h1]:mt-0 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-[1.1] [&_h1]:tracking-tight [&_h1]:text-zinc-950 md:[&_h1]:text-5xl
                [&_h2]:mb-5 [&_h2]:mt-0 [&_h2]:border-b [&_h2]:border-zinc-200 [&_h2]:pb-3 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-zinc-950 md:[&_h2]:text-4xl
                [&_h3]:mb-4 [&_h3]:mt-10 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:tracking-tight [&_h3]:text-zinc-950
                [&_h4]:mb-3 [&_h4]:mt-8 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:leading-tight [&_h4]:text-zinc-950
                [&_p]:mb-6 [&_p]:text-base [&_p]:leading-8 [&_p]:text-zinc-700 md:[&_p]:text-[18px]
                [&_strong]:font-semibold [&_strong]:text-zinc-950
                [&_em]:italic
                [&_a]:font-medium [&_a]:text-zinc-950 [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-opacity [&_a]:hover:opacity-60
                [&_ul]:mb-7 [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:list-disc
                [&_ol]:mb-7 [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:list-decimal
                [&_li]:pl-1 [&_li]:leading-7
                [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-900 [&_blockquote]:pl-6 [&_blockquote]:text-lg [&_blockquote]:italic [&_blockquote]:text-zinc-700
                [&_hr]:my-10 [&_hr]:border-zinc-200
                [&_img]:my-8 [&_img]:rounded-2xl [&_img]:border [&_img]:border-zinc-200
              "
            >
              <hr className="w-[80px] h-2 bg-accent -mb-2" />
              <RichText data={service.content} enableGutter={false} enableProse={false} />

              {/* Social Share — meta values passed server‑side so they match OG tags */}
              <SocialShareButtons
                url={serviceUrl}
                title={service.meta?.title || service.title}
                description={service.meta?.description || ''}
                imageUrl={
                  typeof service.meta?.image === 'object' && service.meta?.image !== null
                    ? (service.meta.image as any).url || ''
                    : ''
                }
              />
            </article>

            {/* Sidebar Sticky Tracking Column Container */}
            <aside className="lg:sticky lg:top-24 lg:self-start mt-12">
              <div className="rounded-2xl border border-zinc-200">
                <div className="p-4 border-b border-zinc-200 bg-primary/90 rounded-t-lg">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white pl-2">
                    On this page
                  </p>
                </div>
                <ContentNavigation />
              </div>
            </aside>
          </div>
        </div>

        <RenderBlocks blocks={resolvedLayout as Page['layout']} />
      </main>
    </>
  )
}

// 2. Dynamic Next.js Metadata API Engine resolving custom properties gracefully
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const service = await queryServiceBySlug({ slug: decodedSlug })

  if (!service) return {}

  const meta = (service as any).meta || {}
  const location = (service as any).location || {}
  const social = (service as any).social || {}

  const metaImageUrl =
    typeof meta.image === 'object' && meta.image !== null ? (meta.image as any).url : undefined

  return {
    title: meta.title || service.title,
    description: meta.description,

    openGraph: {
      title: social.ogTitle || meta.title || service.title,
      description: social.ogDescription || meta.description,
      type: 'website',
      url: `${getServerSideURL()}/services/${service.slug}`,
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

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const services = await payload.find({
    collection: 'services',
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return services.docs.map(({ slug }) => ({ slug })) || []
}
