import type { Block } from 'payload'

export const TitleBlock: Block = {
  slug: 'titleBlock',
  interfaceName: 'TitleBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    {
      name: 'subTitle',
      type: 'text',
      label: 'Sub Title',
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
    },
  ],
  labels: {
    plural: 'Title Blocks',
    singular: 'Title Block',
  },
}
