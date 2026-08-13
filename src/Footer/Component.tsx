import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import type { Footer as FooterType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as FooterType

  const tagline = footerData?.tagline || 'Components made easy.'
  const menuColumns = footerData?.menuColumns || []
  const copyright =
    footerData?.copyright || `© ${new Date().getFullYear()} Your Company. All rights reserved.`
  const bottomLinks = footerData?.bottomLinks || []

  return (
    <footer className="mx-auto w-full border-t border-border bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Main Footer Links Section */}
        <div className="grid gap-10 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Identity / Logo Column */}
          <div className="lg:mr-12 flex flex-col items-start gap-4 sm:col-span-2 md:col-span-4 lg:col-span-1">
            <Link
              href="/"
              aria-label="Go to homepage"
              className="transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              <Logo loading="eager" priority="high" />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">{tagline}</p>
          </div>

          {/* Dynamic Menu Columns */}
          {menuColumns.map((column, columnIdx) => (
            <div key={columnIdx} className="flex flex-col gap-3 mt-4">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground/90">
                {column.columnTitle}
              </h3>
              <ul className="space-y-2.5" role="list">
                {column.links?.map(({ link }, linkIdx) => (
                  <li key={linkIdx}>
                    <CMSLink
                      {...link}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Legal Row */}
        <div className="mt-12 border-t border-border pt-8 md:mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground md:text-sm">{copyright}</p>
            <nav aria-label="Footer Secondary Navigation">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2" role="list">
                {bottomLinks.map(({ link }, linkIdx) => (
                  <li key={linkIdx}>
                    <CMSLink
                      {...link}
                      className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none"
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
