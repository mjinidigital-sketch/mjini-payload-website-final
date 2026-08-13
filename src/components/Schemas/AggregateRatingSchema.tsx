export interface AggregateRatingProps {
  ratingValue?: string | number
  reviewCount?: string | number
  url?: string
}

export const aggregateRatingSchema = (props: AggregateRatingProps = {}) => {
  if (
    props.ratingValue === undefined ||
    props.ratingValue === null ||
    props.reviewCount === undefined ||
    props.reviewCount === null
  ) {
    return null
  }

  const baseUrl = 'https://mjinidigital.co.ke'
  const targetUrl = props.url || baseUrl

  const finalRating = String(props.ratingValue)
  const finalCount = String(props.reviewCount)

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${baseUrl}/#localbusiness`,

    name: 'Mjini Digital',
    url: targetUrl,

    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: finalRating,
      reviewCount: finalCount,
      bestRating: '5',
      worstRating: '1',
    },
  }
}

/**
 * React Component to render the AggregateRating JSON-LD script on pages.
 * Pass optional ratingValue and reviewCount, or fetch them dynamically via getGoogleReviews().
 */
export function AggregateRatingSchema(props: AggregateRatingProps) {
  const schemaObj = aggregateRatingSchema(props)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaObj),
      }}
    />
  )
}
