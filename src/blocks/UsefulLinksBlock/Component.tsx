import React from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Globe, Link2, Sparkles } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cn } from '@/utilities/ui'
import type { Page, Service, Post } from '@/payload-types'

export type LinkItem = {
  id?: string | null
  title?: string | null
  description?: string | null
  type?: 'internal' | 'external' | null
  reference?:
    | {
        relationTo: 'pages' | 'services' | 'posts'
        value: (Page | Service | Post | string | number) | null
      }
    | (Page | Service | Post | string | number)
    | null
  url?: string | null
  newTab?: boolean | null
}

export interface UsefulLinksBlockProps {
  id?: string | null
  blockType?: 'usefulLinksBlock'
  blockName?: string | null
  title?: string | null
  subTitle?: string | null
  description?: string | null
  selectMethod?: 'all' | 'manual' | null
  limit?: number | null
  links?: LinkItem[] | null
  disableInnerContainer?: boolean
}

type ResolvedLink = {
  id: string
  title: string
  description?: string | null
  href: string
  isInternal: boolean
  newTab: boolean
}

function resolveReferenceHref(ref: LinkItem['reference']): string {
  if (!ref) return '#'

  // Handle polymorphic relation format { relationTo, value }
  if (typeof ref === 'object' && ref !== null && 'relationTo' in ref) {
    const relationTo = (ref as { relationTo: string; value: any }).relationTo
    const val = (ref as { relationTo: string; value: any }).value
    const slug = typeof val === 'object' && val !== null ? val.slug : ''

    if (relationTo === 'services') {
      return slug ? `/services/${slug}` : '/services'
    }
    if (relationTo === 'posts') {
      return slug ? `/posts/${slug}` : '/posts'
    }
    if (relationTo === 'pages') {
      return slug === 'home' || !slug ? '/' : `/${slug}`
    }
  }

  // Handle direct document object
  if (typeof ref === 'object' && ref !== null && 'slug' in ref) {
    const slug = (ref as { slug?: string }).slug
    if (slug === 'home') return '/'
    if (slug) return `/${slug}`
  }

  return '#'
}

export const UsefulLinksBlockComponent: React.FC<UsefulLinksBlockProps> = async ({
  id,
  title = 'Useful Links',
  subTitle,
  description,
  selectMethod = 'all',
  limit = 8,
  links: manualLinks,
  disableInnerContainer = false,
}) => {
  let resolvedLinks: ResolvedLink[] = []

  if (selectMethod === 'manual' && manualLinks && manualLinks.length > 0) {
    resolvedLinks = manualLinks
      .filter((link) => Boolean(link && (link.title || link.url || link.reference)))
      .map((link, idx) => {
        const isInternal = link.type !== 'external'
        let href = '#'

        if (isInternal) {
          href = resolveReferenceHref(link.reference)
          if (href === '#' && link.url) {
            href = link.url
          }
        } else {
          href = link.url || '#'
        }

        return {
          id: link.id || `manual-link-${idx}`,
          title: link.title || 'Learn More',
          description: link.description || null,
          href,
          isInternal,
          newTab: Boolean(link.newTab),
        }
      })
  } else {
    // Dynamic fetch from services
    try {
      const payload = await getPayload({ config: configPromise })
      const count = typeof limit === 'number' && limit > 0 ? limit : 8

      const fetchedServices = await payload.find({
        collection: 'services',
        depth: 1,
        limit: count,
        sort: 'title',
      })

      if (fetchedServices.docs && fetchedServices.docs.length > 0) {
        resolvedLinks = fetchedServices.docs.map((doc: Service) => ({
          id: `service-${doc.id}`,
          title: doc.title,
          description:
            doc.subTitle || (doc.summary as string) || ((doc.meta?.description as string) ?? null),
          href: `/services/${doc.slug}`,
          isInternal: true,
          newTab: false,
        }))
      }
    } catch (error) {
      console.error('Error fetching useful links services:', error)
    }
  }

  if (resolvedLinks.length === 0) {
    return null
  }

  const containerClasses = disableInnerContainer
    ? 'w-full'
    : 'container max-w-7xl mx-auto px-4 md:px-8'

  return (
    <section id={id ? `block-${id}` : undefined} className="py-12 md:py-16 bg-background/50">
      <div className={containerClasses}>
        {(title || subTitle || description) && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              {subTitle && (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{subTitle}</span>
                </div>
              )}
              {title && (
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
                  {title}
                </h2>
              )}
              {description && <p className="mt-2 text-base text-muted-foreground">{description}</p>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {resolvedLinks.map((link) => {
            const LinkWrapper = link.isInternal ? Link : 'a'
            const externalProps = !link.isInternal
              ? {
                  target: link.newTab ? '_blank' : '_self',
                  rel: 'noopener noreferrer',
                }
              : {}

            return (
              <LinkWrapper
                key={link.id}
                href={link.href}
                {...externalProps}
                className={cn(
                  'group relative flex items-center justify-between p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300',
                  'hover:bg-card hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                )}
              >
                <div className="flex items-center gap-3.5 overflow-hidden min-w-0 pr-2">
                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 ease-out">
                    {link.isInternal ? (
                      <Link2 className="w-4 h-4" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors duration-200">
                      {link.title}
                    </span>
                    {link.description && (
                      <span className="text-xs text-muted-foreground truncate opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                        {link.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 ml-auto pl-1">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                </div>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </LinkWrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { UsefulLinksBlockComponent as UsefulLinksBlock }
export default UsefulLinksBlockComponent
