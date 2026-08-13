import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    // User Socials
    {
      name: 'socials',
      type: 'array',
      fields: [
        {
          name: 'social',
          type: 'select',
          options: [
            {
              label: 'Youtube',
              value: 'youtube',
            },
            {
              label: 'Linkedin',
              value: 'linkedin',
            },
            {
              label: 'Twitter',
              value: 'twitter',
            },
            {
              label: 'Github',
              value: 'github',
            },
            {
              label: 'Instagram',
              value: 'instagram',
            },
            {
              label: 'Facebook',
              value: 'facebook',
            },
            {
              label: 'X',
              value: 'x',
            },
            {
              label: 'Website',
              value: 'website',
            },
            {
              label: 'Tiktok',
              value: 'tiktok',
            },
          ],
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
