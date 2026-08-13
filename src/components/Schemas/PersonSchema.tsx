import type { Media, Team } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

export interface PersonProps {
  id?: string | number
  slug?: string
  name?: string
  jobTitle?: string
  description?: string
  imageUrl?: string
  skills?: string[]
  colleagueIds?: string[] // Slugs of other team members
  email?: string
  phone?: string
  socialLinks?: string[]
  teamMember?: Team | null
}

/**
 * Builds a Schema.org compliant Person JSON-LD object.
 * Accepts a Payload Team document or manual PersonProps.
 */
export const personSchema = (props: PersonProps | Team) => {
  const baseUrl = getServerSideURL() || 'https://mjinidigital.co.ke'
  const organizationId = `${baseUrl}/#organization`

  // Normalize input: check if props is a raw Team document or PersonProps container
  const isTeamDoc = typeof props === 'object' && props !== null && 'title' in props && 'skills' in props
  const member: Team | null = isTeamDoc
    ? (props as Team)
    : (props as PersonProps).teamMember || null
  const customProps: PersonProps = isTeamDoc ? {} : (props as PersonProps)

  const name = customProps.name || member?.name || 'Mjini Digital Specialist'
  const rawTitle = customProps.jobTitle || member?.title || 'Digital Strategist'
  const email = customProps.email || member?.email || undefined
  const phone = customProps.phone || member?.phone || undefined

  // Generate slug / identifier
  const rawSlug =
    customProps.slug ||
    (member?.name
      ? member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : null) ||
    String(customProps.id || member?.id || 'specialist')

  const profileUrl = `${baseUrl}/about/team/${rawSlug}`

  // Profile image URL extraction
  let imageUrl = customProps.imageUrl
  if (!imageUrl && member?.profilePicture) {
    if (typeof member.profilePicture === 'object' && member.profilePicture !== null) {
      const media = member.profilePicture as Media
      if (media.url) {
        imageUrl = media.url.startsWith('http') ? media.url : `${baseUrl}${media.url}`
      } else if (media.filename && process.env.S3_ENDPOINT && process.env.S3_BUCKET) {
        imageUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${media.filename}`
      }
    }
  }
  if (!imageUrl) {
    imageUrl = `${baseUrl}/images/team/${rawSlug}.jpg`
  }

  // Skills & expertise
  let skillsList = customProps.skills
  if (!skillsList || skillsList.length === 0) {
    if (Array.isArray(member?.skills) && member.skills.length > 0) {
      skillsList = member.skills.filter(Boolean)
    }
  }
  if (!skillsList || skillsList.length === 0) {
    skillsList = [
      'Conversion Rate Optimization',
      'Responsive Web Design',
      'Technical SEO Audits',
      'Frontend Development',
      'User Experience Design',
      'Digital Marketing Strategy',
    ]
  }

  // Social Links
  let socialLinks = customProps.socialLinks || []
  if (Array.isArray(member?.socialMediaLinks)) {
    const cmsSocials = member.socialMediaLinks
      .map((s) => s?.url)
      .filter((u): u is string => Boolean(u && u.trim()))
    socialLinks = Array.from(new Set([...socialLinks, ...cmsSocials]))
  }

  // Description
  const description =
    customProps.description ||
    `${name} serves as ${rawTitle} at Mjini Digital, driving digital strategy, user experience design, and technical web engineering in Nairobi, Kenya.`

  // Colleagues graph
  const colleagueIds = customProps.colleagueIds || []
  const colleagueGraph = colleagueIds.map((cSlug) => ({
    '@id': `${baseUrl}/about/team/${cSlug}#person`,
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${profileUrl}#person`,
    identifier: rawSlug,
    name,
    jobTitle: rawTitle,
    description,
    url: profileUrl,
    ...(email ? { email } : {}),
    ...(phone ? { telephone: phone } : {}),

    // Explicit image asset validation
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      contentUrl: imageUrl,
      caption: `${name}, ${rawTitle} at Mjini Digital Nairobi`,
    },

    // Links profile page natively back to its canonical container
    mainEntityOfPage: {
      '@type': 'ProfilePage',
      '@id': profileUrl,
    },

    // Direct institutional graph mapping to link employee authority to agency hub
    worksFor: { '@id': organizationId },
    memberOf: { '@id': organizationId },
    affiliation: { '@id': organizationId },

    // Establishes physical location matching Google Business Profile footprint
    workLocation: {
      '@type': 'Place',
      name: 'Mjini Digital Nairobi Headquarters',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Mombasa Road, Mirage Towers, Suite 4B',
        addressLocality: 'Nairobi',
        addressRegion: 'Nairobi County',
        postalCode: '00100',
        addressCountry: 'KE',
      },
    },

    // High-weight semantic tags targeting technical web search terms
    knowsAbout: skillsList,

    ...(socialLinks.length > 0 ? { sameAs: socialLinks } : {}),

    // Relational graph tying the team network together cohesively
    ...(colleagueGraph.length > 0 ? { colleague: colleagueGraph } : {}),
  }
}

export interface GetPersonSchemaOptions extends PersonProps {
  slug?: string
  id?: string | number
  limit?: number
}

/**
 * Asynchronously fetches Team collection members directly from Payload CMS
 * and generates dynamic Person schema objects.
 */
export const getPersonSchema = async (options: GetPersonSchemaOptions = {}) => {
  try {
    const payload = await getPayload({ config: configPromise })

    // If a specific team member is requested by ID or slug
    if (options.id || options.slug) {
      const whereCondition = options.id
        ? { id: { equals: options.id } }
        : options.slug
        ? { name: { equals: options.slug.replace(/-/g, ' ') } }
        : {}

      const result = await payload.find({
        collection: 'team',
        depth: 1,
        limit: 1,
        where: whereCondition as any,
      })

      if (result.docs && result.docs.length > 0) {
        return personSchema({ teamMember: result.docs[0], ...options })
      }
    }

    // Fetch all team members dynamically from Teams collection
    const teamRes = await payload.find({
      collection: 'team',
      depth: 1,
      limit: options.limit || 100,
      sort: 'createdAt',
    })

    if (teamRes.docs && teamRes.docs.length > 0) {
      const colleagueSlugs = teamRes.docs.map((m) =>
        m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      )

      const personSchemas = teamRes.docs.map((member) => {
        const memberSlug = member.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        return personSchema({
          teamMember: member,
          colleagueIds: colleagueSlugs.filter((s) => s !== memberSlug),
        })
      })

      if (personSchemas.length === 1) {
        return personSchemas[0]
      }
      return personSchemas
    }
  } catch (err) {
    console.error('[PersonSchema] Error fetching Team collection from Payload CMS:', err)
  }

  // Fallback to static props if database fetch yields no records
  return personSchema(options)
}

/**
 * Asynchronously fetches all Team collection members as an array of Person schemas.
 */
export const getPersonSchemas = async (limit: number = 100) => {
  const result = await getPersonSchema({ limit })
  if (Array.isArray(result)) {
    return result
  }
  return result ? [result] : []
}

/**
 * React Server Component to render dynamic Person JSON-LD script tag.
 */
export async function PersonSchema(props: GetPersonSchemaOptions = {}) {
  const schemaObj = await getPersonSchema(props)

  if (!schemaObj) return null

  const schemaData = Array.isArray(schemaObj)
    ? { '@context': 'https://schema.org', '@graph': schemaObj }
    : schemaObj

  return (
    <script
      id="person-schema-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  )
}

export default PersonSchema
