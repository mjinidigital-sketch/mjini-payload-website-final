'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ExternalLink } from 'lucide-react'
import type { Header } from '@/payload-types'
import { cn } from '@/utilities/ui'

type NavItem = NonNullable<Header['navItems']>[number]
type ChildItem = NonNullable<NavItem['children']>[number]

interface DesktopNavProps {
  items: NavItem[]
}

export function DesktopNav({ items }: DesktopNavProps) {
  const pathname = usePathname()
  if (!items?.length) return null

  // Normalizes paths to guarantee accurate home page and sub-route matching
  const isActive = (href: string) => {
    const currentPath = pathname || '/'
    const targetPath = href === '' ? '/' : href

    if (targetPath === '/' || targetPath === '/pages/home') {
      return currentPath === '/' || currentPath === '/pages/home'
    }

    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
  }

  const getHref = (item: NavItem | ChildItem): string => {
    if (item.linkType === 'external') return item.externalUrl || '#'
    const internal = item.internal
    if (typeof internal === 'object' && internal !== null && 'slug' in internal) {
      const slug = internal.slug || 'home'
      return `/pages/${slug}`
    }
    return '#'
  }

  const getTarget = (item: NavItem | ChildItem): string | undefined => {
    return 'newTab' in item && item.newTab ? '_blank' : undefined
  }

  const getRel = (item: NavItem | ChildItem): string | undefined => {
    return 'newTab' in item && item.newTab ? 'noopener noreferrer' : undefined
  }

  return (
    <nav className="hidden lg:flex items-center gap-2" aria-label="Main navigation">
      {items.map((item, i) => {
        const hasChildren = item.children && item.children.length > 0
        const currentHref = getHref(item)

        if (hasChildren) {
          return (
            <NavDropdown
              key={i}
              item={item}
              isActive={isActive}
              getHref={getHref}
              getTarget={getTarget}
              getRel={getRel}
            />
          )
        }

        const active = isActive(currentHref)

        return (
          <Link
            key={i}
            href={currentHref}
            target={getTarget(item)}
            rel={getRel(item)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200',
              active
                ? 'text-primary font-semibold underline '
                : 'text-muted-foreground hover:text-primary hover:underline ',
            )}
          >
            <span>{item.label}</span>
            {item.newTab && <ExternalLink className="size-3.5 opacity-70 shrink-0" />}
          </Link>
        )
      })}
    </nav>
  )
}

interface NavDropdownProps {
  item: NavItem
  isActive: (href: string) => boolean
  getHref: (item: NavItem | ChildItem) => string
  getTarget: (item: NavItem | ChildItem) => string | undefined
  getRel: (item: NavItem | ChildItem) => string | undefined
}

function NavDropdown({ item, isActive, getHref, getTarget, getRel }: NavDropdownProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'center' | 'right'>('center')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!buttonRef.current || !dropdownRef.current) return

    const updatePosition = () => {
      const button = buttonRef.current
      const dropdown = dropdownRef.current
      if (!button || !dropdown) return

      const buttonRect = button.getBoundingClientRect()
      const dropdownWidth = dropdown.offsetWidth
      const viewportWidth = window.innerWidth

      const wouldOverflowRight = buttonRect.left + dropdownWidth > viewportWidth - 16
      const wouldOverflowLeft = buttonRect.right - dropdownWidth < 16

      if (wouldOverflowRight && !wouldOverflowLeft) {
        setDropdownPosition('right')
      } else if (wouldOverflowLeft && !wouldOverflowRight) {
        setDropdownPosition('left')
      } else {
        setDropdownPosition('center')
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [])

  const getPositionStyles = () => {
    switch (dropdownPosition) {
      case 'left':
        return { left: '0', right: 'auto', transform: 'translateX(0)' }
      case 'right':
        return { left: 'auto', right: '0', transform: 'translateX(0)' }
      default:
        return { left: '50%', right: 'auto', transform: 'translateX(-50%)' }
    }
  }

  const hasActiveChild = item.children?.some((child) => isActive(getHref(child))) ?? false

  return (
    <div
      className="relative group"
      role="none"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={buttonRef}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-6 py-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          hasActiveChild
            ? 'bg-accent text-accent-foreground shadow-xs'
            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{item.label}</span>
        <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" />
      </button>

      <div
        ref={dropdownRef}
        className={cn(
          'absolute top-full pt-2 opacity-0 invisible transition-all duration-200 transform translate-y-1 z-50',
          'group-hover:opacity-100 group-hover:visible group-hover:translate-y-0',
        )}
        style={getPositionStyles()}
        role="menu"
        aria-orientation="vertical"
      >
        <div className="bg-popover text-popover-foreground border border-border rounded-xl shadow-xl overflow-hidden max-w-[90vw]">
          <div className="p-3 max-h-[75vh] overflow-y-auto">
            <div
              className={cn(
                'grid gap-1 min-w-[280px] w-max',
                item.children && item.children.length > 4
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-[560px]'
                  : 'grid-cols-1 max-w-[320px]',
              )}
            >
              {item.children?.map((child, j) => {
                const childHref = getHref(child)
                const childActive = isActive(childHref)

                return (
                  <Link
                    key={j}
                    href={childHref}
                    target={getTarget(child)}
                    rel={getRel(child)}
                    className={cn(
                      'group/item flex items-start gap-3 rounded-lg p-2.5 transition-colors duration-200',
                      childActive
                        ? 'bg-accent/80 text-accent-foreground'
                        : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground',
                    )}
                    role="menuitem"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'text-sm font-semibold transition-colors',
                            childActive
                              ? 'text-accent-foreground'
                              : 'text-foreground group-hover/item:text-primary',
                          )}
                        >
                          {child.label}
                        </span>
                        {child.newTab && (
                          <ExternalLink className="size-3 text-muted-foreground/60 flex-shrink-0" />
                        )}
                      </div>
                      {child.description && (
                        <p
                          className={cn(
                            'text-xs mt-0.5 line-clamp-2 leading-normal',
                            childActive ? 'text-accent-foreground/80' : 'text-muted-foreground',
                          )}
                        >
                          {child.description}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {item.children && item.children.length > 6 && (
            <div className="border-t border-border p-2 bg-muted/40 text-center">
              <span className="text-xs text-muted-foreground font-medium">
                Showing all {item.children.length} items
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
