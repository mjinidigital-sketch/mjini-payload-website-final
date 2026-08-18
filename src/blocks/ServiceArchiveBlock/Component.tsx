import type { Service, ServiceArchiveBlock } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { ServiceCollectionArchive } from '@/components/ServiceCollectionArchive'
import Title from '@/components/Title'

export const ServiceArchiveBlockComponent: React.FC<ServiceArchiveBlock> = async (props) => {
  const {
    id,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    relationTo,
    title,
    subTitle,
    description,
  } = props

  const limit = limitFromProps || 3

  let services: Service[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const fetchedServices = await payload.find({
      collection: relationTo ?? 'services',
      depth: 1,
      limit,
    })

    services = fetchedServices.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedServices = selectedDocs
        .map((service: any) => {
          if (typeof service === 'object' && service !== null) {
            return service.value && typeof service.value === 'object' ? service.value : service
          }
          return null
        })
        .filter((doc): doc is Service => Boolean(doc && typeof doc === 'object' && doc.id))

      services = filteredSelectedServices
    }
  }

  return (
    <div id={`block-${id}`} className="container border py-20 bg-accent/5">
      <div className="max-w-6xl mx-auto md:mt-8">
        <Title
          title={title as string}
          subTitle={subTitle as string}
          description={description as string}
        />
      </div>
      <ServiceCollectionArchive services={services} relationTo={'services'} />
    </div>
  )
}
