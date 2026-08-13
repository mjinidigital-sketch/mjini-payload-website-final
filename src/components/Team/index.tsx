import type { Media as MediaType, Team as TeamType } from '@/payload-types'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'
import {
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa6'

import { Media } from '@/components/Media'
import Title from '@/components/Title'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface TeamComponentProps {
  badge?: string
  title?: string
  subTitle?: string
  description?: string
  showCta?: boolean
  primaryCtaText?: string
  primaryCtaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  limit?: number
  members?: TeamType[]
}

const getFaIcon = (platform?: string | null) => {
  switch (platform?.toLowerCase()) {
    case 'twitter':
      return FaTwitter
    case 'linkedin':
      return FaLinkedin
    case 'instagram':
      return FaInstagram
    case 'github':
      return FaGithub
    case 'facebook':
      return FaFacebook
    case 'youtube':
      return FaYoutube
    case 'twitch':
      return FaTwitch
    case 'tiktok':
      return FaTiktok
    default:
      return FaGlobe
  }
}

export const Team: React.FC<TeamComponentProps> = async (props) => {
  const {
    badge = "We're hiring!",
    title = 'Our Team',
    subTitle = 'The Team Behind Mjini Digital',
    description = 'Meet the passionate individuals behind Mjini Digital. Dedicated to innovation, excellence, and creating exceptional digital experiences.',
    showCta = true,
    primaryCtaText = 'Open Positions',
    primaryCtaLink = '/careers',
    secondaryCtaText = 'About Us',
    secondaryCtaLink = '/about',
    limit,
    members: passedMembers,
  } = props

  let teamMembers: TeamType[] = passedMembers || []

  if (!passedMembers || passedMembers.length === 0) {
    try {
      const payload = await getPayload({ config: configPromise })
      const fetchedTeam = await payload.find({
        collection: 'team',
        depth: 1,
        limit: limit || 100,
        sort: 'createdAt',
      })
      teamMembers = fetchedTeam.docs
    } catch (error) {
      console.error('Error fetching Team collection:', error)
    }
  }

  // If there are absolutely no members in the database, return nothing
  if (teamMembers.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto flex  flex-col justify-center gap-16 py-20 ">
      <div className="mx-auto max-w-2xl text-center">
        {badge && (
          <b className="text-center font-medium text-muted-foreground text-sm uppercase tracking-wider">
            {badge}
          </b>
        )}
        <Title title={title} subTitle={subTitle} description={description} />

        {showCta && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-center rounded-b-full">
            {primaryCtaText && (
              <Button size="lg" asChild className="rounded-full">
                <Link href={primaryCtaLink}>{primaryCtaText}</Link>
              </Button>
            )}
            {secondaryCtaText && (
              <Button size="lg" variant="outline" asChild className="rounded-full">
                <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid w-full grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-4">
        {teamMembers.map((member, index) => {
          const profilePicture = member.profilePicture
          const isMediaObject =
            profilePicture && typeof profilePicture === 'object' && 'url' in profilePicture

          const memberSkills = Array.from(
            new Set(member.skills?.filter((s): s is string => Boolean(s && s.trim()))),
          )

          return (
            <div
              key={member.id || member.name || index}
              className="flex flex-col group rounded-xl border border-border/40 bg-card/50 p-4 transition-all duration-300 hover:border-border hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-secondary">
                {isMediaObject ? (
                  <Media
                    resource={profilePicture as MediaType}
                    className="h-full w-full object-cover"
                    imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-sm">
                    No Image
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-foreground tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium">{member.title}</p>

                  {memberSkills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {memberSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-[11px] font-normal px-2 py-0.5"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {member.socialMediaLinks && member.socialMediaLinks.length > 0 && (
                  <div className="mt-5 flex items-center flex-wrap gap-2 pt-3 border-t border-border/40">
                    {member.socialMediaLinks.map((social, idx) => {
                      if (!social.url) return null
                      const Icon = getFaIcon(social.platform)
                      return (
                        <Link
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                          aria-label={`${member.name}'s ${social.platform || 'Social'}`}
                        >
                          <Icon className="h-4 w-4" />
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
