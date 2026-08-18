import type { Media, Project } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { PartnersSlider } from '@/components/PartnersInfiniteSlider'
import Title from '@/components/Title'

interface PartnersBlockProps {
  id?: string
  partners?: Array<number | { id: number }>
  title?: string
  subtitle?: string
  description?: string
  speed?: number
  direction?: 'left' | 'right'
}

export const PartnersBlock: React.FC<PartnersBlockProps> = async (props) => {
  const { id, partners: partnerRelations, title, subtitle, description, speed, direction } = props

  let partners: Array<{
    id: string
    name: string
    logo: {
      url: string
      alt?: string
    }
    website: string
  }> = []

  if (partnerRelations && partnerRelations.length > 0) {
    const payload = await getPayload({ config: configPromise })

    const partnerIds = partnerRelations
      .map((partner) => {
        if (typeof partner === 'object' && partner !== null) return partner.id
        else return partner
      })
      .filter(Boolean)

    if (partnerIds.length > 0) {
      // depth: 2 ensures projectPartners resolves to the full Project doc
      const fetchedPartners = await payload.find({
        collection: 'partners',
        depth: 2,
        where: {
          id: {
            in: partnerIds,
          },
        },
      })

      partners = (fetchedPartners.docs || []).map((partner: any, index: number) => {
        const project = partner?.projectPartners as Project | number | undefined

        // Fall back gracefully in case depth didn't resolve or the relation is empty
        const companyName =
          project && typeof project === 'object' && project !== null
            ? project.companyName || project.title
            : ''

        return {
          id: partner?.id ? partner.id.toString() : `partner-${index}`,
          name: companyName || '',
          logo: {
            url: (partner?.logo as Media)?.url || '',
            alt: (partner?.logo as Media)?.alt || companyName || '',
          },
          website: partner?.website || '',
        }
      })
    }
  }

  return (
    <div className="container w-full py-12 md:py-20 lg:py-24 bg-[#f8f5ed]" id={`block-${id}`}>
      <Title title={title || ''} subTitle={subtitle || ''} description={description || ''} />
      <PartnersSlider partners={partners} speed={speed} direction={direction} />
    </div>
  )
}
