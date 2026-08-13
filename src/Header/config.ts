import type { GlobalConfig } from 'payload'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 10,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'linkType',
          type: 'radio',
          defaultValue: 'internal',
          options: [
            { label: 'Internal', value: 'internal' },
            { label: 'External', value: 'external' },
            { label: 'Custom', value: 'custom' },
          ],
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'internal',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'internal',
          },
        },
        {
          name: 'externalUrl',
          type: 'text',
          admin: {
            condition: (_, siblingData) =>
              siblingData?.linkType === 'external' || siblingData?.linkType === 'custom',
            placeholder: 'https://example.com',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open link in new tab',
          },
        },
        {
          name: 'children',
          type: 'array',
          maxRows: 10,
          admin: {
            initCollapsed: true,
            description: 'Mega menu sublinks with icons and descriptions',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'icon',
              type: 'text',
              admin: {
                description: 'Optional icon name (e.g., "home", "user", "settings")',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Short description for the sublink (max 3 lines)',
                rows: 3,
              },
              maxLength: 200,
            },
            {
              name: 'linkType',
              type: 'radio',
              defaultValue: 'internal',
              options: [
                { label: 'Internal', value: 'internal' },
                { label: 'External', value: 'external' },
                { label: 'Custom', value: 'custom' },
              ],
              admin: {
                layout: 'horizontal',
              },
            },
            {
              name: 'internal',
              type: 'relationship',
              relationTo: 'pages',
              admin: {
                condition: (_, siblingData) => siblingData?.linkType === 'internal',
              },
            },
            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.linkType === 'external' || siblingData?.linkType === 'custom',
                placeholder: 'https://example.com',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open link in new tab',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
