import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'projectPartners',
    defaultColumns: ['projectPartners', 'logo', 'website', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    //Company Name from Projects Collection

    {
      name: 'projectPartners',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Project Partners',
      hasMany: false,
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Company Logo',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website URL',
      admin: {
        position: 'sidebar',
      },
      validate: (val: string | null | undefined) => {
        if (!val || !val.trim()) return true
        try {
          new URL(val)
          return true
        } catch {
          return 'Please enter a valid URL (e.g. https://example.com)'
        }
      },
    },
  ],
}
