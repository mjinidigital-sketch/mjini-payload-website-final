import React from 'react'

import type { Page } from '@/payload-types'

import dynamic from 'next/dynamic'

const heroes = {
  highImpact: dynamic(() => import('@/heros/HighImpact').then((m) => m.HighImpactHero)),
  lowImpact: dynamic(() => import('@/heros/LowImpact').then((m) => m.LowImpactHero)),
  mediumImpact: dynamic(() => import('@/heros/MediumImpact').then((m) => m.MediumImpactHero)),
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
