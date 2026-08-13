import React from 'react'
import type { CarouselBlock as CarouselBlockProps } from '@/payload-types'
import { ArrowUpRight, CirclePlay } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const CarouselBlock: React.FC<CarouselBlockProps> = (props) => {
  const { badgeText, badgeUrl, heading, description, links, media } = props

  const primaryLink = links?.[0]?.link
  const secondaryLink = links?.[1]?.link

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) gap-16 lg:grid-cols-2">
        <div>
          <Badge
            asChild
            className="rounded-full border-border py-1"
            variant="secondary"
          >
            <Link href={badgeUrl || '#'}>
              {badgeText || 'Just released v1.0.0'} <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </Badge>
          <h1 className="mt-6 max-w-[17ch] font-medium text-4xl leading-[1.2]! tracking-[-0.04em] md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]">
            {heading ? (
              heading
            ) : (
              <>
                Your complete
                <br /> UI building toolkit
              </>
            )}
          </h1>
          <p className="mt-4 max-w-[60ch] text-foreground/60 text-lg sm:mt-6 sm:text-xl/normal">
            {description ||
              'Explore a collection of Shadcn UI blocks and components, ready to preview and copy. Streamline your development workflow with easy-to-implement examples.'}
          </p>
          <div className="mt-8 flex items-center gap-4 sm:mt-12">
            {primaryLink ? (
              <CMSLink
                {...primaryLink}
                className="rounded-full inline-flex items-center gap-2"
                size="lg"
              >
                <ArrowUpRight className="h-5! w-5!" />
              </CMSLink>
            ) : (
              <Button className="rounded-full" size="lg">
                Get Started <ArrowUpRight className="h-5! w-5!" />
              </Button>
            )}

            {secondaryLink ? (
              <CMSLink
                {...secondaryLink}
                appearance={secondaryLink.appearance || 'outline'}
                className="rounded-full shadow-none inline-flex items-center gap-2"
                size="lg"
              >
                <CirclePlay className="h-5! w-5!" />
              </CMSLink>
            ) : (
              <Button
                className="rounded-full shadow-none"
                size="lg"
                variant="outline"
              >
                <CirclePlay className="h-5! w-5!" /> Watch Demo
              </Button>
            )}
          </div>
        </div>
        {media && typeof media === 'object' ? (
          <div className="mt-auto aspect-video w-full overflow-hidden rounded-xl bg-accent">
            <Media
              resource={media}
              className="h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="mt-auto aspect-video w-full rounded-xl bg-accent" />
        )}
      </div>
    </div>
  )
}

export default CarouselBlock
