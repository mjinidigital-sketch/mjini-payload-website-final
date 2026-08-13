'use client'

import React from 'react'
import { ArrowUpRight, CirclePlay } from 'lucide-react'
import Link from 'next/link'
import type { Project, Page } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export interface ProjectsHeroProps {
  project?: Project | null
  className?: string
  links?: Page['hero']['links']
  media?: Page['hero']['media']
  richText?: Page['hero']['richText']
}

export const ProjectsHero: React.FC<ProjectsHeroProps> = ({
  project,
  className,
  links,
  media,
  richText,
}) => {
  const primaryLink = links?.[0]?.link
  const secondaryLink = links?.[1]?.link
  const badgeLink = links?.[2]?.link

  const heroImage = project?.heroImage || media

  return (
    <div
      className={cn(
        'bg-accent/10 container flex min-h-screen items-center justify-center px-6 py-12 mt-20',
        className,
      )}
    >
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) gap-16 lg:grid-cols-2">
        <div>
          <Badge asChild className="rounded-full border-border py-1" variant="secondary">
            <Link href={badgeLink?.url || '#'}>
              {badgeLink?.label || 'Just released v1.0.0'} <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </Badge>

          {richText ? (
            <RichText
              data={richText}
              enableGutter={false}
              enableProse={true}
              className={cn(
                '[&_h1]:mt-6',
                '[&_h1]:text-3xl',
                '[&_h1]:font-bold',
                '[&_h1]:text-foreground/90',
                '[&_h1]:leading-[1.1]',
                '[&_h1]:tracking-tight',
                '[&_h1]:text-balance',

                '[&_h2]:mt-6',
                '[&_h2]:text-2xl',
                'md:[&_h2]:text-3xl',
                '[&_h2]:font-bold',
                '[&_h2]:text-foreground/90',
              )}
            />
          ) : (
            <>
              <h1 className="mt-6 max-w-[17ch] font-extrabold text-3xl leading-[1.1] tracking-tight text-foreground/90 md:text-4xl lg:text-5xl">
                {project?.title || (
                  <>
                    Your complete
                    <br /> UI building toolkit
                  </>
                )}
              </h1>
            </>
          )}

          {primaryLink || secondaryLink ? (
            <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-12">
              {primaryLink && (
                <CMSLink
                  {...primaryLink}
                  size="lg"
                  className="rounded-full inline-flex items-center gap-2"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </CMSLink>
              )}
              {secondaryLink && (
                <CMSLink
                  {...secondaryLink}
                  appearance={secondaryLink.appearance || 'outline'}
                  size="lg"
                  className="rounded-full shadow-none inline-flex items-center gap-2 border border-accent"
                >
                  <CirclePlay className="h-5 w-5" />
                </CMSLink>
              )}
            </div>
          ) : (
            <div className="mt-8 flex items-center gap-4 sm:mt-12">
              <Button className="rounded-full " size="lg">
                Get Started <ArrowUpRight className="h-5 w-5" />
              </Button>
              <Button
                className="rounded-full shadow-none border-2 border-accent"
                size="lg"
                variant="outline"
              >
                <CirclePlay className="h-5 w-5 text-accent" /> Watch Demo
              </Button>
            </div>
          )}
        </div>

        {heroImage && typeof heroImage === 'object' ? (
          <div className="mt-auto w-full overflow-hidden rounded-xl border-4 border-accent">
            <Media
              resource={heroImage}
              priority
              className="h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="mt-auto w-full rounded-xl bg-accent" />
        )}
      </div>
    </div>
  )
}

export const ProjectHero = ProjectsHero
export default ProjectsHero
