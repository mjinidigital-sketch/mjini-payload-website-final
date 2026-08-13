import type { Media as MediaType } from '@/payload-types'
import React from 'react'
import AboutComponent from '@/components/About'
import Title from '@/components/Title'

export interface AboutBlockProps {
  id?: string
  heading?: string
  subheading?: string
  content?: any
  ourValues?: Array<{
    value?: string | null
    icon?: string | null
    id?: string | null
  }> | null
  image?: MediaType | string | number | null
  links?: any[] | null
  disableInnerContainer?: boolean
}

export const AboutBlock: React.FC<AboutBlockProps> = (props) => {
  const { id, heading, subheading, content, ourValues, image, links } = props

  return (
    <div
      id={id ? `block-${id}` : undefined}
      className="container mx-auto w-full py-12 md:py-20 border"
    >
      <Title title={heading ?? ''} subTitle={subheading ?? ''} className="mt-12" />
      <AboutComponent
        heading={heading ?? ''}
        subheading={subheading ?? ''}
        content={content}
        ourValues={ourValues ?? null}
        image={image}
        links={links as any}
      />
    </div>
  )
}

export default AboutBlock
