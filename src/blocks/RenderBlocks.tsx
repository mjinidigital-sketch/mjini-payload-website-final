import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PartnersBlock } from './PartnersBlock/Component'
import { AboutBlock } from './AboutBlock/Component'
import { CarouselBlock } from './CarouselBlock/Component'
import { PricingBlockComponent } from './PricingBlock/Component'
import { TeamBlockComponent } from './TeamBlock/Component'
import { FeatureCardsComponent } from './FeatureCards/Component'
import { SmallFeatureCardsComponent } from './SmallFeatureCards/Component'
import { ServiceArchiveBlockComponent } from './ServiceArchiveBlock/Component'
import { TitleBlockComponent } from './TitleBlock/Component'
import { ProjectArchiveBlockComponent } from './ProjectArchiveBlock/Component'
import ReviewsBlockComponent from './ReviewsBlock/Component'
import { FAQBlockComponent } from './FAQBlock/Component'
import { BannerBlock } from './Banner/Component'
import { CodeBlock } from './Code/Component'
import { UsefulLinksBlockComponent } from './UsefulLinksBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  partnersBlock: PartnersBlock,
  about: AboutBlock,
  carousel: CarouselBlock,
  pricingBlock: PricingBlockComponent,
  teamBlock: TeamBlockComponent,
  featureCards: FeatureCardsComponent,
  smallFeatureCards: SmallFeatureCardsComponent,
  serviceArchive: ServiceArchiveBlockComponent,
  titleBlock: TitleBlockComponent,
  projectArchive: ProjectArchiveBlockComponent,
  reviewsBlock: ReviewsBlockComponent,
  faqsBlock: FAQBlockComponent,
  banner: BannerBlock,
  code: CodeBlock,
  usefulLinksBlock: UsefulLinksBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType] as React.ElementType

            if (Block) {
              return (
                <div className="" key={index}>
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
