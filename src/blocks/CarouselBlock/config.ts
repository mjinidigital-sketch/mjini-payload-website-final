import type { Block } from 'payload'
import { linkGroup } from '@/fields/linkGroup'

export const CarouselBlock: Block = {
  slug: 'carousel',
  interfaceName: 'CarouselBlock',
  fields: [
    {
      name: 'badgeText',
      type: 'text',
      label: 'Badge Text',
    },
    {
      name: 'badgeUrl',
      type: 'text',
      label: 'Badge Link URL',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    linkGroup({
      appearances: ['default', 'primary', 'accent', 'outline', 'outline-primary', 'outline-accent'],
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Media',
    },
  ],
  labels: {
    plural: 'Carousels',
    singular: 'Carousel',
  },
}
