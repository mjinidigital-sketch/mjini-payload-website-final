import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Redirect legacy /:slug URLs to the canonical /pages/:slug path.
  // Excludes real Next.js route segments and Payload/system paths.
  const pageSlugRedirect = {
    source: '/:slug((?!pages|posts|projects|services|search|api|next|admin|ie-incompatible|_next|favicon|sitemap|robots)[^/]+)',
    destination: '/pages/:slug',
    permanent: true,
  }

  return [internetExplorerRedirect, pageSlugRedirect]
}
