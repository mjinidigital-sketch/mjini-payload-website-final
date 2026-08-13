import type { Block } from 'payload'

export const PartnersBlock: Block = {
  slug: 'partnersBlock',
  interfaceName: 'PartnersBlock',
  labels: {
    singular: 'Partners Slider',
    plural: 'Partners Sliders',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Our Partners',
      label: 'Section Title',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Section Subtitle',
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
    },
    {
      name: 'speed',
      type: 'number',
      label: 'Animation Speed',
      defaultValue: 30,
      min: 10,
      max: 100,
    },
    {
      name: 'direction',
      type: 'select',
      label: 'Scroll Direction',
      defaultValue: 'left',
      options: [
        { label: 'Left to Right', value: 'left' },
        { label: 'Right to Left', value: 'right' },
      ],
    },
    {
      name: 'partners',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      required: true,
      label: 'Select Partners',
    },
  ],
}
