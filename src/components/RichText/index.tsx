'use client'

import React, { useEffect, useRef } from 'react'

import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { TitleBlockComponent } from '@/blocks/TitleBlock/Component'
import { CodeBlock, type CodeBlockProps } from '@/blocks/Code/Component'

import { FeatureCardsComponent } from '@/blocks/FeatureCards/Component'
import { SmallFeatureCardsComponent } from '@/blocks/SmallFeatureCards/Component'

import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'

import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
  TitleBlock as TitleBlockProps,
  ContentBlock as ContentBlockProps,
  PricingBlock as PricingBlockProps,
} from '@/payload-types'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { cn } from '@/utilities/ui'
import PricingBlockComponent from '@/blocks/PricingBlock/Component'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { BannerBlock } from '@/blocks/Banner/Component'
import { FormBlock } from '@/blocks/Form/Component'
import ReviewsBlockComponent from '@/blocks/ReviewsBlock/Component'

interface FAQBlockProps {
  blockType: 'faqsBlock'
  heading?: string | null
  faqs?:
    | {
        question: string
        answer: string
        id?: string | null
      }[]
    | null
}

const FAQBlockClient: React.FC<FAQBlockProps> = ({ heading, faqs }) => {
  if (!faqs || faqs.length === 0) return null

  return (
    <div className="my-8">
      {heading && <h3 className="mb-4 text-xl font-bold">{heading}</h3>}
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.id ?? index} value={`faq-${faq.id ?? index}`}>
            <AccordionTrigger className="text-left text-base font-semibold">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-6 text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

interface FeatureCardsProps {
  blockType: 'featureCards'
  heading?: string | null
  subheading?: string | null
  features?:
    | {
        title?: string | null
        description?: string | null
        icon?: string | null
        id?: string | null
      }[]
    | null
}

interface SmallFeatureCardsProps {
  blockType: 'smallFeatureCards'
  heading?: string | null
  subheading?: string | null
  features?:
    | {
        title?: string | null
        description?: string | null
        image?: string | null
        icon?: string | null
        id?: string | null
      }[]
    | null
}

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | CTABlockProps
      | MediaBlockProps
      | BannerBlockProps
      | CodeBlockProps
      | TitleBlockProps
      | ContentBlockProps
      | PricingBlockProps
      | FAQBlockProps
      | FeatureCardsProps
      | SmallFeatureCardsProps
    >

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!

  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }

  const slug = value.slug

  return relationTo === 'posts' ||
    relationTo === 'pages' ||
    relationTo === 'services' ||
    relationTo === 'projects'
    ? `/${relationTo}/${slug}`
    : `/${slug}`
}

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,

  ...LinkJSXConverter({
    internalDocToHref,
  }),

  blocks: {
    mediaBlock: ({ node }: { node: SerializedBlockNode<MediaBlockProps> }) => (
      <MediaBlock {...node.fields} enableGutter={false} disableInnerContainer />
    ),

    code: ({ node }: { node: SerializedBlockNode<CodeBlockProps> }) => (
      <CodeBlock {...node.fields} />
    ),

    cta: ({ node }: { node: SerializedBlockNode<CTABlockProps> }) => (
      <CallToActionBlock {...node.fields} />
    ),

    titleBlock: ({ node }: { node: SerializedBlockNode<TitleBlockProps> }) => (
      <TitleBlockComponent
        title={node.fields.title}
        subTitle={node.fields.subTitle}
        description={node.fields.description}
      />
    ),

    content: ({ node }: { node: SerializedBlockNode<ContentBlockProps> }) => (
      <ContentBlock {...node.fields} />
    ),

    pricingBlock: ({ node }: { node: SerializedBlockNode<PricingBlockProps> }) => (
      <PricingBlockComponent blockType={'pricingBlock'} />
    ),

    faqsBlock: ({ node }: { node: SerializedBlockNode<FAQBlockProps> }) => (
      <FAQBlockClient {...node.fields} />
    ),

    featureCards: ({ node }: { node: SerializedBlockNode<FeatureCardsProps> }) => (
      <FeatureCardsComponent {...node.fields} />
    ),

    smallFeatureCards: ({ node }: { node: SerializedBlockNode<SmallFeatureCardsProps> }) => (
      <SmallFeatureCardsComponent {...node.fields} />
    ),

    banner: ({ node }: { node: SerializedBlockNode<BannerBlockProps> }) => (
      <BannerBlock {...node.fields} />
    ),

    formBlock: ({ node }: { node: any }) => (
      <FormBlock {...node.fields} />
    ),

    reviewsBlock: ({ node }: { node: any }) => (
      <ReviewsBlockComponent {...node.fields} />
    ),
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  highlightClass?: string
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText({
  data,
  className,
  enableGutter = false,
  enableProse = false,
  highlightClass = 'text-accent',
  ...rest
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current

    if (!el) return

    const html = el.innerHTML

    const replaced = html.replace(
      /\[\[highlight\]\]([^[]+?)\[\[\/highlight\]\]/g,
      `<span class="${highlightClass}">$1</span>`,
    )

    if (replaced !== html) {
      el.innerHTML = replaced
    }
  }, [highlightClass, data])

  return (
    <div
      ref={containerRef}
      className={cn(
        'payload-richtext',
        enableGutter && 'container mx-auto',
        enableProse && 'prose max-w-none',
        className,
      )}
      {...rest}
    >
      <ConvertRichText data={data} converters={jsxConverters} />
    </div>
  )
}
