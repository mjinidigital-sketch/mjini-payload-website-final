import type { Field } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const seoFields: Field[] = [
  OverviewField({
    titlePath: 'meta.title',
    descriptionPath: 'meta.description',
    imagePath: 'meta.image',
  }),

  MetaTitleField({
    hasGenerateFn: true,
  }),

  MetaImageField({
    relationTo: 'media',
  }),

  MetaDescriptionField({}),

  PreviewField({
    hasGenerateFn: true,
    titlePath: 'meta.title',
    descriptionPath: 'meta.description',
  }),

  // --------------------------------------------------------------------------
  // GEO TARGETING
  // --------------------------------------------------------------------------
  {
    name: 'location',
    label: 'Location / Geo Targeting',
    type: 'group',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'latitude',
            label: 'Latitude',
            type: 'text',
            admin: {
              placeholder: '-1.2921',
            },
          },
          {
            name: 'longitude',
            label: 'Longitude',
            type: 'text',
            admin: {
              placeholder: '36.8219',
            },
          },
        ],
      },
      {
        name: 'placeName',
        label: 'Place Name',
        type: 'text',
        admin: {
          placeholder: 'Nairobi, Kenya',
        },
      },
    ],
  },

  //Keywords Many
  {
    name: 'keywords',
    label: 'Keywords',
    type: 'text',
    hasMany: true,
    admin: {
      description: 'Comma separated keywords',
    },
  },

  // --------------------------------------------------------------------------
  // SOCIAL GRAPH (OPEN GRAPH & TWITTER)
  // --------------------------------------------------------------------------
  {
    name: 'social',
    label: 'Open Graph & Twitter',
    type: 'group',
    fields: [
      {
        name: 'ogTitle',
        label: 'Open Graph Title',
        type: 'text',
      },
      {
        name: 'ogDescription',
        label: 'Open Graph Description',
        type: 'textarea',
      },
      {
        name: 'twitterTitle',
        label: 'Twitter Title',
        type: 'text',
      },
      {
        name: 'twitterDescription',
        label: 'Twitter Description',
        type: 'textarea',
      },
      {
        name: 'twitterCard',
        label: 'Twitter Card Type',
        type: 'select',
        defaultValue: 'summary_large_image',
        options: [
          {
            label: 'Summary',
            value: 'summary',
          },
          {
            label: 'Summary Large Image',
            value: 'summary_large_image',
          },
          {
            label: 'App',
            value: 'app',
          },
          {
            label: 'Player',
            value: 'player',
          },
        ],
      },
    ],
  },
]
