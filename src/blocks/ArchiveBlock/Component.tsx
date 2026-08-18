import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    relationTo,
  } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories
      ?.map((category) => {
        if (typeof category === 'object' && category !== null) return category.id
        else return category
      })
      .filter(Boolean)

    const fetchedPosts = await payload.find({
      collection: relationTo ?? 'posts',
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs
        .map((post: any) => {
          if (typeof post === 'object' && post !== null) {
            return post.value && typeof post.value === 'object' ? post.value : post
          }
          return null
        })
        .filter((doc): doc is Post => Boolean(doc && typeof doc === 'object' && doc.id))

      posts = filteredSelectedPosts
    }
  }

  return (
    <div id={`block-${id}`}>
      <CollectionArchive posts={posts} relationTo={'posts'} />
    </div>
  )
}
