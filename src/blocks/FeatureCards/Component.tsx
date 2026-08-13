'use client'

import React from 'react'
import {
  Cable,
  Code,
  Contrast,
  MonitorSmartphone,
  SquareDashedMousePointer,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Title from '@/components/Title'

interface FeatureCardsProps {
  blockType: 'featureCards'
  heading?: string | null
  subheading?: string | null
  features?:
    | {
        title?: string | null
        description?: string | null
        icon?: string | null
        id?: string | null
      }[]
    | null
}

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  squareDashedMousePointer: SquareDashedMousePointer,
  code: Code,
  monitorSmartphone: MonitorSmartphone,
  contrast: Contrast,
  cable: Cable,
}

export const FeatureCardsComponent: React.FC<FeatureCardsProps> = (props) => {
  const { heading, subheading, features: cmsFeatures } = props

  const features =
    Array.isArray(cmsFeatures) && cmsFeatures.length > 0
      ? cmsFeatures.map((feature) => ({
          title: feature.title ?? '',
          description: feature.description ?? '',
          icon: feature.icon ?? 'zap',
        }))
      : []

  if (!features.length) return null

  return (
    <section className="bg-primary/5 relative overflow-hidden py-16 md:py-20 lg:py-24">
      <div className="container px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-5xl text-center md:mb-16">
          <Title title={heading || ''} subTitle={subheading || ''} className="mx-auto" />
        </div>

        {/* Feature Grid */}
        <div
          className={`grid gap-px overflow-hidden rounded-2xl border border-border bg-border ${
            features.length === 1
              ? 'grid-cols-1'
              : features.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : features.length === 3
                  ? 'grid-cols-1 md:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] ?? Zap

            return (
              <article
                key={`${feature.title}-${index}`}
                className="group relative bg-background p-7 transition-colors duration-300 hover:bg-muted/40 md:p-8 lg:p-10"
              >
                {/* Number */}
                <span className="absolute right-6 top-6 text-xs font-medium tracking-widest text-muted-foreground/40">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon
                    size={21}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:scale-110 text-primary"
                  />
                </div>

                {/* Content */}
                <div className="max-w-sm">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeatureCardsComponent
