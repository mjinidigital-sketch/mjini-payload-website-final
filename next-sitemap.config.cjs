const SITE_URL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_SERVER_URL &&
        !process.env.NEXT_PUBLIC_SERVER_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SERVER_URL
      : 'https://mjinidigital.co.ke'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
    '/services-sitemap.xml',
    '/projects-sitemap.xml',
    '/*',
    '/posts/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/services-sitemap.xml`,
      `${SITE_URL}/projects-sitemap.xml`,
    ],
  },
}
