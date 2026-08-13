'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const HighImpactHero: React.FC<Page['hero']> = ({ slides }) => {
  const [index, setIndex] = useState(0)

  // Slide text auto-rotation
  useEffect(() => {
    if (!slides?.length) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 10000)
    return () => clearInterval(id)
  }, [slides])

  if (!slides?.length) return null

  const slide = slides[index]
  const primaryLink = slide.links?.[0]?.link
  const secondaryLink = slide.links?.[1]?.link

  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const textVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  }

  return (
    <section className="overflow-hidden border-b ">
      <div className=" mt-20 md:mt-0" />

      <div className="container py-12   border-b z-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 1.0, ease: 'easeInOut' }}
            className="grid gap-8 lg:grid-cols-2 items-center h-full"
          >
            {/* ================= TEXT ================= */}
            <motion.div
              variants={textVariants}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="items-center  md:mr-8 mb-8 md:mb-0"
            >
              <Link
                href="#link"
                className="bg-secondary/25 text-secondary mb-8 bg-muted flex w-fit items-center gap-4 rounded-full border p-1 md:pl-4 shadow-md"
              >
                <span className="text-xs text-foreground/70">
                  Web Design, Web Development &amp; SEO Services
                </span>
                <div className="bg-background size-6 rounded-full mx-auto">
                  <ArrowRight className="mx-auto mt-1.5 size-3" />
                </div>
              </Link>

              {slide.richText && (
                <RichText
                  data={slide.richText}
                  enableGutter={false}
                  className={cn(
                    'max-w-none',
                    'prose-h1:font-bold prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:leading-tight prose-h1:mb-0',
                    'prose-h2:font-normal prose-h2:text-base md:prose-h2:text-xl prose-h2:text-primary prose-h2:mt-4',
                    'prose-p:max-w-xl prose-p:text-muted-foreground prose-p:text-sm md:prose-p:text-base',
                  )}
                />
              )}

              {(primaryLink || secondaryLink) && (
                <motion.div
                  variants={textVariants}
                  transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                  className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                  {primaryLink && (
                    <CMSLink
                      appearance="accent"
                      size="lg"
                      {...primaryLink}
                      className="inline-flex items-center gap-2 rounded-lg font-semibold"
                    >
                      <ArrowRight size={20} />
                    </CMSLink>
                  )}

                  {secondaryLink && (
                    <CMSLink
                      appearance="outline-accent"
                      size="lg"
                      {...secondaryLink}
                      className="inline-flex items-center gap-2 rounded-lg font-semibold"
                    >
                      <Phone size={20} />
                    </CMSLink>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* ================= IMAGE CAROUSEL ================= */}
            <ImageCarousel slides={slides} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Overlapping stacked-cards carousel (independent state from slide text)
// ---------------------------------------------------------------------------
type CarouselProps = {
  slides: NonNullable<Page['hero']['slides']>
}

const ImageCarousel: React.FC<CarouselProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [slides.length])

  const previous = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

  const next = () => setCurrent((prev) => (prev + 1) % slides.length)

  return (
    <div className="relative flex items-center justify-center">
      {/* Decorative blur blob */}
      <div className="absolute rounded-full bg-primary/5 blur-xl" />

      {/* Overlapping Cards */}
      <div className="relative h-[560px] w-full max-w-xl">
        {slides.map((slideItem, i) => {
          const media = slideItem.desktop ?? slideItem.mobile
          const offset = (i - current + slides.length) % slides.length

          let styles = ''
          switch (offset) {
            case 0:
              styles = 'translate-x-0 scale-100 rotate-0 opacity-100 z-30'
              break
            case 1:
              styles = 'translate-x-32 scale-90 rotate-6 opacity-60 z-20'
              break
            case 2:
              styles = 'translate-x-52 scale-80 rotate-12 opacity-20 z-10'
              break
            case 3:
              styles = '-translate-x-32 scale-90 -rotate-6 opacity-60 z-20'
              break
            default:
              styles = 'hidden'
          }

          return (
            <div
              key={i}
              className={`absolute left-[2%] md:left-[10%] top-[40%] md:top-1/2 h-[500px] w-[350px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border bg-white shadow-2xl transition-all duration-700 ease-in-out ${styles}`}
            >
              {media && (
                <Media
                  resource={media}
                  fill
                  priority={i === current}
                  size="(max-width: 768px) 100vw, 340px"
                  imgClassName="object-cover"
                />
              )}
              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          )
        })}
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={previous}
        aria-label="Previous image"
        className="absolute left-0 z-40 rounded-full bg-background/80 p-2 shadow-md hover:bg-background transition"
      >
        <ArrowRight className="rotate-180 size-4" />
      </button>
      <button
        onClick={next}
        aria-label="Next image"
        className="absolute right-0 z-40 rounded-full bg-background/80 p-2 shadow-md hover:bg-background transition"
      >
        <ArrowRight className="size-4" />
      </button>
    </div>
  )
}
