import type { Block } from 'payload'

export const CarouselBlock: Block = {
  slug: 'carousel',
  interfaceName: 'CarouselBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title (Optional)',
    },
    {
      name: 'subTitle',
      type: 'text',
      label: 'Subtitle / Description (Optional)',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Pictures',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Picture',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption (Optional)',
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Custom Alt Text (Optional)',
        },
      ],
      admin: {
        initCollapsed: false,
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Enable Autoplay',
      defaultValue: true,
    },
    {
      name: 'autoplayInterval',
      type: 'number',
      label: 'Autoplay Speed (milliseconds)',
      defaultValue: 4000,
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.autoplay),
      },
    },
    {
      name: 'showThumbnails',
      type: 'checkbox',
      label: 'Show Thumbnails Preview',
      defaultValue: true,
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Aspect Ratio',
      defaultValue: '16/9',
      options: [
        { label: 'Cinematic (16:9)', value: '16/9' },
        { label: 'Standard (4:3)', value: '4/3' },
        { label: 'Square (1:1)', value: '1/1' },
        { label: 'Ultra-Wide (21:9)', value: '21/9' },
      ],
    },
    // Backwards compatibility fields
    {
      name: 'slides',
      type: 'array',
      label: 'Legacy Slides',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Legacy Media',
      admin: {
        hidden: true,
      },
    },
  ],
  labels: {
    plural: 'Carousels',
    singular: 'Carousel',
  },
}
