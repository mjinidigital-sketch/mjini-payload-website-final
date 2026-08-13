import React from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink, MapPin, Tag } from 'lucide-react'

import type { Project } from '@/payload-types'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'

export type CardProjectData = Pick<
  Project,
  'slug' | 'meta' | 'title' | 'companyName' | 'industry' | 'location' | 'website'
>

export const ProjectCard: React.FC<{
  className?: string
  doc?: CardProjectData
  relationTo?: 'projects'
}> = ({ doc, relationTo = 'projects', className }) => {
  const { slug, meta, title, companyName, industry, location, website } = doc || {}

  const { image: metaImage } = meta || {}

  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 ${className || ''}`}
    >
      {/* Image */}
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {metaImage && typeof metaImage !== 'string' ? (
            <>
              <Media
                resource={metaImage}
                fill
                imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image available
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {/* Industry */}
        {industry && (
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-accent text-primary">
              <Tag className="size-3.5" />
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              {industry}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg line-clamp-2 font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
          {title}
        </h3>

        {/* Company */}
        {companyName && (
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {' '}
            <span className="text-primary">Company: </span>
            {companyName}
          </p>
        )}

        {/* Accent */}
        <div className="mt-5 h-px w-full bg-accent/70">
          <div className="h-px w-12 bg-accent transition-all duration-500 group-hover:w-20" />
        </div>

        {/* Meta */}
        <div className="mt-5 space-y-3">
          {location && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0 text-accent" />
              <span className="truncate">{location}</span>
            </div>
          )}

          {website && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <ExternalLink className="size-4 shrink-0 text-accent" />
              <span className="truncate">{website}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-7">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="group/button h-10 w-full rounded-full border-primary/30 bg-primary/10 px-5 text-primary shadow-none transition-all duration-300 hover:border-accent hover:bg-accent hover:text-primary-foreground"
          >
            <Link href={href}>
              <span>View Case Study</span>

              <ArrowRight className="ml-auto size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
