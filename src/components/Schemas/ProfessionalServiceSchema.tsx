import { Service, Pricing, Media } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { getGoogleReviews } from '@/utilities/getGoogleReviews'
import { offerCatalogSchema } from './OfferCatalogSchema'
import { aggregateRatingSchema } from './AggregateRatingSchema'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export interface ProfessionalServiceSchemaInputProps {
  agencySettings?: any
  service?: Partial<Service> | null
  services?: Partial<Service>[] | null
  pricings?: Partial<Pricing>[] | null
  plans?: Partial<Pricing>[] | null
  slug?: string
  serviceId?: string | number
  url?: string
  title?: string
  name?: string
  description?: string
  summary?: string
  image?: string | Media
  category?: string
  subTitle?: string
  price?: string | number
  currency?: string
  ratingValue?: string | number
  reviewCount?: string | number
  googleReviews?: {
    rating?: number
    reviewCount?: number
  } | null
  keywords?: string[] | string
  telephone?: string
  email?: string
  streetAddress?: string
  locality?: string
  region?: string
  postalCode?: string
  latitude?: string | number
  longitude?: string | number
  catalogName?: string
  [key: string]: any
}

/**
 * Builds a Schema.org compliant ProfessionalService & Service JSON-LD structure for Mjini Digital.
 * Dynamically fetches Service collection docs, related pricing plans, live Google ratings, AgencySettings global, and SEO keywords.
 */
export const professionalServiceSchema = (props: ProfessionalServiceSchemaInputProps = {}) => {
  const baseUrl = getServerSideURL() || 'https://mjinidigital.co.ke'
  const settings = props.agencySettings
  const identity = settings?.identity
  const contact = settings?.contact
  const addressSettings = settings?.address
  const geoSettings = settings?.geo
  const commerceSettings = settings?.commerce

  // Organization branding & identity values
  const orgName = identity?.name || 'Mjini Digital'
  const legalName = identity?.legalName || 'Mjini Digital Agency Ltd'
  const slogan = identity?.slogan || 'Empowering African Brands Online'
  const telephone = props.telephone || contact?.primaryPhone || contact?.phone || '+254700000000'
  const email = props.email || contact?.primaryEmail || contact?.emails?.[0]?.email || 'hello@mjinidigital.co.ke'

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

  let svc: Partial<Service> | null = null
  let pricingList: Partial<Pricing>[] = []

  if (props && typeof props === 'object') {
    if (props.service) {
      svc = props.service
    } else if (props.title || props.slug || props.summary) {
      svc = props as Partial<Service>
    }

    if (Array.isArray(props.pricings)) {
      pricingList = props.pricings
    } else if (Array.isArray(props.plans)) {
      pricingList = props.plans
    }
  }

  const serviceSlug = svc?.slug || props.slug || ''
  const serviceUrl =
    props.url || (serviceSlug ? `${baseUrl}/services/${serviceSlug}` : `${baseUrl}/services`)

  const serviceTitle =
    svc?.title || props.title || props.name || 'Professional Custom Web Design & SEO Services'

  const serviceCategory =
    svc?.subTitle ||
    props.category ||
    props.subTitle ||
    'Web Design, Technical SEO & Software Development'

  const serviceDescription =
    svc?.summary ||
    svc?.meta?.description ||
    props.description ||
    props.summary ||
    `Professional custom website design, responsive software development, e-commerce solutions, and search engine optimization engineered for high conversion rates by ${orgName}.`

  // Keywords handling
  let defaultKeywords = [
    'Web Design Nairobi',
    'Website Developers Kenya',
    'SEO Agency Nairobi',
    'Custom Software Development Africa',
    'E-Commerce Development M-Pesa',
    'Next.js Web Design',
    'UI/UX Product Design',
    'Digital Marketing Agency Nairobi',
    'Mobile Responsive Web Apps',
  ]
  if (Array.isArray(commerceSettings?.defaultKeywords) && commerceSettings.defaultKeywords.length > 0) {
    defaultKeywords = commerceSettings.defaultKeywords
      .map((k: any) => (typeof k === 'string' ? k : k?.keyword))
      .filter(Boolean)
  }

  let rawKeywords: string[] = []
  if (Array.isArray(props.keywords)) {
    rawKeywords = props.keywords
  } else if (typeof props.keywords === 'string') {
    rawKeywords = props.keywords
      .split(',')
      .map((k: string) => k.trim())
      .filter(Boolean)
  }

  if (svc?.title) rawKeywords.push(svc.title)
  if (svc?.subTitle) rawKeywords.push(svc.subTitle)

  const combinedKeywords = Array.from(new Set([...rawKeywords, ...defaultKeywords]))
  const keywordsString = combinedKeywords.join(', ')

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

  // Target areas for service delivery
  let targetAreas: any[] = []
  if (Array.isArray(commerceSettings?.areaServed) && commerceSettings.areaServed.length > 0) {
    targetAreas = commerceSettings.areaServed.map((a: any) =>
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

  // Address & Geolocation
  const streetAddress = props.streetAddress || addressSettings?.streetAddress || 'Mombasa Road, Mirage Towers, Suite 4B'
  const locality = props.locality || addressSettings?.addressLocality || 'Nairobi'
  const region = props.region || addressSettings?.addressRegion || 'Nairobi County'
  const postalCode = props.postalCode || addressSettings?.postalCode || '00100'
  const addressCountry = addressSettings?.addressCountry || 'KE'
  const latitude = props.latitude || geoSettings?.latitude || identity?.geo?.latitude || '-1.2921'
  const longitude = props.longitude || geoSettings?.longitude || identity?.geo?.longitude || '36.8219'

  const priceRange = commerceSettings?.priceRange || identity?.priceRange || '$$'
  const currenciesAccepted = commerceSettings?.currenciesAccepted || identity?.currenciesAccepted || 'KES, USD'

  // Resolve aggregate rating node
  const ratingValue = props.ratingValue ?? props.googleReviews?.rating ?? '4.9'
  const reviewCount = props.reviewCount ?? props.googleReviews?.reviewCount ?? '48'

  const aggregateRatingNode = aggregateRatingSchema({
    ratingValue,
    reviewCount,
    url: serviceUrl,
  })?.aggregateRating || {
    '@type': 'AggregateRating',
    ratingValue: String(ratingValue),
    reviewCount: String(reviewCount),
    bestRating: '5',
    worstRating: '1',
  }

  // Common Provider Object
  const providerObj = {
    '@type': 'ProfessionalService',
    '@id': `${baseUrl}/#localbusiness`,
    name: orgName,
    legalName,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl,
      width: '512',
      height: '512',
    },
    telephone,
    email,
  }

  // Build offers list from pricing collection docs or props fallback
  let offersList: any[] = []
  const nextYear = new Date().getFullYear() + 1
  const priceValidUntil = `${nextYear}-12-31`

  if (pricingList.length > 0) {
    offersList = pricingList.map((plan) => {
      const rawPrice = plan.price
      const formattedPrice =
        rawPrice !== undefined && rawPrice !== null
          ? typeof rawPrice === 'number'
            ? rawPrice.toFixed(2)
            : String(rawPrice)
          : props.price || '45000'

      const planTitle =
        plan.title || (plan.planType ? `${plan.planType.toUpperCase()} Package` : serviceTitle)

      return {
        '@type': 'Offer',
        '@id': `${serviceUrl}#offer-${plan.id || plan.planType || 'plan'}`,
        name: `${serviceTitle} - ${planTitle}`,
        description: plan.features?.map((f) => f.feature).join(', ') || serviceDescription,
        url: serviceUrl,
        price: formattedPrice,
        priceCurrency: plan.currency || props.currency || 'KES',
        availability: 'https://schema.org/InStock',
        priceValidUntil,
        seller: providerObj,
      }
    })
  } else {
    const fallbackPrice = props.price ? String(props.price) : '45000'
    offersList = [
      {
        '@type': 'Offer',
        '@id': `${serviceUrl}#offer`,
        name: serviceTitle,
        description: serviceDescription,
        url: serviceUrl,
        price: fallbackPrice,
        priceCurrency: props.currency || 'KES',
        availability: 'https://schema.org/InStock',
        priceValidUntil,
        seller: providerObj,
      },
    ]
  }

  // Catalog embedding
  const catalogSchemaObj = offerCatalogSchema({
    service: svc || props,
    pricings: pricingList,
    catalogName: props.catalogName,
    agencySettings: settings,
  })

  return {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'Service'],
    '@id': `${serviceUrl}/#professionalservice`,
    name: serviceTitle,
    legalName,
    slogan,
    serviceType: serviceCategory,
    description: serviceDescription,
    url: serviceUrl,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl,
      width: '512',
      height: '512',
    },
    image: imageUrls,
    telephone,
    email,
    priceRange,
    currenciesAccepted,
    keywords: keywordsString,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: locality,
      addressRegion: region,
      postalCode,
      addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: String(latitude),
      longitude: String(longitude),
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    provider: providerObj,
    areaServed: targetAreas,
    offers: offersList.length === 1 ? offersList[0] : offersList,
    hasOfferCatalog: catalogSchemaObj,
    aggregateRating: aggregateRatingNode,
  }
}

/**
 * Async helper to fetch agency-settings global from Payload CMS and construct professionalServiceSchema object
 */
export const getProfessionalServiceSchema = async (
  props: ProfessionalServiceSchemaInputProps = {},
) => {
  let fetchedService: Partial<Service> | null = props.service || null
  let fetchedPricings: Partial<Pricing>[] = props.pricings || props.plans || []
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
        console.error('Error fetching agency-settings for ProfessionalServiceSchema:', err)
      }
    }

    if (!fetchedService && (props.slug || props.serviceId)) {
      const whereCondition: any = props.slug
        ? { slug: { equals: props.slug } }
        : { id: { equals: props.serviceId } }

      const serviceRes = await payload.find({
        collection: 'services',
        where: whereCondition,
        limit: 1,
      })

      if (serviceRes.docs?.[0]) {
        fetchedService = serviceRes.docs[0]
      }
    }

    if (fetchedService?.id && fetchedPricings.length === 0) {
      const pricingRes = await payload.find({
        collection: 'pricing',
        where: { service: { equals: fetchedService.id } },
        limit: 20,
      })
      fetchedPricings = pricingRes.docs || []
    }

    if (!googleReviews) {
      googleReviews = await getGoogleReviews()
    }
  } catch (err) {
    console.error('Error fetching dynamic data for ProfessionalServiceSchema:', err)
  }

  const combinedProps = {
    ...props,
    agencySettings,
    service: fetchedService,
    pricings: fetchedPricings,
    googleReviews,
  }

  return professionalServiceSchema(combinedProps)
}

/**
 * React Server Component that dynamically fetches services from Payload CMS 'services' collection,
 * related pricing plans, keywords, agency-settings global, and live Google Places ratings/reviews.
 */
export async function ProfessionalServiceSchema(props: ProfessionalServiceSchemaInputProps = {}) {
  const schemaObj = await getProfessionalServiceSchema(props)

  if (!schemaObj) return null

  return (
    <script
      id="professional-service-schema-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaObj),
      }}
    />
  )
}

export default ProfessionalServiceSchema

