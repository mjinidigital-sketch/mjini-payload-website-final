import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Service } from '@/payload-types'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'

export type CardServiceData = Pick<Service, 'slug' | 'meta' | 'title' | 'subTitle' | 'summary'>

export const ServiceCard: React.FC<{
  className?: string
  doc?: CardServiceData
  relationTo?: 'services'
}> = ({ doc, relationTo = 'services', className }) => {
  const { slug, meta, title, summary, subTitle } = doc || {}
  const { image: metaImage } = meta || {}

  const href = `/${relationTo}/${slug}`

  return (
    <Link href={href} className={`group block h-full ${className || ''}`}>
      <article className="relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-2xl hover:shadow-black/10">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {metaImage && typeof metaImage !== 'string' ? (
            <>
              <Media
                resource={metaImage}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Floating indicator */}
              <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-primary">
                <ArrowRight className="h-4 w-4" />
              </div>

              {/* Bottom glow */}
              <div className="absolute -bottom-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl transition-transform duration-700 group-hover:scale-150" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center gap-3">
            <span className="h-1 w-8 bg-accent transition-all duration-500 group-hover:w-12" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Service
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-[26px]">
            {title || 'Professional Service'}
          </h3>

          {/* Subtitle */}
          <h4 className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-foreground/75">
            {subTitle || 'Professional digital solutions for modern businesses'}
          </h4>

          {/* Accent */}
          <div className="mt-2 h-1 w-10 overflow-hidden rounded-full bg-primary/20">
            <div className="h-full w-5 rounded-full bg-primary transition-all duration-500 group-hover:w-full" />
          </div>

          {/* Summary */}
          <p className="mt-2 line-clamp-3 text-[15px] leading-7 text-muted-foreground">
            {summary ||
              'Professional digital solutions designed to help businesses grow through modern technology, exceptional design, and measurable results.'}
          </p>

          {/* CTA */}
          <div className="mt-auto pt-7">
            <Button
              size="sm"
              variant="outline"
              className="h-11 rounded-full border-accent bg-transparent px-5 text-sm font-semibold transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
            >
              <span>Explore Service</span>

              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Subtle bottom accent */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
      </article>
    </Link>
  )
}
