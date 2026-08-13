import type { Block } from 'payload'

export const ReviewsBlock: Block = {
  slug: 'reviewsBlock',
  interfaceName: 'ReviewsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Our core team',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Section Subheading',
      defaultValue: 'Passionate people building great products',
    },
  ],
  labels: {
    plural: 'Review Blocks',
    singular: 'Review Block',
  },
}
