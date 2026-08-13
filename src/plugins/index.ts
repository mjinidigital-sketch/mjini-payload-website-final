import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { s3Storage } from '@payloadcms/storage-s3'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Mjini Digital` : 'Mjini Digital'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  s3Storage({
    collections: {
      media: {
        disableLocalStorage: true,
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename }) => {
          return `${process.env.S3_BUCKET_URL}/${process.env.S3_BUCKET}/${filename}`
        },
      },
    },
    bucket: process.env.S3_BUCKET || '',
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      region: 'auto',
      endpoint: process.env.S3_ENDPOINT || '',
      forcePathStyle: true,
    },
  }),

  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  //MCP
  mcpPlugin({
    collections: {
      services: {
        enabled: true,
        description:
          'Services Collection. Use this collection to create and manage service content. ALWAYS populate all applicable SEO metadata fields.',
      },

      projects: {
        enabled: true,
        description:
          'Projects Collection. Use this collection to create and manage project content. Refer to the Projects Collection schema in Payload CMS for all available fields. When creating or updating a project, ALWAYS populate all applicable SEO metadata fields.',
      },

      faqs: {
        enabled: true,
        description:
          'FAQs Collection. Use this collection to create and manage FAQ content. Refer to the FAQs Collection schema in Payload CMS for all available fields. Select the appropriate service type field relation for FAQs and address all questions accordingly. Keep it relevant and specific to that service. Only 1 FAQ item can be added at a time. To add more FAQ entries or subheadings under that service group, edit and patch the existing document.',
      },

      pricing: {
        enabled: true,
        description:
          'Pricing Collection. Use this collection to create and manage pricing content. Refer to the Pricing Collection schema in Payload CMS for all available fields.',
      },

      posts: {
        enabled: true,
        description:
          'Posts Collection. Use this collection to create and manage blog post content. Refer to the Posts Collection schema in Payload CMS for all available fields. When creating or updating a post, ALWAYS populate all applicable SEO metadata fields.',
      },
    },
  }),

  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
