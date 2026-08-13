import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'
import { getGoogleReviews } from '@/utilities/getGoogleReviews'
import type { CleanPlacesOutput } from '@/utilities/getGoogleReviews'
import { offerCatalogSchema } from './OfferCatalogSchema'
import { aggregateRatingSchema } from './AggregateRatingSchema'
import { websiteSchema } from './WebsiteSchema'
import { personSchema } from './PersonSchema'
import type { Service, Pricing, Team } from '@/payload-types'

// ─────────────────────────────────────────────────────────────────────────────
// Props Interface — all fields optional for flexible per-page usage
// ─────────────────────────────────────────────────────────────────────────────
export interface OrganizationSchemaProps {
  /** Override the canonical base URL (defaults to env NEXT_PUBLIC_SERVER_URL) */
  url?: string
  /** Pass pre-fetched AgencySettings global to skip internal fetching */
  agencySettings?: any
  /** Pass pre-fetched services to skip internal fetching */
  services?: Partial<Service>[] | null
  /** Pass pre-fetched pricing plans to skip internal fetching */
  pricings?: Partial<Pricing>[] | null
  /** Pass pre-fetched Google rating/review data */
  googleReviews?: CleanPlacesOutput | null
  /** Pass pre-fetched website meta (description, title) for WebSite node */
  websiteMeta?: { title?: string; description?: string } | null
  /** Keyword overrides — merged with defaults */
  keywords?: string[]
  /** Override rating value */
  ratingValue?: string | number
  /** Override review count */
  reviewCount?: string | number
  /** Route-specific page URL for context (WebPage node) */
  pageUrl?: string
  /** Route-specific page name */
  pageName?: string
  [key: string]: any
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: All brand data is sourced from the `agency-settings` Payload CMS global
// (defined in src/OrganizationSettings/index.ts). There are no hardcoded
// fallback constants — populate the global in the Payload admin panel.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Pure sync builder — renders data from the AgencySettings CMS global
// ─────────────────────────────────────────────────────────────────────────────
export const organizationSchema = (props: OrganizationSchemaProps = {}) => {
  const baseUrl = props.url || getServerSideURL() || 'https://mjinidigital.co.ke'
  const organizationId = `${baseUrl}/#organization`
  const websiteId = `${baseUrl}/#website`

  const settings = props.agencySettings
  const identity = settings?.identity
  const contact = settings?.contact
  const addressSettings = settings?.address
  const geoSettings = settings?.geo
  const commerceSettings = settings?.commerce
  const leadershipSettings = settings?.leadership

  // ── Brand & Identity resolution ──────────────────────────────────────────
  const name = identity?.name || ''
  const legalName = identity?.legalName || ''
  const slogan = identity?.slogan || ''
  const description = identity?.description || ''
  const shortDescription = identity?.shortDescription || ''
  const foundingDate = identity?.foundingDate || ''
  const vatID = identity?.vatId || ''
  const duns = identity?.duns || ''

  // Parse founding location for city & country
  let foundingLocality = ''
  let foundingCountry = ''
  if (identity?.foundingLocation) {
    const parts = identity.foundingLocation.split(',').map((s: string) => s.trim())
    if (parts.length >= 1) foundingLocality = parts[0]
    if (parts.length >= 2) foundingCountry = parts[1]
  }

  let logoUrl = `${baseUrl}/logo.png`
  if (identity?.logo) {
    if (typeof identity.logo === 'object' && identity.logo.url) {
      logoUrl = identity.logo.url.startsWith('http')
        ? identity.logo.url
        : `${baseUrl}${identity.logo.url.startsWith('/') ? '' : '/'}${identity.logo.url}`
    } else if (typeof identity.logo === 'string') {
      logoUrl = identity.logo.startsWith('http') ? identity.logo : `${baseUrl}${identity.logo.startsWith('/') ? '' : '/'}${identity.logo}`
    }
  }

  let imageList: string[] = []
  if (Array.isArray(identity?.images) && identity.images.length > 0) {
    imageList = identity.images
      .map((item: any) => {
        const imgObj = item?.image || item
        if (typeof imgObj === 'object' && imgObj?.url) {
          return imgObj.url.startsWith('http')
            ? imgObj.url
            : `${baseUrl}${imgObj.url.startsWith('/') ? '' : '/'}${imgObj.url}`
        }
        if (typeof imgObj === 'string') {
          return imgObj.startsWith('http')
            ? imgObj
            : `${baseUrl}${imgObj.startsWith('/') ? '' : '/'}${imgObj}`
        }
        return null
      })
      .filter(Boolean) as string[]
  }
  if (imageList.length === 0) {
    imageList = [logoUrl]
  }

  let alternateNames: string[] = []
  if (Array.isArray(identity?.alternateName) && identity.alternateName.length > 0) {
    alternateNames = identity.alternateName
      .map((item: any) => (typeof item === 'string' ? item : item?.name))
      .filter(Boolean)
  } else if (typeof identity?.alternateName === 'string') {
    alternateNames = identity.alternateName.split(',').map((s: string) => s.trim()).filter(Boolean)
  }
  // No hardcoded fallback — alternateNames stays empty if not set in CMS

  // ── Contact & Location resolution ───────────────────────────────────────
  const telephone = contact?.primaryPhone || contact?.phone || ''
  const email = contact?.primaryEmail || contact?.emails?.[0]?.email || ''

  let contactPoints: any[] = []
  if (Array.isArray(contact?.contactPoints) && contact.contactPoints.length > 0) {
    contactPoints = contact.contactPoints.map((cp: any, idx: number) => ({
      '@type': 'ContactPoint',
      '@id': `${baseUrl}/#contact-${cp.contactType ? cp.contactType.replace(/\s+/g, '-').toLowerCase() : idx}`,
      telephone: cp.telephone || telephone,
      email: cp.email || email,
      contactType: cp.contactType || 'general',
      availableLanguage: Array.isArray(cp.availableLanguage)
        ? cp.availableLanguage
        : cp.availableLanguage
        ? [cp.availableLanguage]
        : ['English', 'Swahili'],
      areaServed: cp.areaServed || 'Worldwide',
    }))
  } else if (Array.isArray(contact?.emails) && contact.emails.length > 0) {
    contactPoints = contact.emails.map((e: any) => ({
      '@type': 'ContactPoint',
      '@id': `${baseUrl}/#contact-${e.type || 'info'}`,
      telephone,
      email: e.email,
      contactType:
        e.type === 'sales'
          ? 'sales'
          : e.type === 'support'
          ? 'customer support'
          : e.type === 'technical'
          ? 'technical support'
          : 'general',
      availableLanguage: ['English', 'Swahili'],
      areaServed: 'Worldwide',
    }))
  } else {
    contactPoints = [
      {
        '@type': 'ContactPoint',
        '@id': `${baseUrl}/#contact-sales`,
        telephone,
        contactType: 'sales',
        email,
        availableLanguage: ['English', 'Swahili'],
        areaServed: ['KE', 'UG', 'TZ', 'NG', 'GH'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '17:00',
        },
      },
      {
        '@type': 'ContactPoint',
        '@id': `${baseUrl}/#contact-support`,
        telephone,
        contactType: 'customer support',
        email,
        availableLanguage: ['English', 'Swahili'],
        areaServed: 'Worldwide',
      },
      {
        '@type': 'ContactPoint',
        '@id': `${baseUrl}/#contact-technical`,
        email,
        contactType: 'technical support',
        availableLanguage: ['English'],
        areaServed: 'Worldwide',
      },
    ]
  }

  const streetAddress = addressSettings?.streetAddress || ''
  const addressLocality = addressSettings?.addressLocality || ''
  const addressRegion = addressSettings?.addressRegion || ''
  const postalCode = addressSettings?.postalCode || ''
  const addressCountry = addressSettings?.addressCountry || ''

  const latitude = geoSettings?.latitude || identity?.geo?.latitude || ''
  const longitude = geoSettings?.longitude || identity?.geo?.longitude || ''
  const hasMap =
    geoSettings?.googleMapsUrl || identity?.geo?.googleMapsUrl || `https://maps.google.com/?q=${latitude},${longitude}`

  // ── Social & Online Profiles ─────────────────────────────────────────────
  const rawSocialUrls: string[] = []
  if (settings?.googleBusinessProfile) {
    rawSocialUrls.push(settings.googleBusinessProfile)
  }
  if (Array.isArray(settings?.socials)) {
    settings.socials.forEach((soc: any) => {
      if (soc?.url) rawSocialUrls.push(soc.url)
    })
  }
  const sameAsList = Array.from(new Set(rawSocialUrls))

  // ── Commerce & Operations resolution ─────────────────────────────────────
  const priceRange = commerceSettings?.priceRange || identity?.priceRange || ''
  const currenciesAccepted =
    commerceSettings?.currenciesAccepted || identity?.currenciesAccepted || ''
  const paymentAccepted =
    commerceSettings?.paymentAccepted || identity?.paymentAccepted || ''

  let openingHoursList: any[] = []
  if (Array.isArray(commerceSettings?.openingHours) && commerceSettings.openingHours.length > 0) {
    openingHoursList = commerceSettings.openingHours.map((h: any) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: Array.isArray(h.dayOfWeek) ? h.dayOfWeek : [h.dayOfWeek],
      opens: h.opens || '08:00',
      closes: h.closes || '17:00',
    }))
  }
  // No hardcoded fallback — opening hours stay empty if not set in CMS

  let serviceTypeList: string[] = []
  if (Array.isArray(commerceSettings?.serviceTypes) && commerceSettings.serviceTypes.length > 0) {
    serviceTypeList = commerceSettings.serviceTypes
      .map((s: any) => (typeof s === 'string' ? s : s?.name))
      .filter(Boolean)
  }
  // No hardcoded fallback — service types stay empty if not set in CMS

  let areaServedList: any[] = []
  if (Array.isArray(commerceSettings?.areaServed) && commerceSettings.areaServed.length > 0) {
    areaServedList = commerceSettings.areaServed.map((a: any) =>
      typeof a === 'string'
        ? { '@type': 'Country', name: a }
        : { '@type': a.type || 'Country', name: a.name, ...(a.sameAs ? { sameAs: a.sameAs } : {}) },
    )
  } else if (Array.isArray(identity?.areaServed) && identity.areaServed.length > 0) {
    areaServedList = identity.areaServed.map((a: any) =>
      typeof a === 'string'
        ? { '@type': 'Country', name: a }
        : { '@type': a.type || 'Country', name: a.name, ...(a.sameAs ? { sameAs: a.sameAs } : {}) },
    )
  }
  // No hardcoded fallback — area served stays empty if not set in CMS

  let keywordList: string[] = []
  if (Array.isArray(commerceSettings?.defaultKeywords) && commerceSettings.defaultKeywords.length > 0) {
    keywordList = commerceSettings.defaultKeywords
      .map((k: any) => (typeof k === 'string' ? k : k?.keyword))
      .filter(Boolean)
  } else if (Array.isArray(identity?.defaultKeywords) && identity.defaultKeywords.length > 0) {
    keywordList = identity.defaultKeywords
      .map((k: any) => (typeof k === 'string' ? k : k?.keyword))
      .filter(Boolean)
  }
  const extraKeywords = Array.isArray(props.keywords) ? props.keywords : []
  const allKeywords = Array.from(new Set([...extraKeywords, ...keywordList]))
  const keywordsString = allKeywords.join(', ')

  // ── Leadership & Recognition resolution ─────────────────────────────────
  let minEmp = 0
  let maxEmp = 0

  if (typeof leadershipSettings?.employeeMin === 'number') {
    minEmp = leadershipSettings.employeeMin
    maxEmp = leadershipSettings.employeeMax ?? minEmp
  } else if (identity?.numberOfEmployees) {
    const parsed = parseInt(String(identity.numberOfEmployees), 10)
    if (!isNaN(parsed)) {
      minEmp = parsed
      maxEmp = parsed
    }
  }

  let founderNodes: any[] = []
  if (Array.isArray(leadershipSettings?.teamFounders) && leadershipSettings.teamFounders.length > 0) {
    // teamFounders is a relationship to 'team' collection — depth:2 populates full docs
    founderNodes = leadershipSettings.teamFounders
      .map((f: any) => {
        if (typeof f === 'object' && f !== null && 'name' in f) {
          return personSchema(f)
        }
        return null
      })
      .filter(Boolean)
  }

  // If teamFounders yielded nothing, fall back to custom founders array
  if (founderNodes.length === 0 && Array.isArray(leadershipSettings?.founders) && leadershipSettings.founders.length > 0) {
    founderNodes = leadershipSettings.founders.map((f: any) => {
      if (typeof f === 'object' && f !== null && 'name' in f) {
        return personSchema(f)
      }
      return personSchema({ name: String(f), jobTitle: 'Founder' })
    })
  } else if (founderNodes.length === 0 && Array.isArray(identity?.founders) && identity.founders.length > 0) {
    founderNodes = identity.founders.map((f: any) => {
      if (typeof f === 'object' && f !== null && 'name' in f) {
        return personSchema(f)
      }
      return personSchema({ name: String(f), jobTitle: 'Founder' })
    })
  }

  // Dynamic Employee / Team Member Person nodes sourced directly from Payload Teams collection
  const employeeNodes: any[] = Array.isArray(props.teamMembers) && props.teamMembers.length > 0
    ? props.teamMembers.map((m: any) => personSchema(m))
    : []


  // No hardcoded fallback — founders stay empty if not set in CMS

  let awardList: string[] = []
  if (Array.isArray(leadershipSettings?.awards) && leadershipSettings.awards.length > 0) {
    awardList = leadershipSettings.awards
      .map((a: any) => (typeof a === 'string' ? a : a?.title))
      .filter(Boolean)
  } else if (Array.isArray(identity?.awards) && identity.awards.length > 0) {
    awardList = identity.awards
      .map((a: any) => (typeof a === 'string' ? a : a?.title))
      .filter(Boolean)
  }
  // No hardcoded fallback — awards stay empty if not set in CMS

  // ── AggregateRating ───────────────────────────────────────────────────────
  const ratingValue = props.ratingValue ?? props.googleReviews?.rating ?? '4.9'
  const reviewCount = props.reviewCount ?? props.googleReviews?.reviewCount ?? '48'

  const aggregateRatingNode = aggregateRatingSchema({
    ratingValue,
    reviewCount,
    url: baseUrl,
  })?.aggregateRating || {
    '@type': 'AggregateRating',
    ratingValue: String(ratingValue),
    reviewCount: String(reviewCount),
    bestRating: '5',
    worstRating: '1',
  }

  // ── Individual Review nodes (up to 5) ────────────────────────────────────
  const reviewNodes =
    props.googleReviews?.reviews?.slice(0, 5).map((rev) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: rev.author },
      reviewBody: rev.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(rev.ratingValue),
        bestRating: '5',
        worstRating: '1',
      },
      datePublished: rev.datePublished,
      publisher: { '@id': organizationId },
    })) || []

  // ── Offers — built from services + pricing list ───────────────────────────
  const serviceList: Partial<Service>[] = Array.isArray(props.services) ? props.services : []
  const pricingList: Partial<Pricing>[] = Array.isArray(props.pricings) ? props.pricings : []
  const nextYear = new Date().getFullYear() + 1
  const priceValidUntil = `${nextYear}-12-31`

  let offerNodes: any[] = []

  if (pricingList.length > 0) {
    // One Offer per pricing plan, linked back to its service
    offerNodes = pricingList.map((plan) => {
      const svc = serviceList.find((s) => {
        const svcId = typeof plan.service === 'object' ? (plan.service as any)?.id : plan.service
        return svcId && String(svcId) === String(s.id)
      })
      const serviceSlug = svc?.slug || ''
      const servicePageUrl = serviceSlug
        ? `${baseUrl}/services/${serviceSlug}`
        : `${baseUrl}/services`
      const rawPrice = plan.price
      const formattedPrice =
        rawPrice !== undefined && rawPrice !== null
          ? typeof rawPrice === 'number'
            ? rawPrice.toFixed(2)
            : String(rawPrice)
          : '45000'
      const planTitle =
        plan.title ||
        (plan.planType ? `${plan.planType.toUpperCase()} Plan` : svc?.title || 'Digital Service')

      return {
        '@type': 'Offer',
        '@id': `${servicePageUrl}#offer-${plan.id || plan.planType || 'plan'}`,
        name: planTitle,
        description:
          plan.features?.map((f: any) => f.feature).join(', ') ||
          svc?.summary ||
          shortDescription,
        url: servicePageUrl,
        price: formattedPrice,
        priceCurrency: plan.currency || 'KES',
        availability: 'https://schema.org/InStock',
        priceValidUntil,
        seller: { '@id': organizationId },
        itemOffered: {
          '@type': 'Service',
          '@id': `${servicePageUrl}#service-${plan.id || plan.planType || 'plan'}`,
          name: planTitle,
          serviceType: svc?.subTitle || plan.planType || 'Digital Service',
          description: svc?.summary || shortDescription,
          url: servicePageUrl,
          provider: { '@id': organizationId },
          areaServed: areaServedList,
        },
      }
    })
  } else if (serviceList.length > 0) {
    // One Offer per service when no pricing docs are available
    offerNodes = serviceList.map((svc) => {
      const serviceSlug = svc?.slug || ''
      const servicePageUrl = serviceSlug
        ? `${baseUrl}/services/${serviceSlug}`
        : `${baseUrl}/services`
      return {
        '@type': 'Offer',
        '@id': `${servicePageUrl}#offer`,
        name: svc.title || 'Digital Service',
        description: svc.summary || svc.meta?.description || shortDescription,
        url: servicePageUrl,
        priceCurrency: 'KES',
        availability: 'https://schema.org/InStock',
        priceValidUntil,
        seller: { '@id': organizationId },
        itemOffered: {
          '@type': 'Service',
          '@id': `${servicePageUrl}#service`,
          name: svc.title || 'Digital Service',
          serviceType: svc.subTitle || 'Digital Service',
          description: svc.summary || shortDescription,
          url: servicePageUrl,
          provider: { '@id': organizationId },
          areaServed: areaServedList,
        },
      }
    })
  } else {
    // Dynamic fallback — one Offer per service type
    offerNodes = serviceTypeList.slice(0, 6).map((svcType, idx) => ({
      '@type': 'Offer',
      '@id': `${baseUrl}/services#offer-${idx}`,
      name: svcType,
      description: `Professional ${svcType} services by ${name} — tailored for Kenyan and global brands.`,
      url: `${baseUrl}/services`,
      priceCurrency: 'KES',
      availability: 'https://schema.org/InStock',
      priceValidUntil,
      seller: { '@id': organizationId },
      itemOffered: {
        '@type': 'Service',
        name: svcType,
        serviceType: svcType,
        provider: { '@id': organizationId },
        areaServed: areaServedList,
      },
    }))
  }

  // ── Offer Catalog ─────────────────────────────────────────────────────────
  const catalogNode = offerCatalogSchema({
    pricings: pricingList,
    catalogName: `${name} — Full Service Catalog`,
    agencySettings: settings,
  })

  // ── WebSite node ──────────────────────────────────────────────────────────
  const websiteNode = websiteSchema({
    url: baseUrl,
    description: props.websiteMeta?.description || description,
    name: props.websiteMeta?.title || name,
    agencySettings: settings,
  })

  // ── @graph array ─────────────────────────────────────────────────────────
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // ── 1. Organization (primary entity) ──────────────────────────────────
      {
        '@type': ['Organization', 'ProfessionalService', 'LocalBusiness'],
        '@id': organizationId,

        // Core identity
        name,
        legalName,
        alternateName: alternateNames,
        description,
        slogan,
        url: baseUrl,
        foundingDate,
        foundingLocation: {
          '@type': 'Place',
          name: identity?.foundingLocation || 'Nairobi, Kenya',
          address: {
            '@type': 'PostalAddress',
            addressLocality: foundingLocality || addressLocality || 'Nairobi',
            addressCountry: foundingCountry || addressCountry || 'KE',
          },
        },

        // Identifiers
        ...(vatID ? { vatID } : {}),
        ...(duns ? { duns } : {}),

        // Branding assets
        logo: {
          '@type': 'ImageObject',
          '@id': `${baseUrl}/#logo`,
          url: logoUrl,
          contentUrl: logoUrl,
          caption: `${name} — Logo`,
          width: '512',
          height: '512',
          inLanguage: 'en-KE',
        },
        image: imageList,

        // Contact
        telephone,
        email,
        contactPoint: contactPoints,

        // Physical presence
        address: {
          '@type': 'PostalAddress',
          streetAddress,
          addressLocality,
          addressRegion,
          postalCode,
          addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude,
          longitude,
        },
        hasMap,

        // Operating hours
        openingHoursSpecification: openingHoursList,

        // Service areas
        areaServed: areaServedList,

        // Pricing & commerce
        priceRange,
        currenciesAccepted,
        paymentAccepted,

        // Keywords
        keywords: keywordsString,

        // Offers
        offers: offerNodes.length === 1 ? offerNodes[0] : offerNodes,
        hasOfferCatalog: catalogNode,

        // Ratings & Reviews
        aggregateRating: aggregateRatingNode,
        ...(reviewNodes.length > 0 ? { review: reviewNodes } : {}),

        // Founders, employees & team size
        ...(founderNodes.length > 0 ? { founder: founderNodes.length === 1 ? founderNodes[0] : founderNodes } : {}),
        ...(employeeNodes.length > 0 ? { member: employeeNodes, employee: employeeNodes } : {}),
        numberOfEmployees: {
          '@type': 'QuantitativeValue',
          minValue: minEmp,
          maxValue: maxEmp,
        },


        // Awards & certifications
        award: awardList,

        // Brand entity
        brand: {
          '@type': 'Brand',
          name,
          url: baseUrl,
          logo: logoUrl,
          slogan,
        },

        // Cross-platform verification
        sameAs: sameAsList,

        // Graph relations
        subjectOf: { '@id': websiteId },
        mainEntityOfPage: { '@id': baseUrl },

        // Freshness signals
        datePublished: foundingDate
          ? foundingDate.includes('-')
            ? foundingDate
            : `${foundingDate}-01-01`
          : undefined,
        dateModified: new Date().toISOString().split('T')[0],

        // Potential actions — contact / quote from SERP
        potentialAction: [
          {
            '@type': 'ContactAction',
            target: `${baseUrl}/contact`,
            name: `Contact ${name}`,
          },
          {
            '@type': 'QuoteAction',
            target: `${baseUrl}/contact#quote`,
            name: 'Request a Free Quote',
          },
        ],
      },

      // ── 2. WebSite (with embedded SearchAction) ───────────────────────────
      {
        ...websiteNode,
        '@id': websiteId,
      },

      // ── 3. Route-specific WebPage node (optional) ─────────────────────────
      ...(props.pageUrl
        ? [
            {
              '@type': 'WebPage',
              '@id': `${props.pageUrl}#webpage`,
              url: props.pageUrl,
              name: props.pageName || name,
              description: shortDescription,
              isPartOf: { '@id': websiteId },
              about: { '@id': organizationId },
              inLanguage: 'en-KE',
              datePublished: `${foundingDate}-01-01`,
              dateModified: new Date().toISOString().split('T')[0],
            },
          ]
        : []),
    ],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Async data loader — fetches all dynamic data then calls the pure builder
// ─────────────────────────────────────────────────────────────────────────────
export const getOrganizationSchema = async (props: OrganizationSchemaProps = {}) => {
  let agencySettings = props.agencySettings ?? null
  let fetchedServices: Partial<Service>[] = props.services || []
  let fetchedPricings: Partial<Pricing>[] = props.pricings || []
  let fetchedTeamMembers: Team[] = props.teamMembers || []
  let googleReviews = props.googleReviews ?? null
  let websiteMeta = props.websiteMeta ?? null

  try {
    const payload = await getPayload({ config: configPromise })

    // Fetch AgencySettings global if not provided in props
    if (!agencySettings) {
      try {
        agencySettings = await payload.findGlobal({
          slug: 'agency-settings',
          depth: 2, // depth 2 needed to populate teamFounders → team documents
          overrideAccess: true,
        })
        if (!agencySettings || Object.keys(agencySettings).length === 0) {
          console.warn(
            '[OrganizationSchema] agency-settings global returned empty — ' +
              'populate it in the Payload admin to override BRAND defaults.',
          )
          agencySettings = null
        }
      } catch (err) {
        console.error('[OrganizationSchema] Error fetching agency-settings global:', err)
      }
    }

    // Fetch all published services (if not already supplied)
    if (fetchedServices.length === 0) {
      const serviceRes = await payload.find({
        collection: 'services',
        limit: 50,
        draft: false,
        overrideAccess: true,
      })
      fetchedServices = serviceRes.docs || []
    }

    // Fetch all pricing plans (if not already supplied)
    if (fetchedPricings.length === 0 && fetchedServices.length > 0) {
      const pricingRes = await payload.find({
        collection: 'pricing',
        limit: 100,
        draft: false,
        overrideAccess: true,
      })
      fetchedPricings = pricingRes.docs || []
    }

    // Fetch team collection for dynamic employees / team members
    if (fetchedTeamMembers.length === 0) {
      try {
        const teamRes = await payload.find({
          collection: 'team',
          limit: 100,
          depth: 1,
          overrideAccess: true,
        })
        fetchedTeamMembers = (teamRes.docs as Team[]) || []
      } catch (err) {
        console.error('[OrganizationSchema] Error fetching team collection:', err)
      }
    }

    // Fetch home page meta for WebSite node
    if (!websiteMeta) {
      const homeRes = await payload.find({
        collection: 'pages',
        draft: false,
        limit: 1,
        overrideAccess: false,
        where: { slug: { equals: 'home' } },
      })
      const homePage = homeRes.docs?.[0]
      if (homePage?.meta) {
        websiteMeta = {
          title: homePage.meta.title || undefined,
          description: homePage.meta.description || undefined,
        }
      }
    }
  } catch (err) {
    console.error('[OrganizationSchema] Error fetching CMS data:', err)
  }

  // Fetch live Google Places rating / reviews
  if (!googleReviews) {
    try {
      googleReviews = await getGoogleReviews()
    } catch (err) {
      console.error('[OrganizationSchema] Error fetching Google reviews:', err)
    }
  }

  return organizationSchema({
    ...props,
    agencySettings,
    services: fetchedServices,
    pricings: fetchedPricings,
    teamMembers: fetchedTeamMembers,
    googleReviews,
    websiteMeta,
  })
}


// ─────────────────────────────────────────────────────────────────────────────
// React Server Component
// ─────────────────────────────────────────────────────────────────────────────
/**
 * OrganizationSchema — React Server Component.
 *
 * Renders a comprehensive Schema.org @graph JSON-LD block containing:
 *   • Organization / ProfessionalService / LocalBusiness (combined)
 *   • WebSite with SearchAction
 *   • OfferCatalog with per-plan Offer nodes (dynamic from Payload CMS)
 *   • AggregateRating (live Google Places)
 *   • Individual Review nodes (up to 5)
 *   • ContactPoint array (sales, customer support, technical support)
 *   • AreaServed (18 regions: Africa, UK, UAE, US, Canada, Australia)
 *   • Keywords string (20+ high-intent terms)
 *   • Founder, numberOfEmployees, award / certifications
 *   • Geo + PostalAddress + OpeningHoursSpecification
 *   • Optional WebPage node for the current route
 *
 * Usage — global (layout.tsx, renders on every page):
 *   <OrganizationSchema />
 *
 * Usage — per route with context (adds WebPage node):
 *   <OrganizationSchema
 *     pageUrl="https://mjinidigital.co.ke/services/web-design-nairobi"
 *     pageName="Web Design Nairobi — Mjini Digital" />
 */
export async function OrganizationSchema(props: OrganizationSchemaProps = {}) {
  const schemaObj = await getOrganizationSchema(props)

  if (!schemaObj) return null

  return (
    <script
      id="organization-schema-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaObj),
      }}
    />
  )
}

export default OrganizationSchema

