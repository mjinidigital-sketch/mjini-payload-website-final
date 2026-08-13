'use client'

import React from 'react'
import { ArrowUpRight, CalendarDays, User } from 'lucide-react'
import { format } from 'date-fns'

import type { Post } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import AnimatedGridPattern from '@/components/animated-grid-pattern'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const authorsToUse = (populatedAuthors || []).filter(
    (author): author is NonNullable<NonNullable<Post['populatedAuthors']>[number]> =>
      typeof author === 'object' && author !== null,
  )

  const authorsString = formatAuthors(authorsToUse) || ''
  const hasAuthors = authorsString.length > 0
  const firstCategory = categories?.[0]

  return (
    <section
      className={cn(
        'relative isolate flex min-h-[50svh] md:min-h-[60svh] flex-col items-center justify-center overflow-hidden border-b border-border bg-background px-6 py-24 md:py-28',
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

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center mt-20">
        {/* Eyebrow Category / Badge Layout */}
        {firstCategory && typeof firstCategory === 'object' && (
          <Badge
            variant="secondary"
            className="mb-8 rounded-full border border-border/80 bg-background/50 px-4 py-1.5 text-xs font-medium tracking-wide text-foreground shadow-sm backdrop-blur-md transition-colors"
          >
            <span>{firstCategory.title}</span>
            <ArrowUpRight className="ml-1.5 size-3.5 opacity-70" />
          </Badge>
        )}

        {/* Core Typography Hierarchy Content Block */}
        <div className="space-y-6 mt-8">
          <h1
            className={cn(
              'mx-auto max-w-3xl font-bold tracking-tight text-foreground/90 text-pretty',
              'text-5xl leading-[1.15] md:text-6xl lg:text-7xl',
            )}
          >
            {title}
          </h1>

          {/* Sub-Header Metadata Row matching structural spacing guidelines */}
          <div className="mx-auto flex flex-wrap items-center justify-center gap-4 pt-2 text-sm md:text-base text-muted-foreground font-medium">
            <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
              <Avatar className="h-5 w-5 border">
                <AvatarFallback className="text-[10px]">
                  {hasAuthors ? authorsString.charAt(0) : 'D'}
                </AvatarFallback>
              </Avatar>
              <span className="text-foreground text-xs md:text-sm font-semibold">
                {hasAuthors ? authorsString : 'Mjini Digital'}
              </span>
            </div>

            {publishedAt && (
              <div className="flex items-center gap-1.5 text-xs md:text-sm bg-muted/40 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
                <CalendarDays className="h-3.5 w-3.5 opacity-70" />
                <span>Published {format(new Date(publishedAt), 'MMMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Integrated Hero Media Canvas Frame */}
        {heroImage && typeof heroImage !== 'string' && (
          <div className="mt-14 aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-xl relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-60 pointer-events-none" />
            <Media
              priority
              imgClassName="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              resource={heroImage}
            />
          </div>
        )}
      </div>
    </section>
  )
}
