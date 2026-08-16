import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import ContentNavigation from '@/components/ContentNavigation'
import { getServerSideURL } from '@/utilities/getURL'
import { ProjectHero } from '@/heros/ProjectsHero'
import Script from 'next/script'
import SocialShareButtons from '@/components/SocialShareButton'
import { Media } from '@/payload-types'
import { articleSchema } from '@/components/Schemas/ArticleSchema'
import { imageSchema } from '@/components/Schemas/ImageSchema'
import { aggregateRatingSchema } from '@/components/Schemas/AggregateRatingSchema'
import { breadcrumbSchema } from '@/components/Schemas/BreadcrumbSchema'
import { getOrganizationSchema } from '@/components/Schemas/OrganizationSchema'
import { getLocalBusinessSchema } from '@/components/Schemas/LocalBusiness'
import { getWebsiteSchema } from '@/components/Schemas/WebsiteSchema'
import { getProfessionalServiceSchema } from '@/components/Schemas/ProfessionalServiceSchema'
import { getProductSchema } from '@/components/Schemas/ProductSchema'
import { getPersonSchemas } from '@/components/Schemas/PersonSchema'
import { siteNavigationSchema } from '@/components/Schemas/SiteNavigationSchema'
import { videoExplainerSchema } from '@/components/Schemas/VideoExplainerSchema'
import { getGoogleReviews } from '@/utilities/getGoogleReviews'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

// 1. Cached Query with complete Field Selections to capture blocks & seo groups
const queryProjectBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
    // Explicit selection definition ensures data blocks skip filtering rules
    select: {
      slug: true,
      title: true,
      content: true,
      heroImage: true,
      projectImages: true,
      companyName: true,
      industry: true,
      website: true,
      meta: {
        title: true,
        description: true,
        image: true,
      },
      location: true, // Custom Location/Geo group matching seoFields definition
      social: true, // Custom OpenGraph & Twitter field group overrides
      jsonLDBlooks: true, // Complete custom Schema structured blocks loop list
    },
  })

  return result.docs?.[0] || null
})

export default async function Projects({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/projects/' + decodedSlug

  const project = await queryProjectBySlug({ slug: decodedSlug })

  if (!project) return <PayloadRedirects url={url} />

  const baseUrl = getServerSideURL()
  const projectUrl = `${baseUrl}/projects/${project.slug}`

  // Fetch all dynamic data in parallel
  const payload = await getPayload({ config: configPromise })

  const [googleData, agencySettings, personSchemas] = await Promise.all([
    getGoogleReviews(),
    payload.findGlobal({ slug: 'agency-settings', depth: 2, overrideAccess: true }),
    getPersonSchemas(),
  ])

  // Dynamic Schemas — full @graph for every project page
  const dynamicSchema = [
    await getOrganizationSchema({ agencySettings, googleReviews: googleData }),
    await getLocalBusinessSchema({ agencySettings }),
    await getWebsiteSchema({ agencySettings }),
    await getProfessionalServiceSchema({ agencySettings, googleReviews: googleData }),
    await getProductSchema({ agencySettings, googleReviews: googleData }),
    aggregateRatingSchema({
      ratingValue: googleData?.rating,
      reviewCount: googleData?.reviewCount,
      url: projectUrl,
    }),
    breadcrumbSchema({
      items: [
        { name: 'Home', url: baseUrl },
        { name: 'Projects', url: `${baseUrl}/projects` },
        { name: project.title, url: projectUrl },
      ],
    }),
    articleSchema(project),
    imageSchema(project.meta?.image as Media),
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

      <article className="">
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}

        <ProjectHero project={project} />

        <main className="border border-zinc-200 bg-white">
          <div className="container mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16 xl:gap-20">
              {/* Content Display Article Layout Container */}
              <article
                className="
                mx-auto w-full max-w-4xl text-zinc-600
                [&_h1]:mb-6 [&_h1]:mt-0 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-[1.1] [&_h1]:tracking-tight [&_h1]:text-zinc-950 md:[&_h1]:text-5xl
                [&_h2]:mb-5 [&_h2]:mt-14 [&_h2]:border-b [&_h2]:border-zinc-200 [&_h2]:pb-3 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-zinc-950 md:[&_h2]:text-4xl
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
                <RichText data={project.content} enableGutter={false} enableProse={false} />

                {/* Social Share — meta values passed server‑side so they match OG tags */}
                <SocialShareButtons
                  url={projectUrl}
                  title={project.meta?.title || project.title}
                  description={project.meta?.description || ''}
                  imageUrl={
                    typeof project.meta?.image === 'object' && project.meta?.image !== null
                      ? (project.meta.image as any).url || ''
                      : ''
                  }
                />
              </article>

              {/* Sticky Sidebar Navigation Components Panel */}
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
        </main>
      </article>
    </>
  )
}

// 2. Metadata API Compiler reading Custom Social and Geo Targeting values from database
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const project = await queryProjectBySlug({ slug: decodedSlug })

  if (!project) return {}

  const meta = (project as any).meta || {}
  const location = (project as any).location || {}
  const social = (project as any).social || {}

  const metaImageUrl =
    typeof meta.image === 'object' && meta.image !== null ? (meta.image as any).url : undefined

  const serverUrl = getServerSideURL()
  const canonicalUrl =
    meta.robots?.canonicalUrl ||
    meta.canonicalUrl ||
    `${serverUrl}/projects/${project.slug || decodedSlug}`

  return {
    title: meta.title || project.title,
    description: meta.description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: social.ogTitle || meta.title || project.title,
      description: social.ogDescription || meta.description,
      type: 'article',
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

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return projects.docs.map(({ slug }) => ({ slug })) || []
}
