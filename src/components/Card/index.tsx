import Link from 'next/link'
import React from 'react'
import { ChevronRight } from 'lucide-react'

import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { Card as ShadcnCard, CardContent, CardHeader } from '@/components/ui/card'

export type CardPostData = Pick<
  Post,
  'slug' | 'categories' | 'meta' | 'title' | 'publishedAt' | 'populatedAuthors'
>

export const Card: React.FC<{
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
}> = (props) => {
  const { doc, relationTo = 'posts', showCategories } = props

  const { slug, categories, meta, title, publishedAt } = doc || {}
  const { image: metaImage, description: metaDescription } = meta || {}

  // Fallback structures for Payload data fields
  const displayTitle = title || meta?.title || 'Untitled'
  const displayDescription = metaDescription || ''

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const href = `/${relationTo}/${slug}`

  // Standardized Reading Time calculation based on body content or manual estimation
  const readingTime = '5 min read'

  return (
    <Link href={href} className="group block h-full">
      <ShadcnCard className="flex flex-col h-full overflow-hidden border border-border bg-card transition-all duration-200 hover:shadow-md">
        {/* Card Header Image Area */}
        <CardHeader className="p-0 aspect-[16/10] relative overflow-hidden bg-muted w-full shrink-0">
          {metaImage && typeof metaImage !== 'string' ? (
            <Media
              resource={metaImage}
              size="100vw"
              imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted-foreground/10 flex items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
        </CardHeader>

        {/* Card Typography & Layout Content Block */}
        <CardContent className="flex flex-col flex-1 p-6">
          {/* Top Metadata Row: Categories & Read Time */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              {showCategories && hasCategories && (
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((category, index) => {
                    if (typeof category === 'object' && category?.title) {
                      return (
                        <Badge key={index} variant="secondary" className="font-medium">
                          {category.title}
                        </Badge>
                      )
                    }
                    return null
                  })}
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap shrink-0">
              {readingTime}
            </span>
          </div>

          {/* Title & Core Summary Text Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-xl leading-snug tracking-tight text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {displayTitle}
            </h3>
            {displayDescription && (
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {displayDescription}
              </p>
            )}
          </div>

          {/* Interactive Footer Callout link */}
          <div className="mt-4 pt-4 border-t border-border flex items-center text-sm font-medium text-primary gap-1 group-hover:underline">
            Read article
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </ShadcnCard>
    </Link>
  )
}
