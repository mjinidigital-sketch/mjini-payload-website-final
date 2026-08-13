'use client'

import React from 'react'
import { Box, CircleCheck, Gem, Shield, Star, Users, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Title from '@/components/Title'

interface PricingDoc {
  id: string
  adminLabel?: string | null
  planType?: 'basic' | 'standard' | 'premium' | 'gold' | 'enterprise' | null
  price?: number | null
  currency?: 'KES' | 'USD' | null
  priceType?: 'flat' | 'monthly' | 'recurring' | null
  isPopular?: boolean | null
  features?: { feature?: string | null; id?: string | null }[] | null
}

interface PricingBlockProps {
  blockType: 'pricingBlock'
  title?: string | null
  subTitle?: string | null
  description?: string | null
  service?:
    | {
        id?: string | null
        title?: string | null
        name?: string | null
      }
    | string
    | null
  plans?: PricingDoc[] | null
}

type PlanItem = {
  id: string
  name: string
  description: string
  price: number
  currency: 'KES' | 'USD'
  priceType: 'flat' | 'monthly' | 'recurring'
  isRecommended: boolean
  icon: string
  buttonLabel: string
  features: { feature: string; id?: string | null }[]
}

const iconMap: Record<string, LucideIcon> = {
  box: Box,
  gem: Gem,
  users: Users,
  star: Star,
  zap: Zap,
  shield: Shield,
}

const planTypeIconMap: Record<string, string> = {
  basic: 'box',
  standard: 'shield',
  premium: 'star',
  gold: 'gem',
  enterprise: 'users',
}

const planTypeRank: Record<string, number> = {
  basic: 0,
  standard: 1,
  premium: 2,
  gold: 3,
  enterprise: 4,
}

const priceTypeSuffix: Record<PlanItem['priceType'], string> = {
  flat: 'One-time payment',
  monthly: 'Billed monthly',
  recurring: 'Billed annually',
}

const currencyPrefix: Record<PlanItem['currency'], string> = {
  KES: 'Ksh',
  USD: '$',
}

const PlanCard = ({ plan }: { plan: PlanItem }) => {
  const PlanIcon = iconMap[plan.icon] ?? Box

  return (
    <article
      className={[
        'group relative flex h-full flex-col rounded-xl border bg-background p-5 transition-all duration-300 sm:p-6',
        plan.isRecommended
          ? 'border-primary/50 shadow-lg shadow-primary/10'
          : 'border-border/70 shadow-sm hover:-translate-y-1 hover:border-primary/20 hover:shadow-md',
      ].join(' ')}
    >
      {/* Popular Badge */}
      {plan.isRecommended && (
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
          <Badge className="rounded-full px-3 py-1 text-[10px] font-semibold tracking-wide">
            Most Popular
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className={[
            'flex h-10 w-10 items-center justify-center rounded-lg border transition-colors duration-300',
            plan.isRecommended
              ? 'border-primary/20 bg-primary/10 text-primary'
              : 'border-border bg-muted/40 text-muted-foreground group-hover:border-primary/20 group-hover:text-primary',
          ].join(' ')}
        >
          <PlanIcon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </div>

        {plan.isRecommended && (
          <Star className="h-4 w-4 fill-primary text-primary" strokeWidth={1.5} />
        )}
      </div>

      {/* Plan Information */}
      <div className="mt-5">
        <h3 className="text-lg font-semibold capitalize tracking-tight text-foreground">
          {plan.name}
        </h3>

        {plan.description && (
          <p className="mt-1.5 line-clamp-2 min-h-[40px] text-xs leading-5 text-muted-foreground">
            {plan.description}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="mt-5 border-y border-border/60 py-4">
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {currencyPrefix[plan.currency]}
          </span>

          <span className="text-3xl font-bold tracking-tight text-foreground">
            {plan.price.toLocaleString(plan.currency === 'KES' ? 'en-KE' : 'en-US')}
          </span>
        </div>

        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {priceTypeSuffix[plan.priceType]}
        </p>
      </div>

      {/* CTA */}
      <Button
        size="sm"
        className="mt-5 h-10 w-full rounded-lg text-sm font-semibold"
        variant={plan.isRecommended ? 'default' : 'outline'}
      >
        {plan.buttonLabel}
      </Button>

      {/* Features */}
      {plan.features.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
            Included
          </p>

          <ul className="space-y-2.5">
            {plan.features.map((feature, index) => (
              <li
                key={feature.id ?? `${feature.feature}-${index}`}
                className="flex items-start gap-2.5 text-xs leading-5 text-muted-foreground"
              >
                <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} />

                <span>{feature.feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

export const PricingBlockComponent: React.FC<PricingBlockProps> = ({
  title,
  subTitle,
  description,
  service,
  plans,
}) => {
  const docs = plans ?? []

  if (docs.length === 0) return null

  const serviceName = typeof service === 'object' && service ? service.title || service.name : null

  const normalizedPlans: PlanItem[] = docs
    .filter((doc) => doc?.adminLabel?.trim() || doc?.planType)
    .map((doc, index) => {
      const planType = doc.planType ?? 'standard'

      return {
        id: doc.id ?? `plan-${index}`,
        name: planType,
        description: doc.adminLabel?.trim() || '',
        price: doc.price ?? 0,
        currency: doc.currency ?? 'KES',
        priceType: doc.priceType ?? 'flat',
        isRecommended: doc.isPopular ?? false,
        icon: planTypeIconMap[planType] ?? 'box',
        buttonLabel: 'Get Started',
        features: (doc.features ?? [])
          .filter((feature) => feature?.feature?.trim())
          .map((feature) => ({
            feature: feature.feature!.trim(),
            id: feature.id,
          })),
      }
    })
    .sort((a, b) => {
      if (a.price !== b.price) {
        return a.price - b.price
      }

      return (planTypeRank[a.name] ?? 0) - (planTypeRank[b.name] ?? 0)
    })

  if (normalizedPlans.length === 0) return null

  return (
    <section className="border-b relative overflow-hidden py-14 sm:py-16 lg:py-24 bg-muted">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Service */}
        {serviceName && (
          <div className="mb-3 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {serviceName}
            </span>
          </div>
        )}

        {/* Section Heading */}
        <Title
          title={title || ''}
          subTitle={subTitle || ''}
          description={description || ''}
          className="mx-auto mb-12 max-w-3xl"
        />

        <div className="my-16">
          <hr className="border-border/70" />
        </div>

        {/* Pricing Grid */}
        <div
          className={[
            'mx-auto grid max-w-6xl items-stretch gap-4',
            normalizedPlans.length === 1
              ? 'max-w-sm'
              : normalizedPlans.length === 2
                ? 'max-w-3xl sm:grid-cols-2'
                : 'sm:grid-cols-2 lg:grid-cols-3',
          ].join(' ')}
        >
          {normalizedPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingBlockComponent
