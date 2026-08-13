import { personSchema } from './PersonSchema'

export const clientReviewSchema = (props: any) => {
  const baseUrl = 'https://mjinidigital.co.ke'

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${props.caseStudyUrl || baseUrl}#client-review`,
    itemReviewed: {
      '@type': 'Service',
      name: props.serviceRendered || 'E-commerce Website Development',
      provider: {
        '@id': `${baseUrl}/#organization`,
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: props.rating || '5',
      bestRating: '5',
    },
    name: props.reviewTitle || 'Exceptional Web Design and M-Pesa Integration',
    author: personSchema({
      name: props.clientName || 'John Kamau',
      jobTitle: props.clientTitle || 'Client',
    }),

    reviewBody:
      props.reviewText ||
      'Mjini Digital built our online store flawlessly. The M-Pesa STK push checkout automation has transformed how we handle payments.',
    publisher: {
      '@type': 'Organization',
      name: 'Mjini Digital',
    },
  }
}
// individual Review schema maps out specific, highly detailed client testimonials
//  on your dedicated case study or portfolio pages.
