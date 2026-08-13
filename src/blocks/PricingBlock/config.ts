// PricingBlock.ts
import type { Block } from 'payload'

export const PricingBlock: Block = {
  slug: 'pricingBlock',
  interfaceName: 'PricingBlock',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', label: 'Main Section Title' },
            { name: 'subTitle', type: 'text', label: 'Section Subtitle' },
            { name: 'description', type: 'textarea', label: 'General Section Description' },
          ],
        },
        {
          label: 'Data Selection',
          fields: [
            {
              name: 'populateBy',
              type: 'select',
              defaultValue: 'service',
              options: [
                { label: 'By Service (Dynamic)', value: 'service' },
                { label: 'Manual Individual Selection', value: 'selection' },
              ],
            },
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              hasMany: false,
              admin: {
                condition: (_, siblingData) => siblingData?.populateBy === 'service',
                description:
                  'All pricing docs tied to this service will be pulled in and rendered.',
              },
            },
            {
              name: 'limit',
              type: 'number',
              defaultValue: 6,
              admin: {
                condition: (_, siblingData) => siblingData?.populateBy === 'service',
              },
              label: 'Maximum Plans To Display',
            },
            {
              name: 'selectedDocs',
              type: 'relationship',
              relationTo: 'pricing',
              hasMany: true,
              label: 'Selected Pricing Tiers',
              admin: {
                condition: (_, siblingData) => siblingData?.populateBy === 'selection',
              },
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Pricing Blocks',
    singular: 'Pricing Block',
  },
}
