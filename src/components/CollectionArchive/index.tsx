import React from 'react'
import { Card, CardPostData } from '@/components/Card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Title from '../Title'

export type Props = {
  posts?: CardPostData[]
  relationTo?: 'posts'
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, relationTo = 'posts' } = props

  return (
    <section className="mx-auto max-w-7xl py-16 border-b border-border">
      {/* Header Layout matches Reference Design */}
      <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Title
          title="Read Our Posts"
          subTitle="Posts & Articles from Top Website Developers in Kenya"
        />
      </div>

      {/* Grid updated from 2 columns to 3 columns to match target layout */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return <Card key={index} doc={result} relationTo={relationTo} showCategories />
          }
          return null
        })}
      </div>

      {/* Center-aligned load more button layout */}
      <div className="mt-16 flex justify-center">
        <Button size="lg" variant="outline">
          Load more articles
        </Button>
      </div>
    </section>
  )
}
