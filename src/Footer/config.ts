// globals/Footer/config.ts
import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Components made easy.',
      admin: {
        description: 'Tagline displayed next to logo',
      },
    },
    {
      name: 'menuColumns',
      type: 'array',
      label: 'Menu Columns',
      fields: [
        {
          name: 'columnTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 6,
        },
      ],
      maxRows: 4,
      minRows: 4, // Ensures 4 columns
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© 2024 Your Company. All rights reserved.',
    },
    {
      name: 'bottomLinks',
      type: 'array',
      label: 'Bottom Legal Links',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
