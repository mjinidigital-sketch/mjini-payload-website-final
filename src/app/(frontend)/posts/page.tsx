import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className=" pt-24 pb-24">
      <PageClient />

      {/* Hero */}
      <div className="container mx-auto py-16 bg-muted w-full px-4 text-center border-b">
        <div className="prose prose-lg mx-auto max-w-none">
          <h1 className="mx-auto text-primary  mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Useful Resources
          </h1>
          <p className="mx-auto text-muted-foreground text-lg sm:text-xl md:text-2xl">
            Explore our latest insights, tips, and resources on websites, digital marketing, SEO,
            and growing your business online.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Posts */}
        <CollectionArchive posts={posts.docs} />
      </div>
      {/* Pagination */}
      {posts.totalPages > 1 && posts.page && (
        <div className="mt-16">
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Mjini Digital Posts`,
    alternates: {
      canonical: `${getServerSideURL()}/posts`,
    },
  }
}
