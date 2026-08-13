import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'socialShareAction',
      type: 'ui', // Clean interactive custom UI block type
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/SocialShareButtonAdmin', // Links path directly to client component
        },
      },
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'creditext',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    // staticDir: path.resolve(dirname, '../../public/media'),
    // Use a function to build the R2 URL directly so the admin panel never
    // tries to read thumbnail files from local disk.
    adminThumbnail: ({ doc }) => {
      const bucketUrl = process.env.S3_BUCKET_URL
      const bucket = process.env.S3_BUCKET
      // Prefer the generated 'thumbnail' size; fall back to the original file.
      const sizes = doc?.sizes as Record<string, { filename?: string }> | undefined
      const thumbFilename = sizes?.thumbnail?.filename || (doc?.filename as string | undefined)
      if (!bucketUrl || !thumbFilename) return ''
      return `${bucketUrl}/${bucket}/${thumbFilename}`
    },
    focalPoint: true,
    // Preserve original uploaded file exactly as-is (no recompression of the original)
    resizeOptions: {
      withoutEnlargement: true, // never upscale images
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        // Preserve WebP quality at maximum for all generated sizes
        formatOptions: {
          format: 'webp',
          options: { quality: 100, lossless: true },
        },
        withoutEnlargement: true,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: {
          format: 'webp',
          options: { quality: 100, lossless: true },
        },
        withoutEnlargement: true,
      },
      {
        name: 'small',
        width: 600,
        formatOptions: {
          format: 'webp',
          options: { quality: 100, lossless: true },
        },
        withoutEnlargement: true,
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: {
          format: 'webp',
          options: { quality: 100, lossless: true },
        },
        withoutEnlargement: true,
      },
      {
        name: 'large',
        width: 1400,
        formatOptions: {
          format: 'webp',
          options: { quality: 100, lossless: true },
        },
        withoutEnlargement: true,
      },
      {
        name: 'xlarge',
        width: 1920,
        formatOptions: {
          format: 'webp',
          options: { quality: 100, lossless: true },
        },
        withoutEnlargement: true,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: {
          format: 'webp',
          options: { quality: 100, lossless: true },
        },
        withoutEnlargement: true,
      },
    ],
  },
}
