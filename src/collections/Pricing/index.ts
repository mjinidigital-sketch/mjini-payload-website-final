import type { CollectionConfig } from 'payload'

export const Pricing: CollectionConfig<'pricing'> = {
  slug: 'pricing',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'service', 'planType', 'price', 'isPopular'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Admin Display Title',
      admin: {
        description: 'Internal reference name (e.g., "Web Design - Standard Package")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier, auto-generated from title on save.',
      },
    },
    {
      name: 'generateSlug',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'When enabled, the slug will auto-generate from the title field on save and autosave.',
        position: 'sidebar',
      },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
      hasMany: false,
    },
    {
      name: 'planType',
      type: 'select',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Standard', value: 'standard' },
        { label: 'Premium', value: 'premium' },
        { label: 'Gold', value: 'gold' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        placeholder: 'e.g., 45000',
        description: 'Numeric price value only. Exclude commas or symbols.',
      },
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'KES',
      options: [
        { label: 'Kenyan Shilling (KES)', value: 'KES' },
        { label: 'US Dollar (USD)', value: 'USD' },
      ],
    },
    {
      name: 'priceType',
      type: 'select',
      required: true,
      defaultValue: 'flat',
      options: [
        { label: 'Flat Rate / One-Time', value: 'flat' },
        { label: 'Monthly Subscription', value: 'monthly' },
        { label: 'Annual Subscription', value: 'recurring' },
      ],
    },
    {
      name: 'isPopular',
      type: 'checkbox',
      label: 'Highlight as Featured/Popular Plan',
      defaultValue: false,
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      labels: {
        singular: 'Feature Item',
        plural: 'Feature Items',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., Advanced M-Pesa STK Push Integration',
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}
