import { Service, Pricing, Media } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { getGoogleReviews } from '@/utilities/getGoogleReviews'
import { offerCatalogSchema } from './OfferCatalogSchema'
import { aggregateRatingSchema } from './AggregateRatingSchema'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export interface ProductSchemaInputProps {
  agencySettings?: any
  service?: Partial<Service> | null
  services?: Partial<Service>[] | null
  pricings?: Partial<Pricing>[] | null
  plans?: Partial<Pricing>[] | null
  slug?: string
  keywords?: string[] | null
  location?: string[] | null
  serviceId?: string | number
  url?: string
  packageName?: string
  name?: string
  description?: string
  image?: string | Media
  price?: string | number
  currency?: string
  priceValidUntil?: string
  category?: string
  availability?: string
  ratingValue?: string | number
  reviewCount?: string | number
  googleReviews?: {
    rating?: number
    reviewCount?: number
  } | null
  catalogName?: string
  [key: string]: any
}

/**
 * Builds a Schema.org compliant Product JSON-LD structure for Mjini Digital services.
 * Dynamically integrates Service collection docs, OfferCatalogSchema (pricing plans), AgencySettings global, and AggregateRatingSchema (Google Reviews).
 */
export const productSchema = (props: ProductSchemaInputProps = {}) => {
  const baseUrl = getServerSideURL() || 'https://mjinidigital.co.ke'
  const settings = props.agencySettings
  const identity = settings?.identity
  const commerceSettings = settings?.commerce

  const orgName = identity?.name || 'Mjini Digital'
  const legalName = identity?.legalName || 'Mjini Digital Agency Ltd'
  const slogan = identity?.slogan || 'Empowering African Brands Online'

  let logoUrl = `${baseUrl}/logo.png`
  if (identity?.logo) {
    if (typeof identity.logo === 'object' && identity.logo.url) {
      logoUrl = identity.logo.url.startsWith('http')
        ? identity.logo.url
        : `${baseUrl}${identity.logo.url.startsWith('/') ? '' : '/'}${identity.logo.url}`
    } else if (typeof identity.logo === 'string') {
      logoUrl = identity.logo.startsWith('http')
        ? identity.logo
        : `${baseUrl}${identity.logo.startsWith('/') ? '' : '/'}${identity.logo}`
    }
  }

  // Target areas for local and international service delivery
  let targetAreas: any[] = []
  if (Array.isArray(commerceSettings?.areaServed) && commerceSettings.areaServed.length > 0) {
    targetAreas = commerceSettings.areaServed.map((a: any) =>
      typeof a === 'string'
        ? { '@type': 'Country', name: a }
        : { '@type': a.type || 'Country', name: a.name, ...(a.sameAs ? { sameAs: a.sameAs } : {}) },
    )
  } else if (Array.isArray(identity?.areaServed) && identity.areaServed.length > 0) {
    targetAreas = identity.areaServed.map((a: any) =>
      typeof a === 'string'
        ? { '@type': 'Country', name: a }
        : { '@type': a.type || 'Country', name: a.name, ...(a.sameAs ? { sameAs: a.sameAs } : {}) },
    )
  } else {
    targetAreas = [
      { '@type': 'City', name: 'Nairobi' },
      { '@type': 'AdministrativeArea', name: 'Mombasa' },
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'AdministrativeArea', name: 'East Africa' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
    ]
  }

  // Resolve service(s) context
  let serviceList: Partial<Service>[] = []
  if (Array.isArray(props.services) && props.services.length > 0) {
    serviceList = props.services
  } else if (props.service) {
    serviceList = [props.service]
  }

  // Resolve pricings context
  const pricingList: Partial<Pricing>[] = props.pricings || props.plans || []

  // Resolve aggregate rating from Google Places API or props fallback
  const ratingValue = props.ratingValue ?? props.googleReviews?.rating ?? '4.9'
  const reviewCount = props.reviewCount ?? props.googleReviews?.reviewCount ?? '48'

  const aggregateRatingNode = aggregateRatingSchema({
    ratingValue,
    reviewCount,
    url: props.url || baseUrl,
  })?.aggregateRating || {
    '@type': 'AggregateRating',
    ratingValue: String(ratingValue),
    reviewCount: String(reviewCount),
    bestRating: '5',
    worstRating: '1',
  }

  // Common Brand & Organization metadata mapped dynamically
  const brandObj = {
    '@type': 'Brand',
    name: orgName,
    url: baseUrl,
    logo: logoUrl,
    slogan,
  }

  const providerObj = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: orgName,
    legalName,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl,
    },
  }

  // Helper to build a single Product Schema for a given service doc or fallback props
  const buildSingleProductSchema = (
    svc?: Partial<Service> | null,
    pricingsForSvc: Partial<Pricing>[] = [],
  ) => {
    const serviceSlug = svc?.slug || props.slug || ''
    const pageUrl =
      props.url || (serviceSlug ? `${baseUrl}/services/${serviceSlug}` : `${baseUrl}/services`)

    const title =
      svc?.title || props.packageName || props.name || 'Custom Web Design & Digital Growth Services'

    const subTitle = svc?.subTitle || props.category || 'Web Design & Software Development'

    const description =
      svc?.summary ||
      svc?.meta?.description ||
      props.description ||
      `Complete custom website development, responsive design, technical SEO, and digital transformation packages engineered for high conversion rates by ${orgName} in Nairobi.`

    // Resolve Image URL
    let imageUrls: string[] = []
    if (props.image) {
      if (typeof props.image === 'string') {
        const full = props.image.startsWith('http')
          ? props.image
          : `${baseUrl}${props.image.startsWith('/') ? '' : '/'}${props.image}`
        imageUrls.push(full)
      } else if (typeof props.image === 'object' && props.image.url) {
        imageUrls.push(
          props.image.url.startsWith('http')
            ? props.image.url
            : `${baseUrl}${props.image.url.startsWith('/') ? '' : '/'}${props.image.url}`,
        )
      }
    }

    if (imageUrls.length === 0 && svc?.meta?.image) {
      const metaImg = svc.meta.image as Media | string
      if (typeof metaImg === 'string') {
        imageUrls.push(
          metaImg.startsWith('http')
            ? metaImg
            : `${baseUrl}${metaImg.startsWith('/') ? '' : '/'}${metaImg}`,
        )
      } else if (metaImg?.url) {
        imageUrls.push(
          metaImg.url.startsWith('http')
            ? metaImg.url
            : `${baseUrl}${metaImg.url.startsWith('/') ? '' : '/'}${metaImg.url}`,
        )
      } else if (metaImg?.filename) {
        const path =
          process.env.S3_ENDPOINT && process.env.S3_BUCKET
            ? `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${metaImg.filename}`
            : `${baseUrl}/media/${metaImg.filename}`
        imageUrls.push(path)
      }
    }

    if (imageUrls.length === 0) {
      imageUrls.push(logoUrl)
    }

    // Identifiers SKU & MPN
    const skuCode = serviceSlug
      ? `MJINI-SVC-${serviceSlug.toUpperCase().replace(/[^A-Z0-9]/g, '-')}`
      : 'MJINI-DIGITAL-PACKAGE'
    const mpnCode = svc?.id ? `MJINI-ID-${svc.id}` : 'MJINI-MPN-001'

    // Build offers list from pricings or fallback single offer
    let offersList: any[] = []
    const nextYear = new Date().getFullYear() + 1
    const priceValidUntil = props.priceValidUntil || `${nextYear}-12-31`

    if (pricingsForSvc.length > 0) {
      offersList = pricingsForSvc.map((plan) => {
        const rawPrice = plan.price
        const formattedPrice =
          rawPrice !== undefined && rawPrice !== null
            ? typeof rawPrice === 'number'
              ? rawPrice.toFixed(2)
              : String(rawPrice)
            : props.price || '45000'

        const planTitle =
          plan.title || (plan.planType ? `${plan.planType.toUpperCase()} Tier` : title)

        return {
          '@type': 'Offer',
          '@id': `${pageUrl}#offer-${plan.id || plan.planType || 'plan'}`,
          name: `${title} - ${planTitle}`,
          description: plan.features?.map((f) => f.feature).join(', ') || description,
          url: pageUrl,
          price: formattedPrice,
          priceCurrency: plan.currency || props.currency || 'KES',
          availability: props.availability || 'https://schema.org/InStock',
          priceValidUntil,
          seller: providerObj,
          itemOffered: {
            '@type': 'Service',
            '@id': `${pageUrl}#service-${plan.id || plan.planType || 'plan'}`,
            name: `${title} - ${planTitle}`,
            serviceType: plan.planType ? `${plan.planType} tier` : subTitle,
            description,
            url: pageUrl,
            provider: providerObj,
            areaServed: targetAreas,
          },
        }
      })
    } else {
      // Fallback single offer when no pricing docs explicitly matched
      const fallbackPrice = props.price ? String(props.price) : '45000'
      offersList = [
        {
          '@type': 'Offer',
          '@id': `${pageUrl}#offer`,
          name: title,
          description,
          url: pageUrl,
          price: fallbackPrice,
          priceCurrency: props.currency || 'KES',
          availability: props.availability || 'https://schema.org/InStock',
          priceValidUntil,
          seller: providerObj,
          itemOffered: {
            '@type': 'Service',
            '@id': `${pageUrl}#service`,
            name: title,
            serviceType: subTitle,
            description,
            url: pageUrl,
            provider: providerObj,
            areaServed: targetAreas,
          },
        },
      ]
    }

    // Embed OfferCatalog schema from OfferCatalogSchema helper
    const catalogSchemaObj = offerCatalogSchema({
      service: svc || props,
      pricings: pricingsForSvc.length > 0 ? pricingsForSvc : pricingList,
      catalogName: props.catalogName,
      agencySettings: settings,
    })

    return {
      '@context': 'https://schema.org',
      '@type': ['Product', 'Service'],
      '@id': `${pageUrl}#product`,
      name: title,
      image: imageUrls,
      description,
      category: subTitle,
      sku: skuCode,
      mpn: mpnCode,
      brand: brandObj,
      provider: providerObj,
      manufacturer: providerObj,
      url: pageUrl,
      offers: offersList.length === 1 ? offersList[0] : offersList,
      hasOfferCatalog: catalogSchemaObj,
      aggregateRating: aggregateRatingNode,
      areaServed: targetAreas,
    }
  }

  // If multiple services are passed, map over each service doc
  if (serviceList.length > 1) {
    return serviceList.map((svc) => {
      const matchedPricings = pricingList.filter((p) => {
        if (!p || !p.service) return false
        const svcId = typeof p.service === 'object' && p.service !== null ? (p.service as any).id : p.service
        return svc && svc.id && String(svcId) === String(svc.id)
      })
      return buildSingleProductSchema(svc, matchedPricings)
    })
  }

  // Single service or fallback props
  const singleSvc = serviceList[0] || null
  const matchedPricings = singleSvc
    ? pricingList.filter((p) => {
        if (!p || !p.service) return false
        const svcId = typeof p.service === 'object' && p.service !== null ? (p.service as any).id : p.service
        return singleSvc && singleSvc.id && String(svcId) === String(singleSvc.id)
      })
    : pricingList

  return buildSingleProductSchema(singleSvc, matchedPricings)
}

/**
 * Legacy backwards compatibility alias export
 */
export const productPackageSchema = productSchema

/**
 * Async helper to fetch agency-settings global from Payload CMS and construct productSchema object
 */
export const getProductSchema = async (props: ProductSchemaInputProps = {}) => {
  let fetchedServices: Partial<Service>[] = []
  let fetchedPricings: Partial<Pricing>[] = []
  let googleReviews = props.googleReviews || null
  let agencySettings = props.agencySettings ?? null

  try {
    const payload = await getPayload({ config: configPromise })

    if (!agencySettings) {
      try {
        agencySettings = await payload.findGlobal({
          slug: 'agency-settings',
          depth: 1,
          overrideAccess: true,
        })
      } catch (err) {
        console.error('Error fetching agency-settings for ProductSchema:', err)
      }
    }

    if (props.slug || props.serviceId) {
      const whereCondition: any = props.slug
        ? { slug: { equals: props.slug } }
        : { id: { equals: props.serviceId } }

      const serviceRes = await payload.find({
        collection: 'services',
        where: whereCondition,
        limit: 1,
      })

      if (serviceRes.docs?.[0]) {
        fetchedServices = [serviceRes.docs[0]]
        const pricingRes = await payload.find({
          collection: 'pricing',
          where: { service: { equals: serviceRes.docs[0].id } },
          limit: 20,
        })
        fetchedPricings = pricingRes.docs || []
      }
    } else if (!props.service && (!props.services || props.services.length === 0)) {
      const [serviceRes, pricingRes] = await Promise.all([
        payload.find({
          collection: 'services',
          limit: 10,
        }),
        payload.find({
          collection: 'pricing',
          limit: 50,
        }),
      ])
      fetchedServices = serviceRes.docs || []
      fetchedPricings = pricingRes.docs || []
    }

    if (!googleReviews) {
      googleReviews = await getGoogleReviews()
    }
  } catch (err) {
    console.error('Error fetching dynamic data for ProductSchema:', err)
  }

  const combinedProps: ProductSchemaInputProps = {
    ...props,
    agencySettings,
    services: props.services?.length ? props.services : fetchedServices,
    pricings: props.pricings?.length ? props.pricings : fetchedPricings,
    googleReviews,
  }

  return productSchema(combinedProps)
}

/**
 * React Server Component that dynamically fetches services from Payload CMS 'services' collection,
 * related pricing plans, agency-settings global, and live Google Places rating/reviews, then outputs a structured JSON-LD script tag.
 */
export async function ProductSchema(props: ProductSchemaInputProps = {}) {
  const schemaObj = await getProductSchema(props)

  if (!schemaObj) return null

  return (
    <script
      id="product-schema-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaObj),
      }}
    />
  )
}

export default ProductSchema

