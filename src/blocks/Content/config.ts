import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  BlocksFeature,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { MediaBlock } from '../MediaBlock/config'
import { Banner } from '../Banner/config'
import { CallToAction } from '../CallToAction/config'
import { FormBlock } from '../Form/config'
import { TitleBlock } from '../TitleBlock/config'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures, defaultFeatures }) => {
        return [
          ...rootFeatures,
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          BlocksFeature({
            blocks: [MediaBlock, Banner, CallToAction, FormBlock, TitleBlock],
          }),
        ]
      },
    }),
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
  {
    name: 'style',
    type: 'group',
    label: 'Column & Card Styling',
    fields: [
      {
        name: 'enableCard',
        type: 'checkbox',
        label: 'Enable Card Container',
        defaultValue: false,
      },
      {
        name: 'cardStyle',
        type: 'select',
        defaultValue: 'standard',
        admin: {
          condition: (_, siblingData) => Boolean(siblingData?.enableCard),
        },
        options: [
          { label: 'Standard Surface', value: 'standard' },
          { label: 'Bordered', value: 'bordered' },
          { label: 'Elevated (Shadow)', value: 'elevated' },
          { label: 'Glassmorphism', value: 'glass' },
          { label: 'Gradient Accent', value: 'gradient' },
          { label: 'Subtle Muted', value: 'muted' },
          { label: 'Dark Card', value: 'dark' },
        ],
      },
      {
        name: 'backgroundColor',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'Default / Transparent', value: 'default' },
          { label: 'Card Surface', value: 'card' },
          { label: 'Muted Background', value: 'muted' },
          { label: 'Primary Tint', value: 'primary' },
          { label: 'Accent Tint', value: 'accent' },
          { label: 'Dark Background', value: 'dark' },
          { label: 'Light Background', value: 'light' },
        ],
      },
      {
        name: 'borderStyle',
        type: 'select',
        defaultValue: 'none',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Subtle Border', value: 'subtle' },
          { label: 'Solid Border', value: 'solid' },
          { label: 'Primary Accent Border', value: 'primary' },
          { label: 'Secondary Accent Border', value: 'accent' },
          { label: 'Dashed Border', value: 'dashed' },
        ],
      },
      {
        name: 'shadowStyle',
        type: 'select',
        defaultValue: 'none',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small Shadow (sm)', value: 'sm' },
          { label: 'Medium Shadow (md)', value: 'md' },
          { label: 'Large Shadow (lg)', value: 'lg' },
          { label: 'Extra Large Shadow (xl)', value: 'xl' },
          { label: 'Soft Halo Glow', value: 'glow' },
        ],
      },
      {
        name: 'borderRadius',
        type: 'select',
        defaultValue: 'lg',
        options: [
          { label: 'Square (None)', value: 'none' },
          { label: 'Small (sm)', value: 'sm' },
          { label: 'Medium (md)', value: 'md' },
          { label: 'Large (lg)', value: 'lg' },
          { label: 'Extra Large (xl)', value: 'xl' },
          { label: 'Rounded 2XL (2xl)', value: '2xl' },
          { label: 'Rounded 3XL (3xl)', value: '3xl' },
        ],
      },
      {
        name: 'padding',
        type: 'select',
        defaultValue: 'md',
        options: [
          { label: 'None (0)', value: 'none' },
          { label: 'Small (p-4)', value: 'sm' },
          { label: 'Medium (p-6)', value: 'md' },
          { label: 'Large (p-8)', value: 'lg' },
          { label: 'Extra Large (p-10)', value: 'xl' },
        ],
      },
      {
        name: 'hoverEffect',
        type: 'select',
        defaultValue: 'none',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Lift Up', value: 'lift' },
          { label: 'Scale Up', value: 'scale' },
          { label: 'Border Highlight', value: 'border' },
          { label: 'Shadow Expand', value: 'shadow' },
        ],
      },
      {
        name: 'textColor',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted Text', value: 'muted' },
          { label: 'Primary Brand Color', value: 'primary' },
          { label: 'Accent Color', value: 'accent' },
          { label: 'Dark Text', value: 'dark' },
          { label: 'White Text', value: 'white' },
          { label: 'Gradient Heading Text', value: 'gradient' },
        ],
      },
      {
        name: 'alignment',
        type: 'select',
        defaultValue: 'left',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
    ],
  },
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'containerWidth',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default Container', value: 'default' },
        { label: 'Narrow Container', value: 'narrow' },
        { label: 'Full Width Container', value: 'full' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
  ],
}
