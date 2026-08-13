import React from 'react'

import { CardServiceData, ServiceCard } from '@/components/ServiceCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Title from '../Title'

export type Props = {
  title?: string
  subTitle?: string
  description?: string
  services?: CardServiceData[]
  relationTo?: 'services'
}

export const ServiceCollectionArchive: React.FC<Props> = (props) => {
  const { title, subTitle, description, services, relationTo = 'services' } = props

  return (
    <section className="mx-auto max-w-7xl py-16 md:py-20">
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {services?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return <ServiceCard key={index} doc={result} relationTo={relationTo} />
          }
          return null
        })}
      </div>
    </section>
  )
}
