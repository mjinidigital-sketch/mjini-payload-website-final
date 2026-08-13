import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

export interface WebsiteSchemaProps {
  agencySettings?: any
  name?: string
  alternateName?: string[]
  description?: string
  url?: string
  inLanguage?: string[]
  sameAs?: string[]
  meta?: {
    title?: string
    description?: string
    image?: any
    [key: string]: any
  } | null
  page?: any
  [key: string]: any
}

const DEFAULT_DESCRIPTION =
  'A Nairobi-based premier digital growth agency building conversion-focused websites, advanced SEO systems, secure ecommerce platforms, and high-performance software systems for local and international brands.'

/**
 * Builds a Schema.org compliant WebSite JSON-LD object.
 * Accepts optional properties, meta objects, and AgencySettings global.
 */
export const websiteSchema = (props: WebsiteSchemaProps = {}) => {
  const baseUrl = props.url || getServerSideURL() || 'https://mjinidigital.co.ke'
  const organizationId = `${baseUrl}/#organization`

  const settings = props.agencySettings
  const identity = settings?.identity

  const siteName =
    props.name || props.meta?.title || props.page?.meta?.title || identity?.name || 'Mjini Digital'

  const description =
    props.description ||
    props.meta?.description ||
    props.page?.meta?.description ||
    identity?.description ||
    identity?.shortDescription ||
    DEFAULT_DESCRIPTION

  // Alternate names
  let alternateNameList = props.alternateName
  if (!alternateNameList && Array.isArray(identity?.alternateName) && identity.alternateName.length > 0) {
    alternateNameList = identity.alternateName
      .map((item: any) => (typeof item === 'string' ? item : item?.name))
      .filter(Boolean)
  }
  if (!alternateNameList || alternateNameList.length === 0) {
    alternateNameList = ['Mjini Digital Agency', 'Mjini Digital Kenya', 'Mjini Digital Agency Ltd']
  }

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
      ...(props.sameAs || []),
      ...socialList,
      'https://facebook.com/mjinidigital',
      'https://x.com/mjinidigital',
      'https://instagram.com/mjinidigital',
      'https://linkedin.com/company/mjinidigital',
      'https://youtube.com/@mjinidigital',
    ]),
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: siteName,
    alternateName: alternateNameList,
    description,
    url: baseUrl,
    inLanguage: props.inLanguage || ['en-KE', 'en-US'],

    // Relational nodes back to primary Organization schema
    publisher: {
      '@id': organizationId,
    },
    copyrightHolder: {
      '@id': organizationId,
    },
    about: {
      '@id': organizationId,
    },

    sameAs: sameAsList,

    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Asynchronously fetches home page metadata and agency-settings from Payload CMS if not provided,
 * and generates the complete WebSite schema object.
 */
export const getWebsiteSchema = async (props: WebsiteSchemaProps = {}) => {
  let homeMeta = props.meta || props.page?.meta
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
        console.error('Error fetching agency-settings for websiteSchema:', err)
      }
    }

    if (!homeMeta && !props.description) {
      const result = await payload.find({
        collection: 'pages',
        draft: false,
        limit: 1,
        overrideAccess: false,
        where: {
          slug: {
            equals: 'home',
          },
        },
      })
      homeMeta = result.docs?.[0]?.meta || null
    }
  } catch (err) {
    console.error('Error fetching data for websiteSchema:', err)
  }

  return websiteSchema({
    ...props,
    agencySettings,
    meta: homeMeta,
  })
}

/**
 * React Component to render WebSite JSON-LD script tag on pages.
 * Dynamically fetches home page meta description and agency-settings from Payload CMS if not explicitly passed as props.
 */
export async function WebsiteSchema(props: WebsiteSchemaProps = {}) {
  const schemaObj = await getWebsiteSchema(props)

  if (!schemaObj) return null

  return (
    <script
      id="website-schema-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaObj),
      }}
    />
  )
}

export default WebsiteSchema


