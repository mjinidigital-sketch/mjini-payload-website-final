import type { Metadata } from 'next/types'
import {
  BadgeDollarSign,
  Bike,
  BookHeart,
  BriefcaseBusiness,
  Calendar,
  Clock as ClockIcon,
  Cpu,
  FlaskConical as FlaskRound,
  HeartPulse,
  Scale,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Search } from '@/search/Component'
import { cn } from '@/utilities/ui'

type Args = {
  searchParams: Promise<{
    q?: string
    category?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query = '', category: categorySlug = '' } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  // Find category ID if categorySlug is present
  let categoryId: string | number | undefined = undefined
  if (categorySlug) {
    const categoryDoc = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: categorySlug,
        },
      },
      limit: 1,
    })
    if (categoryDoc.docs.length > 0) {
      categoryId = categoryDoc.docs[0].id
    }
  }

  // Define posts search condition
  const postsWhere: any = {}
  if (query) {
    postsWhere.or = [
      { title: { like: query } },
      { 'meta.description': { like: query } },
      { 'meta.title': { like: query } },
      { slug: { like: query } },
    ]
  }
  if (categoryId) {
    postsWhere.categories = {
      contains: categoryId,
    }
  }

  // Fetch posts
  const postsResult = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 50,
    where: postsWhere,
  })

  // Fetch projects and services if no categorySlug is selected (since they don't belong to any category)
  let projectsResult = { docs: [] as any[] }
  let servicesResult = { docs: [] as any[] }

  if (!categorySlug) {
    const projectsWhere: any = {}
    if (query) {
      projectsWhere.or = [
        { title: { like: query } },
        { 'meta.description': { like: query } },
        { 'meta.title': { like: query } },
        { slug: { like: query } },
      ]
    }
    projectsResult = await payload.find({
      collection: 'projects',
      depth: 1,
      limit: 50,
      where: projectsWhere,
    })

    const servicesWhere: any = {}
    if (query) {
      servicesWhere.or = [
        { title: { like: query } },
        { 'meta.description': { like: query } },
        { 'meta.title': { like: query } },
        { slug: { like: query } },
      ]
    }
    servicesResult = await payload.find({
      collection: 'services',
      depth: 1,
      limit: 50,
      where: servicesWhere,
    })
  }

  // Fetch all categories for sidebar
  const categoriesResult = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  // Fetch all posts to count category occurrences
  const allPostsForCount = await payload.find({
    collection: 'posts',
    limit: 1000,
    select: {
      categories: true,
    },
  })

  const categoryCounts: Record<string | number, number> = {}
  allPostsForCount.docs.forEach((post) => {
    if (post.categories) {
      post.categories.forEach((cat) => {
        const id = typeof cat === 'object' ? cat.id : cat
        categoryCounts[id] = (categoryCounts[id] || 0) + 1
      })
    }
  })

  // Helper to format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Helper to get image URL
  const getImageUrl = (doc: any) => {
    const imgObj =
      doc.meta?.image || doc.heroImage || doc.projectImages?.[0] || doc.serviceImages?.[0]
    if (imgObj && typeof imgObj === 'object' && imgObj.url) {
      return imgObj.url
    }
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop'
  }

  // Helper to estimate read time for posts
  const getReadTime = (content: any) => {
    let text = ''
    if (content && typeof content === 'object' && content.root?.children) {
      const extractText = (nodes: any[]): string => {
        return nodes
          .map((node) => {
            if (node.text) return node.text
            if (node.children) return extractText(node.children)
            return ''
          })
          .join(' ')
      }
      text = extractText(content.root.children)
    }
    const words = text.split(/\s+/).filter(Boolean).length
    if (words === 0) return '5 min read'
    const minutes = Math.max(3, Math.ceil(words / 200))
    return `${minutes} min read`
  }

  const formattedPosts = postsResult.docs.map((post) => ({
    id: `post-${post.id}`,
    title: post.title,
    description: post.meta?.description || post.summary || '',
    category:
      (post.categories?.[0] &&
        typeof post.categories[0] === 'object' &&
        post.categories[0].title) ||
      'Blog',
    readTime: getReadTime(post.content),
    date: formatDate(post.publishedAt || post.createdAt),
    image: getImageUrl(post),
    link: `/posts/${post.slug}`,
    type: 'post',
    createdAt: post.createdAt,
  }))

  const formattedProjects = projectsResult.docs.map((project) => ({
    id: `project-${project.id}`,
    title: project.title,
    description: project.meta?.description || project.companyName || '',
    category: project.industry || 'Project',
    readTime: 'Project',
    date: formatDate(project.publishedAt || project.createdAt),
    image: getImageUrl(project),
    link: `/projects/${project.slug}`,
    type: 'project',
    createdAt: project.createdAt,
  }))

  const formattedServices = servicesResult.docs.map((service) => ({
    id: `service-${service.id}`,
    title: service.title,
    description: service.meta?.description || service.summary || '',
    category: 'Service',
    readTime: 'Service',
    date: formatDate(service.publishedAt || service.createdAt),
    image: getImageUrl(service),
    link: `/services/${service.slug}`,
    type: 'service',
    createdAt: service.createdAt,
  }))

  // Merge and sort by creation date descending
  const allResults = [...formattedPosts, ...formattedProjects, ...formattedServices].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Sidebar categories mapping
  const mappedCategories = categoriesResult.docs.map((cat) => {
    const name = cat.title
    const totalPosts = categoryCounts[cat.id] || 0
    const slug = cat.slug

    // Match icons
    const lowerName = name.toLowerCase()
    let icon = BookHeart
    if (lowerName.includes('tech')) icon = Cpu
    else if (lowerName.includes('business')) icon = BriefcaseBusiness
    else if (lowerName.includes('finance') || lowerName.includes('money')) icon = BadgeDollarSign
    else if (lowerName.includes('health') || lowerName.includes('medical')) icon = HeartPulse
    else if (lowerName.includes('style') || lowerName.includes('life')) icon = BookHeart
    else if (lowerName.includes('politic') || lowerName.includes('law')) icon = Scale
    else if (
      lowerName.includes('science') ||
      lowerName.includes('lab') ||
      lowerName.includes('research')
    )
      icon = FlaskRound
    else if (
      lowerName.includes('sport') ||
      lowerName.includes('fitness') ||
      lowerName.includes('run')
    )
      icon = Bike

    return {
      name,
      totalPosts,
      icon,
      slug,
    }
  })

  // Fallback categories if CMS categories are empty
  const sidebarCategories =
    mappedCategories.length > 0
      ? mappedCategories
      : [
          { name: 'Technology', totalPosts: 10, icon: Cpu, slug: 'technology' },
          { name: 'Business', totalPosts: 5, icon: BriefcaseBusiness, slug: 'business' },
          { name: 'Finance', totalPosts: 8, icon: BadgeDollarSign, slug: 'finance' },
          { name: 'Health', totalPosts: 12, icon: HeartPulse, slug: 'health' },
          { name: 'Lifestyle', totalPosts: 15, icon: BookHeart, slug: 'lifestyle' },
          { name: 'Politics', totalPosts: 20, icon: Scale, slug: 'politics' },
          { name: 'Science', totalPosts: 25, icon: FlaskRound, slug: 'science' },
          { name: 'Sports', totalPosts: 30, icon: Bike, slug: 'sports' },
        ]

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      <div className="container mb-12">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">Search</h1>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Discover blog posts, case study projects, and services matching your query.
          </p>
          <div className="max-w-[40rem] mx-auto">
            <Suspense fallback={<div className="h-10 animate-pulse bg-muted rounded-md" />}>
              <Search />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col items-start gap-12 px-6 py-10 lg:flex-row lg:py-16 xl:px-0">
        <div className="w-full lg:flex-1">
          {categorySlug && (
            <div className="mb-8 flex items-center justify-between border-b pb-4">
              <div className="text-sm font-medium">
                Filtering by Category:{' '}
                <span className="text-primary capitalize">{categorySlug.replace('-', ' ')}</span>
              </div>
              <Link
                href={`/search${query ? `?q=${query}` : ''}`}
                className="text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full transition-all"
              >
                Clear Filter
              </Link>
            </div>
          )}

          {allResults.length > 0 ? (
            <div className="space-y-12">
              {allResults.map((post) => (
                <Card
                  className="flex flex-col overflow-hidden rounded-md border-none bg-background py-0 shadow-none sm:flex-row sm:items-center group"
                  key={post.id}
                >
                  <Link
                    href={post.link}
                    className="relative aspect-video shrink-0 grow overflow-hidden rounded-lg sm:aspect-square sm:w-56 hover:opacity-90 transition-opacity"
                  >
                    <Image
                      alt={post.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                      sizes="(max-width: 640px) 100vw, 224px"
                      src={post.image}
                    />
                  </Link>
                  <CardContent className="flex flex-col px-0 py-0 sm:px-6 mt-4 sm:mt-0">
                    <div className="flex items-center gap-6">
                      <Badge className="bg-primary/5 text-primary shadow-none hover:bg-primary/10">
                        {post.category}
                      </Badge>
                    </div>

                    <h3 className="mt-4 font-medium text-[1.5rem] tracking-tight group-hover:text-primary transition-colors duration-200">
                      <Link href={post.link}>{post.title}</Link>
                    </h3>
                    <p className="mt-2 line-clamp-3 text-ellipsis text-muted-foreground text-sm leading-relaxed">
                      {post.description}
                    </p>
                    <div className="mt-4 flex items-center gap-6 font-medium text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" /> {post.readTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> {post.date}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/10 rounded-xl border border-dashed p-8">
              <h3 className="font-semibold text-lg text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                We couldn't find any Posts, Projects, or Services matching "{query}". Try searching
                for something else.
              </p>
            </div>
          )}
        </div>

        <aside className="sticky top-8 w-full shrink-0 lg:max-w-xs">
          <h3 className="font-medium text-xl tracking-tight mb-4">Categories</h3>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
            {sidebarCategories.map((category) => {
              const isActive = categorySlug === category.slug
              return (
                <Link
                  href={
                    isActive
                      ? `/search${query ? `?q=${query}` : ''}`
                      : `/search?category=${category.slug}${query ? `&q=${query}` : ''}`
                  }
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-lg p-3 ps-4 transition-all w-full text-left',
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'bg-muted bg-opacity-15 hover:bg-opacity-25 dark:bg-muted/70 dark:bg-opacity-25 dark:hover:bg-opacity-40 text-foreground',
                  )}
                  key={category.name}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="h-5 w-5 shrink-0" />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <Badge
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs shadow-none border-none pointer-events-none',
                      isActive
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-foreground/5 text-foreground',
                    )}
                  >
                    {category.totalPosts}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}

import { getServerSideURL } from '@/utilities/getURL'

export function generateMetadata(): Metadata {
  const serverUrl = getServerSideURL()
  return {
    title: `Mjini Digital Search`,
    alternates: {
      canonical: `${serverUrl}/search`,
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}
