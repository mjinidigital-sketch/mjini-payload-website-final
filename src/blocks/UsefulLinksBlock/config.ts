import type { Block } from 'payload'

export const UsefulLinksBlock: Block = {
  slug: 'usefulLinksBlock',
  interfaceName: 'UsefulLinksBlock',
  labels: {
    singular: 'Useful Links Block',
    plural: 'Useful Links Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Useful Links',
    },
    {
      name: 'subTitle',
      type: 'text',
      label: 'Sub Title',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Link Title',
          required: true,
        },
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'internal',
          options: [
            { label: 'Internal Link', value: 'internal' },
            { label: 'External URL', value: 'external' },
          ],
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'reference',
          type: 'relationship',
          relationTo: ['services', 'pages', 'posts'],
          label: 'Internal Document',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'internal',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'External URL',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'external',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
    },
  ],
}
