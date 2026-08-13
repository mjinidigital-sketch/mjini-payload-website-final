import type { Block } from 'payload'

export const TeamBlock: Block = {
  slug: 'teamBlock',
  interfaceName: 'TeamBlock',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Eyebrow Text',
      defaultValue: "We're hiring!",
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Our Team',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Section Subheading',
      defaultValue: 'The Team Behind Mjini Digital',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      defaultValue:
        'Meet the passionate individuals behind Mjini Digital. Dedicated to innovation, excellence, and creating exceptional digital experiences.',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Fetch Entire Team Collection (Dynamic)', value: 'collection' },
        { label: 'Manual Individual Selection', value: 'selection' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 12,
      label: 'Limit',
      admin: {
        // FIXED: Added safe global fallback checking for conditional UI rendering
        condition: (data, siblingData) =>
          (siblingData?.populateBy || data?.populateBy) === 'collection',
      },
    },
    {
      name: 'selectedMembers',
      type: 'relationship',
      relationTo: 'team',
      hasMany: true,
      label: 'Selected Team Members',
      admin: {
        // FIXED: Added safe global fallback checking for conditional UI rendering
        condition: (data, siblingData) =>
          (siblingData?.populateBy || data?.populateBy) === 'selection',
        description: 'Select and order specific team members from the Team collection.',
      },
    },
  ],
  labels: {
    plural: 'Team Blocks',
    singular: 'Team Block',
  },
}
