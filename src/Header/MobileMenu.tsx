'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Phone, Mail, Sparkles } from 'lucide-react'
import type { Header } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

type NavItem = NonNullable<Header['navItems']>[number]
type ChildItem = NonNullable<NavItem['children']>[number]

interface MobileMenuProps {
  items: NavItem[]
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<number | null>(null)

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const getHref = (item: NavItem | ChildItem): string => {
    if (item.linkType === 'external') {
      return item.externalUrl || '#'
    }
    const internal = item.internal
    if (typeof internal === 'object' && internal !== null && 'slug' in internal) {
      const slug = internal.slug || 'home'
      return slug === 'home' ? '/' : `/${slug}`
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
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden flex items-center justify-center p-2.5 rounded-xl text-foreground hover:bg-accent/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-menu-drawer"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Slide-out Mobile Menu Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Semi-transparent Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container (Column Layout) */}
          <div
            id="mobile-menu-drawer"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs sm:max-w-sm bg-background border-l border-border/40 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Drawer Header (Top Column Item) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-md">
              <Link href="/" onClick={() => setOpen(false)} aria-label="Go to homepage">
                <Logo className="max-w-[9rem] h-auto py-2 mt-4" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Items Column (Middle Scrollable Column Item) */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2">
              <nav className="flex flex-col space-y-2">
                {items.map((item, i) => {
                  const hasChildren = item.children && item.children.length > 0
                  const isActive = active === i

                  if (hasChildren) {
                    return (
                      <div key={i} className="flex flex-col">
                        <button
                          className={`flex items-center justify-between w-full px-4 py-3 text-left font-semibold text-foreground rounded-xl transition-all ${
                            isActive
                              ? 'bg-accent text-primary'
                              : 'hover:bg-accent hover:text-foreground'
                          }`}
                          onClick={() => setActive(isActive ? null : i)}
                          aria-expanded={isActive}
                          aria-controls={`mobile-submenu-${i}`}
                        >
                          <span className="text-base">{item.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isActive ? 'rotate-180 text-primary' : 'text-muted-foreground'
                            }`}
                          />
                        </button>

                        {/* Accordion Submenu Column */}
                        {isActive && (
                          <div
                            id={`mobile-submenu-${i}`}
                            className="flex flex-col space-y-2 my-2 ml-3 pl-3 border-l-2 border-primary/20"
                            role="region"
                          >
                            {item.children!.map((child, j) => (
                              <Link
                                key={j}
                                href={getHref(child)}
                                target={getTarget(child)}
                                rel={getRel(child)}
                                onClick={() => setOpen(false)}
                                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-accent/80 transition-colors group"
                              >
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center font-semibold text-xs transition-colors">
                                  {child.icon ? (
                                    <span>{child.icon}</span>
                                  ) : (
                                    <Sparkles className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                    {child.label}
                                  </div>
                                  {child.description && (
                                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                      {child.description}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={i}
                      href={getHref(item)}
                      target={getTarget(item)}
                      rel={getRel(item)}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 font-semibold text-base text-foreground rounded-xl hover:bg-accent hover:text-primary transition-all block"
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Bottom Action Section Column (Bottom Column Item) */}
            <div className="p-6 border-t border-border/50 bg-accent/20 flex flex-col space-y-4">
              {/* Stacked CTA Buttons Column Layout */}
              <div className="flex flex-col space-y-3 w-full">
                <CMSLink
                  appearance="primary"
                  label="Get In Touch"
                  size="lg"
                  url="/contact"
                  className="w-full flex justify-center items-center rounded-full font-semibold py-3 text-base shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                />
                <CMSLink
                  appearance="outline-accent"
                  label="Sign In"
                  size="lg"
                  url="/signin"
                  className="w-full flex justify-center items-center rounded-full font-semibold py-3 text-base border-2 transition-all"
                />
              </div>

              {/* Quick Contact Information */}
              <div className="pt-2 flex flex-col space-y-2 text-xs text-muted-foreground border-t border-border/40">
                <a
                  href="tel:+254729396862"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>+254 734 003 111</span>
                </a>
                <a
                  href="mailto:info@mjinidigital.co.ke"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>info@mjinidigital.co.ke</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
