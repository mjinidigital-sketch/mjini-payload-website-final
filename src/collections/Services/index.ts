import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { slugField } from 'payload'
import { Content } from '@/blocks/Content/config'
import { revalidateDelete, revalidateService } from './hooks/revalidateServices'
import { FeatureCards } from '@/blocks/FeatureCards/config'
import { SmallFeatureCards } from '@/blocks/SmallFeatureCards/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { TitleBlock } from '@/blocks/TitleBlock/config'
import { FormBlock } from '@/blocks/Form/config'
import { FAQsBlock } from '@/blocks/FAQBlock/config'
import { PricingBlock } from '@/blocks/PricingBlock/config'
import { seoFields } from '@/fields/seo'
import { ReviewsBlock } from '@/blocks/ReviewsBlock/config'
import { PartnersBlock } from '@/blocks/PartnersBlock/config'
import { About } from '@/blocks/AboutBlock/config'
import { CarouselBlock } from '@/blocks/CarouselBlock/config'
import { TeamBlock } from '@/blocks/TeamBlock/config'
import { ServiceArchiveBlock } from '@/blocks/ServiceArchiveBlock/config'
import { ProjectArchiveBlock } from '@/blocks/ProjectArchiveBlock/config'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { UsefulLinksBlock } from '@/blocks/UsefulLinksBlock/config'
import { ProcessBlock } from '@/blocks/ProcessBlock/config'

export const Services: CollectionConfig<'services'> = {
  slug: 'services',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    subTitle: true,
    summary: true,
    slug: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'services',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'services',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'socialShareAction',
      type: 'ui', // Clean interactive custom UI block type
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/SocialShareButtonAdmin', // Links path directly to client component
        },
      },
    },

    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subTitle',
      type: 'text',
    },

    {
      name: 'icon',
      type: 'select',
      options: [
        {
          label: 'Icon 1',
          value: 'Icon1',
        },
        {
          label: 'Laptop',
          value: 'Laptop',
        },
        {
          label: 'Globe icon',
          value: 'Globe',
        },
        {
          label: 'shield icon',
          value: 'Shield',
        },
        {
          label: 'sparkles icon',
          value: 'Sparkles',
        },
        {
          label: 'Smartphone icon',
          value: 'Smartphone',
        },
        {
          label: 'Settings icon',
          value: 'Settings',
        },
        {
          label: 'Rocket icon',
          value: 'Rocket',
        },
      ],
    },
    {
      name: 'summary',
      type: 'text',
    },

    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
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
                    BlocksFeature({
                      blocks: [
                        Banner,
                        Code,
                        MediaBlock,
                        Content,
                        FAQsBlock,
                        PricingBlock,
                        FeatureCards,
                        SmallFeatureCards,
                        CallToAction,
                        TitleBlock,
                        FormBlock,
                        ReviewsBlock,
                      ],
                    }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                PartnersBlock,
                About,
                CarouselBlock,
                FAQsBlock,
                PricingBlock,
                FeatureCards,
                TeamBlock,
                SmallFeatureCards,
                ServiceArchiveBlock,
                TitleBlock,
                ProjectArchiveBlock,
                ReviewsBlock,
                Banner,
                Code,
                UsefulLinksBlock,
              ],
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },

        {
          name: 'meta',
          label: 'SEO',
          fields: seoFields,
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },

    slugField(),
  ],
  hooks: {
    afterChange: [revalidateService],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
