import type { Block } from 'payload'

export const FAQsBlock: Block = {
  slug: 'faqsBlock', // Differentiated block slug to prevent namespace collisions with collection models
  interfaceName: 'FAQsBlock',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Main Section Title',
            },
            {
              name: 'subTitle',
              type: 'text',
              label: 'Section Subtitle',
            },
            {
              name: 'description',
              type: 'text',
              label: 'Section Description',
            },
          ],
        },
        {
          label: 'Data Selection',
          fields: [
            {
              name: 'populateBy',
              type: 'select',
              defaultValue: 'collection',
              options: [
                { label: 'Fetch Entire Collection (Dynamic)', value: 'collection' },
                { label: 'Manual Individual Selection', value: 'selection' },
              ],
            },
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              hasMany: false,
              label: 'Filter By Service',
              admin: {
                condition: (_, siblingData) => siblingData?.populateBy === 'collection',
                description:
                  'Only show FAQs linked to this service. Leave empty to show FAQs from every service.',
              },
            },
            {
              name: 'limit',
              type: 'number',
              admin: {
                condition: (_, siblingData) => siblingData?.populateBy === 'collection',
              },
              defaultValue: 6,
              label: 'Maximum FAQs To Display',
            },
            {
              name: 'selectedDocs',
              type: 'relationship',
              relationTo: 'faqs',
              hasMany: true,
              label: 'Selected FAQs',
              admin: {
                condition: (_, siblingData) => siblingData?.populateBy === 'selection',
                description:
                  'Manually order and cherry-pick FAQ items to display on this page layout.',
              },
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'FAQs Blocks',
    singular: 'FAQs Block',
  },
}
