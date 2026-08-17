'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import type { Media as MediaType } from '@/payload-types'
import { ChevronLeft, ChevronRight, Pause, Play, ImageIcon } from 'lucide-react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Media } from '@/components/Media'

export interface CarouselImageItem {
  id?: string | null
  image?: MediaType | number | string | null
  media?: MediaType | number | string | null // fallback
  caption?: string | null
  alt?: string | null
}

export interface CarouselBlockProps {
  id?: string
  title?: string | null
  subTitle?: string | null
  images?: CarouselImageItem[] | null
  slides?: CarouselImageItem[] | null // fallback
  media?: MediaType | number | string | null // fallback
  autoplay?: boolean | null
  autoplayInterval?: number | null
  showThumbnails?: boolean | null
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9' | string | null
  disableInnerContainer?: boolean
}

export const CarouselBlock: React.FC<CarouselBlockProps> = (props) => {
  const {
    id,
    title,
    subTitle,
    images: rawImages,
    slides: rawSlides,
    media: rawMedia,
    autoplay = true,
    autoplayInterval = 4000,
    showThumbnails = true,
    aspectRatio = '16/9',
  } = props

  // Normalize images list (supports images array, slides array, or legacy single media)
  const items: CarouselImageItem[] = React.useMemo(() => {
    const list: CarouselImageItem[] = []

    if (rawImages && Array.isArray(rawImages) && rawImages.length > 0) {
      rawImages.forEach((img) => {
        if (img?.image || img?.media) {
          list.push({
            id: img.id,
            image: img.image || img.media,
            caption: img.caption,
            alt: img.alt,
          })
        }
      })
    } else if (rawSlides && Array.isArray(rawSlides) && rawSlides.length > 0) {
      rawSlides.forEach((slide) => {
        if (slide?.image || slide?.media) {
          list.push({
            id: slide.id,
            image: slide.image || slide.media,
            caption: slide.caption,
            alt: slide.alt,
          })
        }
      })
    } else if (rawMedia) {
      list.push({
        image: rawMedia,
        caption: title || '',
      })
    }

    // Default placeholders if no images uploaded yet
    if (list.length === 0) {
      return [
        { id: '1', caption: 'Showcase Slide 1' },
        { id: '2', caption: 'Showcase Slide 2' },
        { id: '3', caption: 'Showcase Slide 3' },
      ]
    }

    return list
  }, [rawImages, rawSlides, rawMedia, title])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<number>(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isManualPause, setIsManualPause] = useState(false)
  const [progressKey, setProgressKey] = useState(0)

  // Touch gesture handling
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const total = items.length

  const paginate = useCallback(
    (newDirection: number) => {
      if (total <= 1) return
      setDirection(newDirection)
      setCurrentIndex((prev) => {
        if (newDirection > 0) {
          return (prev + 1) % total
        }
        return (prev - 1 + total) % total
      })
      setProgressKey((prev) => prev + 1)
    },
    [total],
  )

  const goToIndex = useCallback(
    (index: number) => {
      if (index === currentIndex || total <= 1) return
      setDirection(index > currentIndex ? 1 : -1)
      setCurrentIndex(index)
      setProgressKey((prev) => prev + 1)
    },
    [currentIndex, total],
  )

  // Autoplay effect
  useEffect(() => {
    if (!autoplay || isPaused || isManualPause || total <= 1) return

    const duration = Math.max(2000, autoplayInterval || 4000)
    const interval = setInterval(() => {
      paginate(1)
    }, duration)

    return () => clearInterval(interval)
  }, [autoplay, isPaused, isManualPause, total, autoplayInterval, paginate])

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeThumb = thumbnailContainerRef.current.children[currentIndex] as HTMLElement
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }, [currentIndex])

  // Touch listeners
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    const threshold = 40

    if (diff > threshold) {
      paginate(1)
    } else if (diff < -threshold) {
      paginate(-1)
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      paginate(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      paginate(1)
    }
  }

  // Map aspect ratio string to CSS classes
  const aspectClass = React.useMemo(() => {
    switch (aspectRatio) {
      case '4/3':
        return 'aspect-[4/3]'
      case '1/1':
        return 'aspect-square'
      case '21/9':
        return 'aspect-[21/9]'
      case '16/9':
      default:
        return 'aspect-[16/9]'
    }
  }, [aspectRatio])

  // Animation variants
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 30 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 30 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    }),
  }

  const currentItem = items[currentIndex] || items[0]

  return (
    <section className="w-full py-8 md:py-14" id={id ? `block-${id}` : undefined}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Optional Title / Header */}
        {(title || subTitle) && (
          <div className="mb-6 md:mb-8 text-center">
            {title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {subTitle && (
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                {subTitle}
              </p>
            )}
          </div>
        )}

        {/* Carousel Wrapper */}
        <div
          className="group relative flex flex-col focus:outline-none select-none"
          tabIndex={0}
          role="region"
          aria-label="Image Carousel"
          aria-roledescription="carousel"
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Slide Card */}
          <div
            className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-muted/40 shadow-xl transition-all`}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 h-full w-full"
              >
                {currentItem?.image && typeof currentItem.image === 'object' ? (
                  <div className="relative h-full w-full overflow-hidden">
                    <Media
                      resource={currentItem.image}
                      alt={currentItem.alt || (typeof currentItem.image === 'object' ? currentItem.image.alt : '') || currentItem.caption || `Image ${currentIndex + 1}`}
                      fill
                      className="h-full w-full"
                      imgClassName="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                ) : (
                  // Elegant Placeholder
                  <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-muted via-accent/20 to-muted/80 p-8 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-background/80 shadow-md backdrop-blur-md mb-3 text-muted-foreground">
                      <ImageIcon className="size-8 text-primary" />
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-foreground">
                      {currentItem.caption || `Picture ${currentIndex + 1}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload images in the CMS to display here
                    </p>
                  </div>
                )}

                {/* Caption Banner (if caption exists) */}
                {currentItem?.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 text-white">
                    <p className="text-sm sm:text-base font-medium drop-shadow-md line-clamp-2 max-w-2xl">
                      {currentItem.caption}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Top Bar: Counter & Autoplay Controls */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 font-mono text-xs font-medium text-white shadow-sm backdrop-blur-md">
                <span>
                  {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </div>

              {autoplay && total > 1 && (
                <button
                  type="button"
                  onClick={() => setIsManualPause((prev) => !prev)}
                  className="flex size-7 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white shadow-sm backdrop-blur-md transition-all hover:bg-black/70 hover:scale-105 active:scale-95"
                  aria-label={isManualPause ? 'Resume autoplay' : 'Pause autoplay'}
                  title={isManualPause ? 'Resume autoplay' : 'Pause autoplay'}
                >
                  {isManualPause ? <Play className="size-3" /> : <Pause className="size-3" />}
                </button>
              )}
            </div>

            {/* Navigation Arrows (Only when > 1 item) */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => paginate(-1)}
                  className="absolute top-1/2 left-3 sm:left-4 -translate-y-1/2 z-20 flex size-9 sm:size-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-black/70 hover:scale-110 active:scale-95 sm:opacity-90 sm:group-hover:opacity-100"
                  aria-label="Previous picture"
                >
                  <ChevronLeft className="size-5 sm:size-6" />
                </button>

                <button
                  type="button"
                  onClick={() => paginate(1)}
                  className="absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 z-20 flex size-9 sm:size-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-black/70 hover:scale-110 active:scale-95 sm:opacity-90 sm:group-hover:opacity-100"
                  aria-label="Next picture"
                >
                  <ChevronRight className="size-5 sm:size-6" />
                </button>
              </>
            )}

            {/* Bottom Progress Bar */}
            {autoplay && total > 1 && !isPaused && !isManualPause && (
              <div className="absolute inset-x-0 bottom-0 z-30 h-1 bg-white/20">
                <motion.div
                  key={progressKey}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: (autoplayInterval || 4000) / 1000, ease: 'linear' }}
                  className="h-full bg-primary"
                />
              </div>
            )}
          </div>

          {/* Dots Indicator */}
          {total > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 bg-primary shadow-sm'
                      : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={idx === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          )}

          {/* Thumbnail Strip (If enabled and > 1 picture) */}
          {showThumbnails && total > 1 && (
            <div
              ref={thumbnailContainerRef}
              className="mt-4 flex items-center justify-center gap-2.5 overflow-x-auto py-2 px-1 scrollbar-none"
            >
              {items.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  className={`relative flex-shrink-0 h-14 w-20 sm:h-16 sm:w-24 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                    idx === currentIndex
                      ? 'border-primary ring-2 ring-primary/30 scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Go to picture ${idx + 1}`}
                >
                  {item?.image && typeof item.image === 'object' ? (
                    <Media
                      resource={item.image}
                      fill
                      className="h-full w-full"
                      imgClassName="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-mono font-medium text-muted-foreground">
                      {idx + 1}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CarouselBlock
