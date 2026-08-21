import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

export type CMSLinkType = {
  appearance?:
    | 'inline'
    | 'default'
    | 'primary'
    | 'accent'
    | 'outline'
    | 'outline-primary'
    | 'outline-accent'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive'
    | ButtonProps['variant']
    | null
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo?: 'pages' | 'posts' | string | null
    value?: Page | Post | string | number | null
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  let href: string | null = null

  if (type === 'reference' && reference && typeof reference === 'object') {
    if (
      typeof reference.value === 'object' &&
      reference.value !== null &&
      'slug' in reference.value &&
      reference.value.slug
    ) {
      const slug = reference.value.slug
      const relationTo = reference.relationTo
      if (relationTo === 'pages') {
        href = slug === 'home' ? '/' : `/${slug}`
      } else if (relationTo) {
        href = `/${relationTo}/${slug}`
      } else {
        href = `/${slug}`
      }
    } else if (typeof reference.value === 'string' || typeof reference.value === 'number') {
      const relationTo = reference.relationTo || 'pages'
      href = relationTo === 'pages' ? `/${reference.value}` : `/${relationTo}/${reference.value}`
    }
  } else if (url) {
    href = url
  }

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Render standard inline text link */
  if (appearance === 'inline') {
    return (
      <Link
        className={cn(
          'text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline',
          className,
        )}
        href={href}
        {...newTabProps}
      >
        {label && label}
        {children && children}
      </Link>
    )
  }

  const variantToUse = (appearance === 'default' ? 'default' : appearance) as ButtonProps['variant']

  return (
    <Button asChild className={className} size={size} variant={variantToUse}>
      <Link href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
