import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { PartnersBlock } from '@/blocks/PartnersBlock/config'
import { About } from '@/blocks/AboutBlock/config'
import { CarouselBlock } from '@/blocks/CarouselBlock/config'
import { FAQsBlock } from '@/blocks/FAQBlock/config'
import { PricingBlock } from '@/blocks/PricingBlock/config'
import { FeatureCards } from '@/blocks/FeatureCards/config'
import { TeamBlock } from '@/blocks/TeamBlock/config'
import { SmallFeatureCards } from '@/blocks/SmallFeatureCards/config'
import { ServiceArchiveBlock } from '@/blocks/ServiceArchiveBlock/config'
import { TitleBlock } from '@/blocks/TitleBlock/config'
import { ProjectArchiveBlock } from '@/blocks/ProjectArchiveBlock/config'
import { seoFields } from '@/fields/seo'
import { ReviewsBlock } from '@/blocks/ReviewsBlock/config'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
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
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
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
              ],
              required: true,
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
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
