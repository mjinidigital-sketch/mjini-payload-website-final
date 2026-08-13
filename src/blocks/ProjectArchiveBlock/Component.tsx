import type { Project, ProjectArchiveBlock } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { ProjectCollectionArchive } from '@/components/ProjectCollectionArchive'
import Title from '@/components/Title'

export const ProjectArchiveBlockComponent: React.FC<ProjectArchiveBlock> = async (props) => {
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

  let projects: Project[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const fetchedProjects = await payload.find({
      collection: relationTo ?? 'projects',
      depth: 1,
      limit,
    })

    projects = fetchedProjects.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedProjects = selectedDocs.map((project: { value: any }) => {
        if (typeof project.value === 'object') return project.value
      }) as Project[]

      projects = filteredSelectedProjects
    }
  }

  return (
    <div id={`block-${id}`} className="container border py-20">
      <div className="max-w-6xl mx-auto md:mt-8">
        <Title
          title={title as string}
          subTitle={subTitle as string}
          description={description as string}
        />
      </div>
      <ProjectCollectionArchive projects={projects} relationTo={'projects'} />
    </div>
  )
}
