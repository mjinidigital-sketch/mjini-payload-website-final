import React from 'react'

import { CardProjectData, ProjectCard } from '@/components/ProjectCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Title from '../Title'

export type Props = {
  title?: string
  subTitle?: string
  description?: string
  projects?: CardProjectData[]
  relationTo?: 'projects'
}

export const ProjectCollectionArchive: React.FC<Props> = (props) => {
  const { title, description, projects, relationTo = 'projects' } = props

  return (
    <section className="mx-auto max-w-7xl py-16 md:py-20">
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return <ProjectCard key={index} doc={result} relationTo={relationTo} />
          }
          return null
        })}
      </div>
    </section>
  )
}
