import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import RichText from '@/components/RichText'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PostHero } from '@/heros/PostHero'
import ContentNavigation from '@/components/ContentNavigation'
import { getServerSideURL } from '@/utilities/getURL'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { Media } from '@/payload-types'
import Script from 'next/script'
import SocialShareButtons from '@/components/SocialShareButton'
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

// 1. Cached Query containing complete selections to load custom block arrays
const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
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
      slug: true,
      title: true,
      content: true,
      summary: true,
      meta: {
        title: true,
        description: true,
        image: true,
      },
      location: true, // Custom Location/Geo targeting fields group
      social: true, // Custom OpenGraph and Twitter fields group
      jsonLDBlooks: true, // Custom repeating schema block array
    },
  })

  return result.docs?.[0] || null
})

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise

  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) {
    return <PayloadRedirects url={`/posts/${decodedSlug}`} />
  }

  const baseUrl = getServerSideURL()
  const postUrl = `${baseUrl}/posts/${post.slug}`

  // Fetch all dynamic data in parallel
  const payload = await getPayload({ config: configPromise })

  const [googleData, agencySettings, personSchemas] = await Promise.all([
    getGoogleReviews(),
    payload.findGlobal({ slug: 'agency-settings', depth: 2, overrideAccess: true }),
    getPersonSchemas(),
  ])

  // Dynamic Schemas — full @graph for every post page
  const dynamicSchema = [
    await getOrganizationSchema({ agencySettings, googleReviews: googleData }),
    await getLocalBusinessSchema({ agencySettings }),
    await getWebsiteSchema({ agencySettings }),
    await getProfessionalServiceSchema({ agencySettings, googleReviews: googleData }),
    await getProductSchema({ agencySettings, googleReviews: googleData }),
    aggregateRatingSchema({
      ratingValue: googleData?.rating,
      reviewCount: googleData?.reviewCount,
      url: postUrl,
    }),
    breadcrumbSchema({
      items: [
        { name: 'Home', url: baseUrl },
        { name: 'Blog', url: `${baseUrl}/posts` },
        { name: post.title, url: postUrl },
      ],
    }),
    articleSchema(post),
    imageSchema(post.meta?.image as Media),
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

      <PayloadRedirects disableNotFound url={postUrl} />
      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <main className="border border-zinc-200 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16 xl:gap-20">
            {/* Content Display Article */}
            <article
              className="
                mx-auto w-full max-w-4xl text-zinc-600
                [&_h1]:mb-6 [&_h1]:mt-0 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-[1.1] [&_h1]:tracking-tight [&_h1]:text-zinc-950 md:[&_h1]:text-5xl
                [&_h2]:mb-5 [&_h2]:mt-10 [&_h2]:border-b [&_h2]:border-zinc-200 [&_h2]:pb-3 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-zinc-950 md:[&_h2]:text-4xl
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
                [&_hr]:mt-8 [&_hr]:border-zinc-200
                [&_img]:my-8 [&_img]:rounded-2xl [&_img]:border [&_img]:border-zinc-200
              "
            >
              <RichText data={post.content} enableGutter={false} enableProse={false} />

              {/* Social Share — meta values passed server‑side so they match OG tags */}
              <SocialShareButtons
                url={postUrl}
                title={post.meta?.title || post.title}
                description={post.meta?.description || ''}
                imageUrl={
                  typeof post.meta?.image === 'object' && post.meta?.image !== null
                    ? (post.meta.image as any).url || ''
                    : ''
                }
              />

              {post.relatedPosts && post.relatedPosts.length > 0 && (
                <RelatedPosts
                  className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
                  docs={post.relatedPosts.filter((post) => typeof post === 'object')}
                />
              )}
            </article>

            {/* Sidebar Sticky Tracking Column Container */}
            <aside className="lg:sticky lg:top-24 lg:self-start mt-10">
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
    </>
  )
}

// 2. Dynamic Next.js Metadata API Engine resolving custom properties gracefully
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return {}

  const meta = (post as any).meta || {}
  const location = (post as any).location || {}
  const social = (post as any).social || {}

  const metaImageUrl =
    typeof meta.image === 'object' && meta.image !== null ? (meta.image as any).url : undefined

  return {
    title: meta.title || post.title,
    description: meta.description,

    openGraph: {
      title: social.ogTitle || meta.title || post.title,
      description: social.ogDescription || meta.description,
      type: 'article',
      url: `${getServerSideURL()}/posts/${post.slug}`,
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
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return posts.docs.map(({ slug }) => ({ slug })) || []
}
