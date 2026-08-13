import { getServerSideURL } from '@/utilities/getURL'

export interface BreadcrumbItem {
  name: string // The title visible to the user (e.g., "Web Design Nairobi")
  url: string // Absolute URL or relative path (e.g., "/services/web-design" or "https://mjinidigital.co.ke/services")
}

export interface BreadcrumbSchemaProps {
  items?: BreadcrumbItem[]
  autoPrependHome?: boolean
  homeTitle?: string
  baseUrl?: string
  id?: string
}

const DEFAULT_BASE_URL = 'https://mjinidigital.co.ke'

/**
 * Normalizes a URL to be a fully qualified absolute URL as required by Schema.org.
 */
const toAbsoluteUrl = (rawUrl: string, base: string): string => {
  if (!rawUrl) return base

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl
  }

  const cleanBase = base.replace(/\/$/, '')
  const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`
  return `${cleanBase}${cleanPath}`
}

/**
 * Builds a Schema.org compliant BreadcrumbList JSON-LD object.
 * Accepts either an array of BreadcrumbItem or a BreadcrumbSchemaProps object.
 */
export const breadcrumbSchema = (
  input?: BreadcrumbItem[] | BreadcrumbSchemaProps,
) => {
  if (!input) return null

  let rawItems: BreadcrumbItem[] = []
  let autoPrependHome = true
  let homeTitle = 'Home'
  let customBaseUrl: string | undefined
  let customId: string | undefined

  if (Array.isArray(input)) {
    rawItems = input
  } else {
    rawItems = input.items || []
    autoPrependHome = input.autoPrependHome !== false
    homeTitle = input.homeTitle || 'Home'
    customBaseUrl = input.baseUrl
    customId = input.id
  }

  if (!rawItems || rawItems.length === 0) return null

  const resolvedBaseUrl = (customBaseUrl || getServerSideURL() || DEFAULT_BASE_URL).replace(
    /\/$/,
    '',
  )
  const fallbackBaseUrl = resolvedBaseUrl.startsWith('http')
    ? resolvedBaseUrl
    : DEFAULT_BASE_URL

  const itemsToProcess: BreadcrumbItem[] = [...rawItems]

  // Check if first item is already Home / Root
  if (autoPrependHome && itemsToProcess.length > 0) {
    const firstUrl = itemsToProcess[0].url ? itemsToProcess[0].url.trim() : ''
    const firstName = itemsToProcess[0].name ? itemsToProcess[0].name.trim().toLowerCase() : ''

    const isFirstItemHome =
      firstUrl === '/' ||
      firstUrl === '' ||
      firstUrl === fallbackBaseUrl ||
      firstUrl === `${fallbackBaseUrl}/` ||
      firstName === 'home'

    if (!isFirstItemHome) {
      itemsToProcess.unshift({
        name: homeTitle,
        url: fallbackBaseUrl,
      })
    }
  }

  if (itemsToProcess.length === 0) return null

  const formattedItems = itemsToProcess.map((item, index) => {
    const absUrl = toAbsoluteUrl(item.url, fallbackBaseUrl)
    return {
      '@type': 'ListItem',
      position: index + 1, // Schema.org 1-based indexing required by Google
      name: item.name.trim(),
      item: absUrl,
    }
  })

  const canonicalId =
    customId || `${formattedItems[formattedItems.length - 1]?.item || fallbackBaseUrl}#breadcrumb`

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': canonicalId,
    itemListElement: formattedItems,
  }
}

/**
 * Async getter helper for symmetry with other Schema utility modules.
 */
export const getBreadcrumbSchema = async (
  input?: BreadcrumbItem[] | BreadcrumbSchemaProps,
) => {
  return breadcrumbSchema(input)
}

/**
 * React Component to render the BreadcrumbList JSON-LD script tag on pages.
 */
export function BreadcrumbSchema(
  props: BreadcrumbItem[] | BreadcrumbSchemaProps,
) {
  const schemaObj = breadcrumbSchema(props)

  if (!schemaObj) return null

  return (
    <script
      id="breadcrumb-schema-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaObj),
      }}
    />
  )
}

export default BreadcrumbSchema

