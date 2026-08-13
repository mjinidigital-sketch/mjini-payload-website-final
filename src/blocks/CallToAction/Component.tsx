import React from 'react'
import { ArrowUpRight, ComponentIcon, CpuIcon, Package, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

// Local interface — matches what `payload generate:types` will produce for CallToActionBlock.
// Replace with `import type { CallToActionBlock as CTABlockProps } from '@/payload-types'`
// after running `payload generate:types`.
interface CTABlockProps {
  blockType: 'cta'
  heading?: string | null
  subtitle?: string | null
  richText?: {
    root: {
      type: string
      children: {
        type: any
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  } | null
  links?:
    | {
        link: {
          type?: ('reference' | 'custom') | null
          newTab?: boolean | null
          reference?: any
          url?: string | null
          label: string
          appearance?:
            | ('default' | 'primary' | 'accent' | 'outline' | 'outline-primary' | 'outline-accent')
            | null
        }
        id?: string | null
      }[]
    | null
}

const defaultLinks = [
  {
    link: {
      type: 'custom' as const,
      label: 'Get Started',
      url: '#',
      appearance: 'default' as const,
    },
  },
  {
    link: {
      type: 'custom' as const,
      label: 'View Components',
      url: '#',
      appearance: 'outline' as const,
    },
  },
]

export const CallToActionBlock: React.FC<CTABlockProps> = (props) => {
  const { heading, subtitle, richText, links: cmsLinks } = props

  const displayHeading = heading || 'Turn your vision into reality'
  const displaySubtitle =
    subtitle ||
    'Join thousands of developers using our premium component library to ship beautiful UI in minutes, not hours.'

  const links = Array.isArray(cmsLinks) && cmsLinks.length > 0 ? cmsLinks : defaultLinks

  return (
    <div className="container bg-[#3f055e] px-0 py-16 sm:px-6">
      <div className="relative mx-auto overflow-hidden border-border/60 border-y p-14 sm:rounded-xl sm:border-x dark:bg-foreground">
        {/* Aurora Silk Fade Gradient */}
        <div
          className="absolute inset-0 z-0 opacity-70"
          style={{
            background:
              'linear-gradient(150deg, #FFAB91 0%, #FFCDD2 20%, #FCE4EC 30%, #e2daf1 60%, #b39ddb 50%, #8b6ac8 100%)',
          }}
        />

        {/* Circuit Board - Light Pattern */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-60"
          style={{
            backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
        radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
      `,
            backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
          }}
        />

        <div className="absolute top-1/2 right-20 -translate-y-1/2">
          <div className="relative flex size-20 items-center justify-center border border-white/40 bg-white/10 max-md:hidden">
            <Zap className="size-12 fill-white/10 stroke-[1px] text-white/80" />
            <div className="mask-y-from-75% absolute -inset-y-12 -left-px border-white/60 border-s border-dashed" />
            <div className="mask-y-from-75% absolute -inset-y-12 -right-px border-white/60 border-e border-dashed" />
            <div className="mask-x-from-75% absolute -inset-x-12 -top-px border-white/80 border-t border-dashed" />
            <div className="mask-x-from-75% absolute -inset-x-12 -bottom-px border-white/80 border-b border-dashed" />
          </div>
          <div className="relative flex size-20 -translate-x-full items-center justify-center border border-white/40 bg-white/10 max-md:hidden">
            <Package className="size-12 fill-white/10 stroke-[1px] text-white/80" />
            <div className="mask-y-from-75% absolute -inset-y-12 -left-px border-white/60 border-s border-dashed" />
            <div className="mask-y-from-75% absolute -inset-y-12 -right-px border-white/60 border-e border-dashed" />
            <div className="mask-x-from-75% absolute -inset-x-12 -top-px border-white/80 border-t border-dashed" />
            <div className="mask-x-from-75% absolute -inset-x-12 -bottom-px border-white/80 border-b border-dashed" />
          </div>
          <div className="relative flex size-20 items-center justify-center border border-white/40 bg-white/10 max-md:hidden">
            <ComponentIcon className="size-12 fill-white/10 stroke-[1px] text-white/80" />
            <div className="mask-y-from-75% absolute -inset-y-12 -left-px border-white/60 border-s border-dashed" />
            <div className="mask-y-from-75% absolute -inset-y-12 -right-px border-white/60 border-e border-dashed" />
            <div className="mask-x-from-75% absolute -inset-x-12 -top-px border-white/80 border-t border-dashed" />
            <div className="mask-x-from-75% absolute -inset-x-12 -bottom-px border-white/80 border-b border-dashed" />
          </div>
        </div>

        <div className="absolute top-1/2 right-20 -translate-y-1/2">
          <div className="mask-r-from-75% relative flex size-20 translate-x-full items-center justify-center border border-white/40 bg-white/10 max-md:hidden">
            <CpuIcon className="size-12 fill-white/10 stroke-[1px] text-white/80" />
            <div className="mask-y-from-75% absolute -inset-y-12 -left-px border-white/60 border-s border-dashed" />
            <div className="mask-y-from-75% absolute -inset-y-12 -right-px border-white/60 border-e border-dashed" />
            <div className="mask-x-from-75% absolute -inset-x-12 -top-px border-white/80 border-t border-dashed" />
            <div className="mask-x-from-75% absolute -inset-x-12 -bottom-px border-white/80 border-b border-dashed" />
          </div>
        </div>

        <div className="relative isolate">
          <h2 className="text-balance font-medium text-4xl text-black/85 tracking-[-0.04em] md:leading-tight lg:text-[2.75rem]">
            {displayHeading}
          </h2>
          <p className="mt-4 text-balance text-black/70 text-xl/normal md:mt-2.5 lg:text-[1.4rem]/normal">
            {displaySubtitle}
          </p>

          {richText && (
            <div className="mt-4">
              <RichText className="mb-0 text-black/70" data={richText} enableGutter={false} />
            </div>
          )}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {links.map(({ link }, i) => {
              const isPrimary = i === 0

              // If we have CMS links, use CMSLink for proper href handling
              if (Array.isArray(cmsLinks) && cmsLinks.length > 0) {
                return (
                  <CMSLink
                    key={i}
                    size="lg"
                    {...link}
                    className={
                      isPrimary
                        ? 'bg-neutral-950 text-white hover:bg-neutral-950/90'
                        : 'border-white/60 bg-white/50 text-black hover:bg-white/80 dark:border-white/60 dark:bg-white/50 dark:text-black dark:hover:bg-white/80'
                    }
                  />
                )
              }

              // Fallback: render plain Button with default labels
              return (
                <Button
                  key={i}
                  className={isPrimary ? 'rounded-full' : 'rounded-full border-2 border-accent'}
                  size="lg"
                  variant={isPrimary ? 'default' : 'outline'}
                >
                  {link.label}
                  {isPrimary && <ArrowUpRight />}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallToActionBlock
