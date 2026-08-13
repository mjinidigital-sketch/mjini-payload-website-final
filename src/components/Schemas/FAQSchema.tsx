import type { Faq, Service } from '@/payload-types'

// ---------------------------------------------------------------------------
// Helper: extract plain text from a Lexical rich text root node
// ---------------------------------------------------------------------------
function lexicalToPlainText(richText: Faq['answer'] | null | undefined): string {
  if (!richText?.root?.children) return ''

  const walkNodes = (nodes: any[]): string =>
    nodes
      .map((node: any) => {
        if (node.text !== undefined) return node.text as string
        if (Array.isArray(node.children)) return walkNodes(node.children)
        return ''
      })
      .join('')

  return walkNodes(richText.root.children).replace(/\s+/g, ' ').trim()
}

// ---------------------------------------------------------------------------
// Props interface
// ---------------------------------------------------------------------------
export interface FAQSchemaProps {
  /** The current service page document */
  service?: Partial<Service> | null
  /** FAQs already fetched for this service — pass Faq[] from Payload */
  faqs?: Faq[] | null
  /** Override the canonical page URL (defaults to /services/<slug>) */
  url?: string
  /** Override the FAQPage display name */
  name?: string
}

// ---------------------------------------------------------------------------
// faqSchema — returns a Schema.org FAQPage node or null when there are no
// FAQs for this service.  Designed to be included in the @graph array on the
// service page.
// ---------------------------------------------------------------------------
export const faqSchema = (props: FAQSchemaProps = {}) => {
  const baseUrl = 'https://mjinidigital.co.ke'
  const serviceSlug = props.service?.slug || 'web-design-nairobi'
  const pageUrl = props.url || `${baseUrl}/services/${serviceSlug}`

  const faqItems = props.faqs ?? []

  if (faqItems.length === 0) return null

  const mainEntity = faqItems.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: lexicalToPlainText(faq.answer),
    },
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    url: pageUrl,
    name:
      props.name ||
      `${props.service?.title ?? 'Service'} — Frequently Asked Questions | Mjini Digital`,

    // Tie this FAQ block to the brand organisation node
    provider: {
      '@id': `${baseUrl}/#organization`,
    },

    mainEntity,
  }
}
