import type { Block } from 'payload'

export const SmallFeatureCards: Block = {
  slug: 'smallFeatureCards',
  interfaceName: 'SmallFeatureCards',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Strengthen your strategy',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Section Subheading',
      defaultValue: 'No complex configs. Just copy, paste, and start building',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Feature Cards',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Feature Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Feature Description',
          required: true,
        },
        {
          name: 'image',
          type: 'text',
          label: 'Image URL',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          defaultValue: 'zap',
          options: [
            { label: 'Goal', value: 'goal' },
            { label: 'Book Check', value: 'bookCheck' },
            { label: 'Chart Pie', value: 'chartPie' },
            { label: 'Users', value: 'users' },
            { label: 'Folder Sync', value: 'folderSync' },
            { label: 'Zap', value: 'zap' },
          ],
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
  ],
  labels: {
    plural: 'Small Feature Cards Blocks',
    singular: 'Small Feature Cards Block',
  },
}
