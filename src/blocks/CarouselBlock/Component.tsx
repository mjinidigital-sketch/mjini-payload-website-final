'use client'

import React from 'react'
import type { Media as MediaType } from '@/payload-types'
import { ImageIcon } from 'lucide-react'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export interface CarouselImageItem {
  id?: string | null
  image?: MediaType | number | string | null
  media?: MediaType | number | string | null
  caption?: string | null
  alt?: string | null
}

export interface CarouselBlockProps {
  id?: string
  title?: string | null
  subTitle?: string | null
  /** Optional "View all" link shown in the header */
  viewAllHref?: string | null
  /** Label for the "View all" button (defaults to "View all") */
  viewAllLabel?: string | null

  images?: CarouselImageItem[] | null
  slides?: CarouselImageItem[] | null
  media?: MediaType | number | string | null

  showControls?: boolean | null
  showCaptions?: boolean | null

  /**
   * Number of items visible on desktop.
   * Maps to Tailwind basis classes: 1→full, 2→1/2, 3→1/3, 4→1/4
   */
  visibleItems?: 1 | 2 | 3 | 4 | number | null

  /**
   * Image aspect ratio.
   */
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9' | string | null

  disableInnerContainer?: boolean
}

// ─── helpers ────────────────────────────────────────────────────────────────

function getBasisClass(visible: number): string {
  switch (visible) {
    case 1:
      return 'basis-full'
    case 2:
      return 'basis-1/2'
    case 3:
      return 'basis-1/3'
    case 4:
    default:
      return 'basis-1/2 md:basis-1/3 lg:basis-1/4'
  }
}

function getAspectClass(ratio: string): string {
  switch (ratio) {
    case '1/1':
      return 'aspect-square'
    case '21/9':
      return 'aspect-[21/9]'
    case '16/9':
      return 'aspect-[16/9] min-h-[260px]'
    case '4/3':
    default:
      return 'aspect-[4/3] min-h-[300px]'
  }
}

// ─── component ──────────────────────────────────────────────────────────────

export const CarouselBlock: React.FC<CarouselBlockProps> = ({
  id,
  title,
  subTitle,
  viewAllHref,
  viewAllLabel = 'View all',

  images: rawImages,
  slides: rawSlides,
  media: rawMedia,

  showControls = true,
  showCaptions = true,

  visibleItems = 4,
  aspectRatio = '4/3',

  disableInnerContainer = false,
}) => {
  // ── normalise items ───────────────────────────────────────────────────────

  const items = React.useMemo<CarouselImageItem[]>(() => {
    const list: CarouselImageItem[] = []

    if (rawImages?.length) {
      rawImages.forEach((item) => {
        if (item?.image || item?.media) {
          list.push({
            id: item.id,
            image: item.image || item.media,
            caption: item.caption,
            alt: item.alt,
          })
        }
      })
    } else if (rawSlides?.length) {
      rawSlides.forEach((item) => {
        if (item?.image || item?.media) {
          list.push({
            id: item.id,
            image: item.image || item.media,
            caption: item.caption,
            alt: item.alt,
          })
        }
      })
    } else if (rawMedia) {
      list.push({ image: rawMedia, caption: title || '' })
    }

    // placeholder tiles while configuring in Payload CMS
    if (!list.length) {
      return [
        { id: 'placeholder-1', caption: 'Showcase Image 1' },
        { id: 'placeholder-2', caption: 'Showcase Image 2' },
        { id: 'placeholder-3', caption: 'Showcase Image 3' },
        { id: 'placeholder-4', caption: 'Showcase Image 4' },
      ]
    }

    return list
  }, [rawImages, rawSlides, rawMedia, title])

  const safeVisible = visibleItems ?? 4
  const basisClass = getBasisClass(safeVisible)
  const aspectClass = getAspectClass(aspectRatio ?? '16/9')

  return (
    <section id={id ? `block-${id}` : undefined} className="w-full py-10 md:py-14 lg:py-20">
      <div
        className={
          disableInnerContainer
            ? 'mx-auto container'
            : 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10'
        }
      >
        {/* ── HEADER ────────────────────────────────────────────────── */}

        {(title || subTitle) && (
          <div className="flex items-end justify-between">
            <div>
              {title && (
                <h2 className="text-3xl font-medium tracking-tight text-foreground">{title}</h2>
              )}
              {subTitle && (
                <p className="mt-2 text-pretty text-lg leading-snug text-muted-foreground">
                  {subTitle}
                </p>
              )}
            </div>

            {viewAllHref && (
              <Button asChild size="sm" variant="outline" className="max-sm:hidden">
                <a href={viewAllHref} target="_blank" rel="noopener noreferrer">
                  {viewAllLabel}
                </a>
              </Button>
            )}
          </div>
        )}

        {/* ── CAROUSEL ──────────────────────────────────────────────── */}

        <Carousel className="mt-6 w-full" opts={{ loop: true, align: 'start' }}>
          <CarouselContent>
            {items.map((item, index) => {
              const image = item.image || item.media

              return (
                <CarouselItem key={`${item.id ?? index}-${index}`} className={basisClass}>
                  <div className="p-1">
                    <article className="overflow-hidden rounded-xl border border-border/60 bg-muted/40 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                      {/* image */}
                      <div className={`relative w-full ${aspectClass} overflow-hidden`}>
                        {image && typeof image === 'object' ? (
                          <Media
                            resource={image}
                            fill
                            priority={index < safeVisible}
                            alt={
                              item.alt ||
                              (typeof image === 'object' ? image.alt : '') ||
                              item.caption ||
                              `Carousel image ${index + 1}`
                            }
                            className="h-full w-full"
                            imgClassName="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-muted p-6 text-center">
                            <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-background shadow-sm">
                              <ImageIcon className="size-7 text-primary" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                              {item.caption || `Image ${index + 1}`}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Upload an image in the CMS
                            </p>
                          </div>
                        )}

                        {/* caption overlay */}
                        {showCaptions && item.caption && image && typeof image === 'object' && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pt-12">
                            <p className="text-sm font-medium text-white drop-shadow-md">
                              {item.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          {/* ── CONTROLS ────────────────────────────────────────────── */}

          {showControls && (
            <div className="mt-4 flex items-center justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>

              {viewAllHref && (
                <Button asChild size="sm" variant="outline" className="sm:hidden">
                  <a href={viewAllHref} target="_blank" rel="noopener noreferrer">
                    {viewAllLabel}
                  </a>
                </Button>
              )}
            </div>
          )}
        </Carousel>
      </div>
    </section>
  )
}

export default CarouselBlock
