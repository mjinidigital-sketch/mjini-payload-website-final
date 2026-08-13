export const siteNavigationSchema = () => {
  const baseUrl = 'https://mjinidigital.co.ke'

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Mjini Digital Main Navigation',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'Home',
        url: baseUrl,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'Web Design Service',
        url: `${baseUrl}/services/web-design-nairobi`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'SEO Services',
        url: `${baseUrl}/services/seo-services-kenya`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'Our Case Studies',
        url: `${baseUrl}/portfolio`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: 'Insights & Blog',
        url: `${baseUrl}/blog`,
      },
    ],
  }
}

//This schema helps Google’s bots index your website paths faster by
// explicitly declaring your main header or footer navigation links
// inside a clean JSON graph.
