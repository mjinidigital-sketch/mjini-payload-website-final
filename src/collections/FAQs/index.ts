import { MediaBlock } from '@/blocks/MediaBlock/config'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { type CollectionConfig } from 'payload'

export const FAQs: CollectionConfig<'faqs'> = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
  },
  fields: [
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      admin: {
        description: 'Answer to the FAQ',
      },

      required: true,
    },
  ],
}
