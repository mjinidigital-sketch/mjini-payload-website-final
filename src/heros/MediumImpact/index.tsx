'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, CirclePlay } from 'lucide-react'
import { motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const primaryLink = links?.[0]?.link
  const secondaryLink = links?.[1]?.link
  const badgeLink = links?.[2]?.link

  // Professional, smooth easing curve definitions
  const smoothTransition = {
    type: 'tween' as const,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Custom cinematic cubic-bezier easeOut
    duration: 1.2,
  }

  return (
    <section className="relative min-h-screen flex py-16 lg:py-20 items-center justify-center lg:mt-8 border-b overflow-hidden bg-[#870aca]/5">
      {/* Aurora Silk Fade Gradient (Optimized with Brand Colors) */}
      <div
        className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none"
        style={{
          background:
            'linear-gradient(150deg, #870aca 0%, #b39ddb 20%, #FCE4EC 40%, #fffde7 60%, #face1c 80%, #870aca 100%)',
        }}
      />

      {/* Circuit Board - Light Pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(135, 10, 202, 0.05) 19px, rgba(135, 10, 202, 0.05) 20px, transparent 20px, transparent 39px, rgba(135, 10, 202, 0.05) 39px, rgba(135, 10, 202, 0.05) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(135, 10, 202, 0.05) 19px, rgba(135, 10, 202, 0.05) 20px, transparent 20px, transparent 39px, rgba(135, 10, 202, 0.05) 39px, rgba(135, 10, 202, 0.05) 40px),
            radial-gradient(circle at 20px 20px, rgba(135, 10, 202, 0.08) 2px, transparent 2px),
            radial-gradient(circle at 40px 40px, rgba(135, 10, 202, 0.08) 2px, transparent 2px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
        }}
      />

      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#870aca]/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#face1c]/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Content Container */}
      <div className="container mx-auto grid w-full gap-12 lg:grid-cols-2 relative z-10 px-4 md:px-6">
        {/* Left Content - Animates Inward From Left */}
        <motion.div
          className="flex flex-col justify-center mt-6 md:mt-0"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={smoothTransition}
        >
          <Badge
            asChild
            variant="outline"
            className="w-fit rounded-full border border-[#870aca]/30 py-1 px-4 bg-white/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-[#870aca]/60"
          >
            <Link
              href={badgeLink?.url || '#'}
              className="inline-flex items-center text-primary font-medium tracking-wide text-xs "
            >
              {badgeLink?.label || "Kenya's Gold Standard in Website Development"}
              <ArrowUpRight className="ml-1.5 size-4 text-[#870aca]" />
            </Link>
          </Badge>

          {richText && (
            <RichText
              data={richText}
              enableGutter={false}
              className={cn(
                'prose-headings:text-slate-900',
                'lg:prose-h1:text-[3rem]',
                'prose-headings:tracking-[-0.04em]',
                'md:prose-h1:text-5xl',
                'prose-h1:text-4xl',
                'prose-h1:text-balance',
                'prose-h1:tracking-tight',
                'prose-h1:font-bold',
                'prose-h1:leading-[1.2]',
                'prose-h1:mt-6',
                'prose-p:text-slate-600',
                'prose-p:mt-6',
                'prose-p:max-w-xl',
                'prose-p:text-base',
                'prose-p:leading-relaxed',
                'prose-a:text-[#870aca]',
                'prose-a:font-semibold',
              )}
            />
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {primaryLink && (
              <CMSLink
                {...primaryLink}
                size="lg"
                className="text-sm font-semibold inline-flex items-center gap-2 rounded-full bg-[#870aca] text-white shadow-lg shadow-[#870aca]/20 hover:bg-[#870aca]/90 transition-all transform hover:-translate-y-0.5 px-6 py-3"
              >
                <ArrowUpRight className="h-5 w-5 hidden md:block" />
              </CMSLink>
            )}

            {secondaryLink && (
              <CMSLink
                {...secondaryLink}
                size="lg"
                className="text-sm font-semibold inline-flex items-center gap-2 rounded-full border-2 border-[#face1c] bg-white/40 backdrop-blur-sm text-slate-800 hover:bg-[#face1c] hover:text-slate-900 shadow-md transition-all transform hover:-translate-y-0.5 px-6 py-3"
              >
                <ArrowUpRight className="ml-1.5 size-4 text-[#870aca]" />
              </CMSLink>
            )}
          </div>
        </motion.div>

        {/* Right Media - Animates Inward From Right */}
        <motion.div
          className="relative mt-auto lg:my-auto overflow-hidden rounded-3xl border-4 border-[#face1c] bg-white shadow-2xl group transform lg:hover:scale-[1.01] transition-all duration-500"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={smoothTransition}
        >
          {media && typeof media === 'object' ? (
            <>
              <Media
                resource={media}
                priority
                className="w-full"
                imgClassName="
                  h-[300px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                  sm:h-[400px]
                  lg:h-[480px]
                "
              />

              {/* Advanced Contrast & Color Grading Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#870aca]/20 via-transparent to-[#face1c]/10 pointer-events-none" />
              <div className="absolute inset-0 bg-[#870aca]/5 mix-blend-overlay pointer-events-none" />
            </>
          ) : (
            <div className="h-[300px] w-full bg-[#face1c]/20 sm:h-[400px] lg:h-[480px]" />
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default MediumImpactHero
