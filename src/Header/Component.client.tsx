'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { Calendar } from 'lucide-react'
import { DesktopNav } from './Nav/Nav.server'
import { MobileMenu } from './MobileMenu'
import { TopBar } from './TopBar'
import { CMSLink } from '@/components/Link'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [scrolled, setScrolled] = useState(false)

  // ✅ Scroll controller
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = data?.navItems || []

  return (
    <>
      {/* ✅ pass hidden prop */}
      <TopBar hidden={scrolled} />

      <header
        className={`py-2  fixed left-0 right-0 z-40 bg-background shadow-sm transition-all duration-300 ${
          scrolled ? 'top-0' : 'top-8'
        }`}
        role="banner"
      >
        <div className="container h-16 flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link href="/" aria-label="Go to homepage">
            <Logo loading="eager" priority="high" />
          </Link>

          {/* DESKTOP NAV */}
          <div className="flex-1 flex justify-center">
            <DesktopNav items={navItems} />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <CMSLink
                label="Get In Touch"
                appearance="outline"
                size="lg"
                url="/contact"
                className="border-accent hover:bg-accent/10 text-xs group inline-flex items-center justify-center rounded-full font-semibold py-2.5 px-6 shadow-lg transition-all duration-300 hover:-translate-y-1"
              />
              <CMSLink
                appearance="default"
                label="Sign In"
                size="lg"
                url="/signin"
                className="text-xs group inline-flex  items-center justify-center rounded-full font-semibold py-2.5 px-6 shadow-lg border-accent transition-all duration-300 hover:-translate-y-1"
              />
            </div>
            <MobileMenu items={navItems} />
          </div>
        </div>
      </header>
    </>
  )
}
