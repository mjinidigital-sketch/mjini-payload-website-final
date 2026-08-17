'use client'

import React from 'react'
import { ArrowUpRight, CirclePlay } from 'lucide-react'
import Link from 'next/link'

import type { Service, Page } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import AnimatedGridPattern from '@/components/animated-grid-pattern'
import { cn } from '@/utilities/ui'

export interface ServiceHeroProps {
  service?: Service | null
  className?: string
  links?: Page['hero']['links']
  richText?: Page['hero']['richText']
}

export const ServiceHero: React.FC<ServiceHeroProps> = ({
  service,
  className,
  links,
  richText,
}) => {
  const title = service?.title
  const subTitle = service?.subTitle
  const summary = service?.summary

  // Destructure with safe, intentional fallbacks from links array
  const primaryLink = links?.[0]?.link
  const secondaryLink = links?.[1]?.link
  const badgeLink = links?.[2]?.link

  return (
    <section
      className={cn(
        'relative isolate flex min-h-[40svh] md:min-h-[100svh] flex-col items-center justify-center overflow-hidden border-b border-border bg-background px-6 py-24 md:py-32',
        className,
      )}
    >
      {/* 1. Base Subtle Ambient Gradients (Primary & Accent) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 select-none overflow-hidden"
      >
        {/* Primary Color Glow (Top Left Offset) */}
        <div
          className="absolute -top-[20%] left-1/4 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full opacity-[0.06] blur-[120px] dark:opacity-[0.09]"
          style={{ backgroundColor: 'var(--primary, hsl(var(--primary)))' }}
        />
        {/* Accent Color Glow (Bottom Right Offset) */}
        <div
          className="absolute top-[20%] left-2/3 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full opacity-[0.04] blur-[120px] dark:opacity-[0.07]"
          style={{ backgroundColor: 'var(--accent, hsl(var(--accent)))' }}
        />
      </div>

      {/* 2. Interactive Animated Grid Pattern Overlay */}
      <AnimatedGridPattern
        duration={4}
        maxOpacity={0.04}
        numSquares={20}
        className={cn(
          'absolute inset-0 -z-20 h-full w-full',
          '[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]',
        )}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center mt-28">
        {/* Eyebrow / Badge */}
        {badgeLink?.url && (
          <Badge
            asChild
            variant="secondary"
            className="mb-8 rounded-full border border-border/80 bg-background/50 px-4 py-1.5 text-xs font-medium tracking-wide text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-muted/80"
          >
            <Link
              href={badgeLink.url}
              {...(badgeLink.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {badgeLink.label || 'Our Services'}
              <ArrowUpRight className="ml-1.5 size-3.5 opacity-70" />
            </Link>
          </Badge>
        )}

        {/* Core Content Layout */}
        {richText ? (
          <RichText
            data={richText}
            enableGutter={false}
            className={cn(
              'prose dark:prose-invert mx-auto max-w-4xl',
              'prose-h1:mx-auto prose-h1:max-w-3xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:text-foreground',
              'prose-h1:leading-[1.15] prose-h1:text-6xl lg:prose-h1:text-7xl',
              'prose-p:mx-auto prose-p:mt-6 prose-p:max-w-2xl prose-p:font-normal prose-p:text-muted-foreground',
              'prose-p:text-base sm:prose-p:text-lg md:prose-p:text-xl md:prose-p:leading-relaxed',
            )}
          />
        ) : (
          <div className="space-y-6">
            <h1
              className={cn(
                'mx-auto max-w-3xl font-bold tracking-tight text-foreground/90',
                'text-5xl leading-[1.15] md:text-6xl lg:text-7xl',
              )}
            >
              {title || 'Build better digital experiences'}
            </h1>

            <h2
              className={cn(
                'mx-auto max-w-4xl text-primary',
                'text-2xl font-medium tracking-tight',
              )}
            >
              {subTitle || 'Build better digital experiences'}
            </h2>

            <p className="mx-auto max-w-4xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              {summary ||
                'Thoughtfully designed digital solutions that help your business stand out, connect with customers, and grow.'}
            </p>
          </div>
        )}

        {/* Call to Actions */}
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          {primaryLink ? (
            <CMSLink
              {...primaryLink}
              size="lg"
              className="group h-12 w-full rounded-full px-6 shadow-sm sm:w-auto"
            >
              {primaryLink.label || 'Get Started'}
              <ArrowUpRight className="ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </CMSLink>
          ) : (
            <Link href="/contact">
              <Button
                size="lg"
                className=" group h-12 w-full rounded-full px-6 shadow-sm sm:w-auto"
              >
                Get Started
                <ArrowUpRight className="ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          )}

          {secondaryLink ? (
            <CMSLink
              {...secondaryLink}
              appearance={secondaryLink.appearance || 'outline'}
              size="lg"
              className="h-12 w-full rounded-full px-6 sm:w-auto"
            >
              <ArrowUpRight className="ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

              {secondaryLink.label || 'Watch Demo'}
            </CMSLink>
          ) : (
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className=" border-2 border-accent h-12 w-full rounded-full px-6 sm:w-auto"
              >
                <ArrowUpRight className="ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Explore Our Projects
              </Button>
            </Link>
          )}
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-xs font-medium tracking-wide text-muted-foreground/60 uppercase">
          Designed for performance, usability, and growth.
        </p>
      </div>
    </section>
  )
}

export default ServiceHero
