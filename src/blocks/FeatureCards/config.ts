import type { Block } from 'payload'

export const FeatureCards: Block = {
  slug: 'featureCards',
  interfaceName: 'FeatureCards',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Everything in one place',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Section Subheading',
      defaultValue: 'Designed for speed, flexibility, and ease of use',
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
          name: 'icon',
          type: 'select',
          label: 'Icon',
          defaultValue: 'zap',
          options: [
            { label: 'Zap (Performance)', value: 'zap' },
            { label: 'Mouse Pointer (Customizable)', value: 'squareDashedMousePointer' },
            { label: 'Code (Developer)', value: 'code' },
            { label: 'Monitor Smartphone (Responsive)', value: 'monitorSmartphone' },
            { label: 'Contrast (Accessible)', value: 'contrast' },
            { label: 'Cable (Integration)', value: 'cable' },
          ],
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
  ],
  labels: {
    plural: 'Feature Cards Blocks',
    singular: 'Feature Cards Block',
  },
}
