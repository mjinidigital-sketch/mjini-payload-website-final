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

export type Props = {
  posts?: CardPostData[]
  relationTo?: 'posts'
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, relationTo = 'posts' } = props

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      {/* Header Layout matches Reference Design */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Welcome to our blog!
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Stay updated with the latest news and insights.
          </p>
        </div>

        {/* Category Filter dropdown from the target UI */}
        <div className="w-full md:w-[200px]">
          <Select defaultValue="all">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
