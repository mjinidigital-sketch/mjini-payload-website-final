import { Pricing, Service } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

export const offerCatalogSchema = (props: any) => {
  const baseUrl = getServerSideURL() || 'https://mjinidigital.co.ke'
  const settings = props?.agencySettings
  const identity = settings?.identity
  const commerceSettings = settings?.commerce

  const orgName = identity?.name || 'Mjini Digital'

  // Dynamic global target regions
  let globalTargetAreas: any[] = []
  if (Array.isArray(commerceSettings?.areaServed) && commerceSettings.areaServed.length > 0) {
    globalTargetAreas = commerceSettings.areaServed.map((a: any) =>
      typeof a === 'string'
        ? { '@type': 'Country', name: a }
        : { '@type': a.type || 'Country', name: a.name, ...(a.sameAs ? { sameAs: a.sameAs } : {}) },
    )
  } else if (Array.isArray(identity?.areaServed) && identity.areaServed.length > 0) {
    globalTargetAreas = identity.areaServed.map((a: any) =>
      typeof a === 'string'
        ? { '@type': 'Country', name: a }
        : { '@type': a.type || 'Country', name: a.name, ...(a.sameAs ? { sameAs: a.sameAs } : {}) },
    )
  } else {
    globalTargetAreas = [
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'City', name: 'Nairobi' },
      { '@type': 'AdministrativeArea', name: 'East Africa' },
      { '@type': 'AdministrativeArea', name: 'Africa' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
    ]
  }

  let serviceDoc: Partial<Service> | null = null
  let pricingList: Partial<Pricing>[] = []

  if (props && typeof props === 'object') {
    if (props.service) {
      serviceDoc = props.service
    } else if (props.slug || props.title) {
      serviceDoc = props
    }

    if (Array.isArray(props.pricings)) {
      pricingList = props.pricings
    } else if (Array.isArray(props.plans)) {
      pricingList = props.plans
    }
  } else if (Array.isArray(props)) {
    pricingList = props
  }

  const serviceSlug = serviceDoc?.slug || ''
  const serviceUrl = serviceSlug ? `${baseUrl}/services/${serviceSlug}` : `${baseUrl}/services`
  const serviceTitle = serviceDoc?.title || 'Web Design & Digital Services'
  const serviceDescription =
    serviceDoc?.summary ||
    serviceDoc?.meta?.description ||
    `Professional custom website design, responsive development, and digital marketing by ${orgName}.`

  // If specific plans/pricing collection items are available, generate individual Offer items for each plan
  let itemListElement: any[] = []

  if (pricingList.length > 0) {
    itemListElement = pricingList.map((plan) => {
      const planTitle = plan.title || (plan.planType ? `${plan.planType.toUpperCase()} Plan` : serviceTitle)
      const rawPrice = plan.price
      const currency = plan.currency || 'KES'
      const formattedPrice =
        rawPrice !== undefined && rawPrice !== null
          ? typeof rawPrice === 'number'
            ? rawPrice.toFixed(2)
            : String(rawPrice)
          : undefined

      const planTypeLabel = plan.planType ? `${plan.planType} tier` : serviceTitle

      return {
        '@type': 'Offer',
        name: planTitle,
        url: serviceUrl,
        ...(formattedPrice ? { price: formattedPrice, priceCurrency: currency } : {}),
        itemOffered: {
          '@type': 'Service',
          '@id': `${serviceUrl}#service-${plan.id || plan.planType || 'plan'}`,
          name: `${serviceTitle} - ${planTitle}`,
          serviceType: planTypeLabel,
          description: serviceDescription,
          url: serviceUrl,
          provider: {
            '@type': 'Organization',
            '@id': `${baseUrl}/#organization`,
            name: orgName,
            url: baseUrl,
          },
          areaServed: globalTargetAreas,
        },
      }
    })
  } else {
    // Fallback single offer for the service when no pricing plan docs are explicitly attached
    itemListElement = [
      {
        '@type': 'Offer',
        name: serviceTitle,
        url: serviceUrl,
        itemOffered: {
          '@type': 'Service',
          '@id': `${serviceUrl}#service`,
          name: serviceTitle,
          serviceType: serviceDoc?.subTitle || serviceTitle,
          description: serviceDescription,
          url: serviceUrl,
          provider: {
            '@type': 'Organization',
            '@id': `${baseUrl}/#organization`,
            name: orgName,
            url: baseUrl,
          },
          areaServed: globalTargetAreas,
        },
      },
    ]
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${baseUrl}/#primary-services`,
    name: props?.catalogName || `Service Plans & Offers for ${serviceTitle}`,
    itemListElement,
  }
}


