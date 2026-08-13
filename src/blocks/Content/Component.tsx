import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export const ContentBlock: React.FC<
  ContentBlockProps & {
    containerWidth?: 'default' | 'narrow' | 'full' | null
  }
> = (props) => {
  const { columns, containerWidth = 'default' } = props

  const containerWidthClasses = {
    default: 'container mx-auto px-4 sm:px-6 lg:px-8',
    narrow: 'container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8',
    full: 'w-full px-4 sm:px-6 lg:px-8',
  }

  const columnSpanClasses = {
    full: 'col-span-12',
    half: 'col-span-12 md:col-span-6',
    oneThird: 'col-span-12 md:col-span-6 lg:col-span-4',
    twoThirds: 'col-span-12 md:col-span-8',
  }

  const radiusClasses: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  }

  const paddingClasses: Record<string, string> = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
    xl: 'p-10 sm:p-12 lg:p-14',
  }

  const cardStyleClasses: Record<string, string> = {
    standard: 'bg-card text-card-foreground border border-border/60 shadow-sm shadow-black/5',
    bordered: 'bg-background text-foreground border-2 border-border shadow-none',
    elevated:
      'bg-card text-card-foreground border border-border/40 shadow-xl shadow-black/5 dark:shadow-black/25',
    glass:
      'bg-background/70 backdrop-blur-md border border-border/50 dark:border-white/10 shadow-lg shadow-black/5',
    gradient:
      'bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 shadow-md',
    muted: 'bg-muted/60 text-muted-foreground border border-transparent',
    dark: 'bg-zinc-950 text-zinc-100 border border-zinc-800 shadow-2xl',
  }

  const backgroundColorClasses: Record<string, string> = {
    default: '',
    card: 'bg-card text-card-foreground',
    muted: 'bg-muted/50 text-muted-foreground',
    primary: 'bg-primary/5 text-foreground border-primary/20',
    accent: 'bg-accent/10 text-foreground border-accent/20',
    dark: 'bg-zinc-950 text-zinc-100 border-zinc-800',
    light:
      'bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800',
  }

  const borderStyleClasses: Record<string, string> = {
    none: 'border-0',
    subtle: 'border border-border/40',
    solid: 'border border-border',
    primary: 'border-2 border-primary',
    accent: 'border-2 border-accent',
    dashed: 'border-2 border-dashed border-border',
  }

  const shadowClasses: Record<string, string> = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    glow: 'shadow-xl shadow-primary/20 ring-1 ring-primary/20',
  }

  const hoverClasses: Record<string, string> = {
    none: '',
    lift: 'hover:-translate-y-1.5 hover:shadow-xl',
    scale: 'hover:scale-[1.015] hover:shadow-lg',
    border: 'hover:border-primary/80',
    shadow: 'hover:shadow-2xl hover:shadow-primary/10',
  }

  const textColorClasses: Record<string, string> = {
    default: '',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    accent: 'text-accent',
    dark: 'text-zinc-950 dark:text-zinc-100',
    white: 'text-white',
    gradient:
      '[&_h1]:bg-gradient-to-r [&_h1]:from-primary [&_h1]:via-purple-500 [&_h1]:to-accent [&_h1]:bg-clip-text [&_h1]:text-transparent [&_h2]:bg-gradient-to-r [&_h2]:from-primary [&_h2]:to-accent [&_h2]:bg-clip-text [&_h2]:text-transparent [&_h3]:bg-gradient-to-r [&_h3]:from-primary [&_h3]:to-accent [&_h3]:bg-clip-text [&_h3]:text-transparent',
  }

  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className={cn(containerWidthClasses[containerWidth || 'default'])}>
        {columns && columns.length > 0 && (
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {columns.map((col, index) => {
              const { enableLink, link, richText, size } = col
              const style = col.style || {}

              const {
                enableCard = false,
                cardStyle = 'standard',
                backgroundColor = 'default',
                borderStyle = 'none',
                shadowStyle = 'none',
                borderRadius = 'lg',
                padding = 'md',
                hoverEffect = 'none',
                textColor = 'default',
                alignment = 'left',
              } = style

              const isDarkCard =
                cardStyle === 'dark' || backgroundColor === 'dark' || textColor === 'white'

              return (
                <div
                  key={index}
                  className={cn(
                    columnSpanClasses[size || 'oneThird'],
                    radiusClasses[borderRadius || 'lg'],
                    paddingClasses[padding || 'md'],
                    'flex flex-col justify-between transition-all duration-300',

                    // Card presets vs custom properties
                    enableCard && [
                      cardStyleClasses[cardStyle || 'standard'],
                      hoverEffect !== 'none'
                        ? hoverClasses[hoverEffect || 'none']
                        : 'hover:-translate-y-0.5 hover:shadow-md',
                    ],

                    !enableCard && [
                      backgroundColorClasses[backgroundColor || 'default'],
                      borderStyleClasses[borderStyle || 'none'],
                      shadowClasses[shadowStyle || 'none'],
                      hoverClasses[hoverEffect || 'none'],
                    ],

                    textColorClasses[textColor || 'default'],

                    alignment === 'center' && 'text-center',
                    alignment === 'right' && 'text-right',
                  )}
                >
                  <div className="w-full">
                    {richText && (
                      <div
                        className={cn(
                          'max-w-none',

                          // Typography hierarchy & styling
                          '[&_h1]:mb-6 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:tracking-tight sm:[&_h1]:text-4xl lg:[&_h1]:text-5xl [&_h1]:leading-[1.15]',
                          isDarkCard ? '[&_h1]:text-white' : '[&_h1]:text-foreground',

                          '[&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight sm:[&_h2]:text-3xl lg:[&_h2]:text-4xl [&_h2]:leading-snug',
                          isDarkCard ? '[&_h2]:text-white' : '[&_h2]:text-foreground',

                          '[&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight sm:[&_h3]:text-2xl [&_h3]:leading-snug',
                          isDarkCard ? '[&_h3]:text-zinc-100' : '[&_h3]:text-foreground/90',

                          '[&_h4]:mb-3 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:tracking-tight',
                          isDarkCard ? '[&_h4]:text-zinc-200' : '[&_h4]:text-foreground/85',

                          // Paragraphs
                          '[&_p]:mb-4 [&_p]:text-lg [&_p]:leading-relaxed',
                          isDarkCard ? '[&_p]:text-zinc-400' : '[&_p]:text-muted-foreground',

                          // Lists
                          '[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5',
                          '[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5',
                          isDarkCard ? '[&_li]:text-zinc-400' : '[&_li]:text-muted-foreground',

                          // Strong & Emphasis
                          '[&_strong]:font-semibold',
                          isDarkCard ? '[&_strong]:text-white' : '[&_strong]:text-foreground',

                          // Links
                          '[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-primary/40 hover:[&_a]:decoration-primary transition-colors',

                          // Horizontal rule
                          '[&_hr]:my-8 [&_hr]:border-0 [&_hr]:border-t',
                          isDarkCard ? '[&_hr]:border-zinc-800' : '[&_hr]:border-border',

                          // Blockquote
                          '[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/60 [&_blockquote]:pl-5 [&_blockquote]:py-1 [&_blockquote]:italic [&_blockquote]:rounded-r-md',
                          isDarkCard
                            ? '[&_blockquote]:bg-zinc-900/50 [&_blockquote]:text-zinc-300'
                            : '[&_blockquote]:bg-muted/40 [&_blockquote]:text-muted-foreground',

                          // Code blocks inline
                          '[&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm',
                          isDarkCard
                            ? '[&_code]:bg-zinc-900 [&_code]:text-zinc-200 [&_code]:border [&_code]:border-zinc-800'
                            : '[&_code]:bg-muted [&_code]:text-foreground [&_code]:border [&_code]:border-border/50',

                          alignment === 'center' && 'mx-auto',
                        )}
                      >
                        <RichText data={richText} enableGutter={false} enableProse={false} />
                      </div>
                    )}
                  </div>

                  {enableLink && link && (
                    <div
                      className={cn(
                        '',
                        alignment === 'center' && 'flex justify-center',
                        alignment === 'right' && 'flex justify-end',
                      )}
                    >
                      <CMSLink {...link} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
