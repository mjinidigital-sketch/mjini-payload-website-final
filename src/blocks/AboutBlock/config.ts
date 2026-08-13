import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UploadFeature,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import { linkGroup } from '@/fields/linkGroup'

export const About: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },

    {
      name: 'subheading',
      type: 'text',
    },

    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures, defaultFeatures }) => {
          return [
            ...rootFeatures,
            ...defaultFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            UploadFeature(),
            LinkFeature(),
          ]
        },
      }),
    },

    {
      type: 'row',
      fields: [
        {
          name: 'ourValues',
          type: 'array',
          fields: [
            {
              name: 'value',
              type: 'text',
            },
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'Globe', value: 'globe' },
                { label: 'Search', value: 'search' },
                { label: 'Code', value: 'code' },
                { label: 'Responsive', value: 'responsive' },
                { label: 'User', value: 'user' },
                // trust icons for values
                { label: 'HandsShake', value: 'hands-shake' },
                { label: 'Shield', value: 'shield' },
                { label: 'Clock', value: 'clock' },
                { label: 'CheckCircle', value: 'check-circle' },
              ],
            },
          ],
        },
      ],
    },

    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },

    linkGroup({
      overrides: { maxRows: 2 },
    }),
  ],

  labels: {
    plural: 'About',
    singular: 'About',
  },
}
