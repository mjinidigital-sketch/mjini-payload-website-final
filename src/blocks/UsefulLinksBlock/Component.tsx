import React from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Link2 } from 'lucide-react'
import Title from '@/components/Title'
import { cn } from '@/utilities/ui'
import type { Page, Service, Post } from '@/payload-types'

export type UsefulLinkItem = {
  id?: string | null
  title: string
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
  links?: UsefulLinkItem[] | null
  disableInnerContainer?: boolean
  className?: string
}

function resolveReferenceHref(ref: UsefulLinkItem['reference']): string {
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

function resolveLinkHref(link: UsefulLinkItem): string {
  if (link.type === 'external') {
    return link.url || '#'
  }

  const href = resolveReferenceHref(link.reference)
  if (href === '#' && link.url) {
    return link.url
  }
  return href
}

export const UsefulLinksBlockComponent: React.FC<UsefulLinksBlockProps> = ({
  id,
  title,
  subTitle,
  description,
  links,
  disableInnerContainer = false,
  className,
}) => {
  if (!links || !Array.isArray(links) || links.length === 0) {
    return null
  }

  const validLinks = links.filter((link) => Boolean(link && link.title))

  if (validLinks.length === 0) {
    return null
  }

  const containerClasses = disableInnerContainer
    ? 'w-full'
    : 'container max-w-7xl mx-auto px-4 md:px-8'

  const hasHeader = Boolean(title || subTitle || description)

  return (
    <section
      id={id ? `block-${id}` : undefined}
      className={cn('py-12 md:py-16 bg-background/50', className)}
    >
      <div className={containerClasses}>
        {hasHeader && (
          <div className="mb-10 text-center">
            <Title
              title={title || ''}
              subTitle={subTitle || ''}
              description={description || ''}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {validLinks.map((link, idx) => {
            const isInternal = link.type !== 'external'
            const href = resolveLinkHref(link)
            const LinkWrapper = isInternal ? Link : 'a'
            const externalProps = !isInternal
              ? {
                  target: link.newTab ? '_blank' : '_self',
                  rel: 'noopener noreferrer',
                }
              : {}

            return (
              <LinkWrapper
                key={link.id || `useful-link-${idx}`}
                href={href}
                {...externalProps}
                className={cn(
                  'group relative flex items-center justify-between p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300',
                  'hover:bg-card hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                )}
              >
                <div className="flex items-center gap-3.5 overflow-hidden min-w-0 pr-2">
                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 ease-out">
                    {isInternal ? (
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
