import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

export interface LocalBusinessProps {
  agencySettings?: any
  name?: string
  telephone?: string
  email?: string
  streetAddress?: string
  locality?: string
  region?: string
  postalCode?: string
  latitude?: string | number
  longitude?: string | number
  gmbCid?: string
  keywords?: string | string[]
  areasServed?: { '@type': string; name: string }[]
  openingHours?: { dayOfWeek: string[]; opens: string; closes: string }[]
  priceRange?: string
  currenciesAccepted?: string
  socialLinks?: string[]
  slogan?: string
  description?: string
  logoUrl?: string
  imageUrls?: string[]
  [key: string]: any
}

export const localBusinessSchema = (props: LocalBusinessProps = {}) => {
  const baseUrl = getServerSideURL() || 'https://mjinidigital.co.ke'
  const settings = props.agencySettings
  const identity = settings?.identity
  const contact = settings?.contact
  const addressSettings = settings?.address
  const geoSettings = settings?.geo
  const commerceSettings = settings?.commerce

  // Dynamic values with fallbacks
  const name = props.name || identity?.name || 'Mjini Digital'
  const legalName = identity?.legalName || 'Mjini Digital Agency Ltd'
  const slogan = props.slogan || identity?.slogan || 'Empowering African Brands Online'
  const description =
    props.description ||
    identity?.description ||
    identity?.shortDescription ||
    'Mjini Digital is a premier SEO, web design, and digital marketing agency based in Nairobi, Kenya, offering custom web solutions for regional brands.'

  // Logo resolution
  let logoUrl = props.logoUrl
  if (!logoUrl && identity?.logo) {
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
  if (!logoUrl) logoUrl = `${baseUrl}/logo.png`

  // Images gallery resolution
  let imageUrls = props.imageUrls
  if (!imageUrls && Array.isArray(identity?.images) && identity.images.length > 0) {
    imageUrls = identity.images
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
  if (!imageUrls || imageUrls.length === 0) {
    imageUrls = [`${baseUrl}/assets/mjini-digital-nairobi-office.jpg`, logoUrl]
  }

  // Keywords
  let defaultKeywords = ['SEO', 'web design', 'digital marketing', 'Nairobi', 'Kenya']
  if (Array.isArray(commerceSettings?.defaultKeywords) && commerceSettings.defaultKeywords.length > 0) {
    defaultKeywords = commerceSettings.defaultKeywords
      .map((k: any) => (typeof k === 'string' ? k : k?.keyword))
      .filter(Boolean)
  }
  const keywordsString = Array.isArray(props.keywords)
    ? props.keywords.join(', ')
    : props.keywords || defaultKeywords.join(', ')

  // Price & Commerce
  const priceRange = props.priceRange || commerceSettings?.priceRange || identity?.priceRange || '$$'
  const currenciesAccepted =
    props.currenciesAccepted || commerceSettings?.currenciesAccepted || identity?.currenciesAccepted || 'KES, USD'
  const paymentAccepted =
    commerceSettings?.paymentAccepted || identity?.paymentAccepted || 'Cash, Bank Transfer, M-Pesa, Credit Card, PayPal'

  // Contact
  const telephone = props.telephone || contact?.primaryPhone || contact?.phone || '+254700000000'
  const email = props.email || contact?.primaryEmail || contact?.emails?.[0]?.email || 'hello@mjinidigital.co.ke'

  // Address
  const streetAddress = props.streetAddress || addressSettings?.streetAddress || 'Mombasa Road, Mirage Towers, Suite 4B'
  const addressLocality = props.locality || addressSettings?.addressLocality || 'Nairobi'
  const addressRegion = props.region || addressSettings?.addressRegion || 'Nairobi County'
  const postalCode = props.postalCode || addressSettings?.postalCode || '00100'
  const addressCountry = addressSettings?.addressCountry || 'KE'

  // Geolocation
  const latitude = props.latitude || geoSettings?.latitude || identity?.geo?.latitude || '-1.2921'
  const longitude = props.longitude || geoSettings?.longitude || identity?.geo?.longitude || '36.8219'

  // Social Links
  const socialList: string[] = []
  if (settings?.googleBusinessProfile) socialList.push(settings.googleBusinessProfile)
  if (Array.isArray(settings?.socials)) {
    settings.socials.forEach((soc: any) => {
      if (soc?.url) socialList.push(soc.url)
    })
  }
  const sameAsList = Array.from(
    new Set([
      ...(props.socialLinks || []),
      ...socialList,
      'https://facebook.com/mjinidigital',
      'https://linkedin.com/company/mjinidigital',
      'https://x.com/mjinidigital',
      'https://instagram.com/mjinidigital',
      props.gmbCid ? `https://google.com${props.gmbCid}` : 'https://g.co/kgs/mjinidigital',
    ]),
  )

  // Operating Hours
  let openingHoursList: any[] = []
  if (props.openingHours) {
    openingHoursList = props.openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    }))
  } else if (Array.isArray(commerceSettings?.openingHours) && commerceSettings.openingHours.length > 0) {
    openingHoursList = commerceSettings.openingHours.map((h: any) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: Array.isArray(h.dayOfWeek) ? h.dayOfWeek : [h.dayOfWeek],
      opens: h.opens || '08:00',
      closes: h.closes || '17:00',
    }))
  } else {
    openingHoursList = [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ]
  }

  // Areas Served
  let areaServedList: any[] = []
  if (props.areasServed) {
    areaServedList = props.areasServed
  } else if (Array.isArray(commerceSettings?.areaServed) && commerceSettings.areaServed.length > 0) {
    areaServedList = commerceSettings.areaServed.map((a: any) =>
      typeof a === 'string'
        ? { '@type': 'Country', name: a }
        : { '@type': a.type || 'Country', name: a.name, ...(a.sameAs ? { sameAs: a.sameAs } : {}) },
    )
  } else {
    areaServedList = [
      { '@type': 'AdministrativeArea', name: 'Nairobi' },
      { '@type': 'AdministrativeArea', name: 'Mombasa' },
      { '@type': 'Country', name: 'Kenya' },
    ]
  }

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${baseUrl}/#localbusiness`,

    name,
    legalName,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl,
      width: '512',
      height: '512',
    },
    image: imageUrls,
    description,
    slogan,
    keywords: keywordsString,

    priceRange,
    currenciesAccepted,
    paymentAccepted,

    telephone,
    email,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone,
      contactType: 'customer service',
      email,
      areaServed: 'KE',
      availableLanguage: ['English', 'Swahili'],
    },

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
      latitude: String(latitude),
      longitude: String(longitude),
    },

    sameAs: sameAsList,
    openingHoursSpecification: openingHoursList,
    areaServed: areaServedList,
  }
}

/**
 * Async helper to fetch agency-settings global from Payload CMS and construct localBusinessSchema object
 */
export const getLocalBusinessSchema = async (props: LocalBusinessProps = {}) => {
  let agencySettings = props.agencySettings ?? null
  if (!agencySettings) {
    try {
      const payload = await getPayload({ config: configPromise })
      agencySettings = await payload.findGlobal({
        slug: 'agency-settings',
        depth: 1,
        overrideAccess: true,
      })
    } catch (err) {
      console.error('Error fetching agency-settings global for LocalBusiness schema:', err)
    }
  }
  return localBusinessSchema({ ...props, agencySettings })
}

/**
 * React Server Component to render LocalBusiness JSON-LD script tag
 */
export async function LocalBusiness(props: LocalBusinessProps = {}) {
  const schemaObj = await getLocalBusinessSchema(props)
  if (!schemaObj) return null

  return (
    <script
      id="local-business-schema-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaObj),
      }}
    />
  )
}

export default LocalBusiness

