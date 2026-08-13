import { Team } from '@/components/Team'
import type { Team as TeamType, TeamBlock as TeamBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const TeamBlockComponent: React.FC<TeamBlockProps> = async (props) => {
  const {
    badge,
    heading,
    subheading,
    description,
    populateBy = 'collection',
    selectedMembers: rawSelectedMembers,
    limit,
  } = props

  let teamMembersToPass: TeamType[] | undefined = undefined

  if (
    populateBy === 'selection' &&
    Array.isArray(rawSelectedMembers) &&
    rawSelectedMembers.length > 0
  ) {
    const memberIds = rawSelectedMembers
      .map((m) => (typeof m === 'object' && m !== null ? m.id : m))
      .filter(Boolean)

    if (memberIds.length > 0) {
      try {
        const payload = await getPayload({ config: configPromise })
        const fetched = await payload.find({
          collection: 'team',
          depth: 1,
          where: {
            id: {
              in: memberIds,
            },
          },
          // Pull plenty of records to ensure we do not cut off before ordering
          limit: 1000,
        })

        // FIXED: Sorts database values back into the exact order chosen by the user in the admin UI
        teamMembersToPass = memberIds
          .map((id) => fetched.docs.find((doc) => doc.id === id))
          .filter((doc): doc is TeamType => Boolean(doc))
      } catch (error) {
        console.error('Error fetching selected team members for TeamBlockComponent:', error)
      }
    }
  }

  return (
    <Team
      badge={badge ?? "We're hiring!"}
      title={heading || 'Our Team'}
      subTitle={subheading || 'The Team Behind Mjini Digital'}
      description={
        description ||
        'Meet the passionate individuals behind Mjini Digital. Dedicated to innovation, excellence, and creating exceptional digital experiences.'
      }
      limit={limit ?? undefined}
      members={teamMembersToPass}
    />
  )
}

export default TeamBlockComponent
