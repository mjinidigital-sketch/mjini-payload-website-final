'use client'

import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import Link from 'next/link'

interface TopBarProps {
  hidden: boolean
}

export function TopBar({ hidden }: TopBarProps) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-primary transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container h-8 flex items-center justify-between text-xs text-white">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <a
            href="mailto:info@dentist.com"
            className="flex items-center gap-2 hover:text-secondary"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">info@mjinidigital.co.ke</span>
          </a>

          <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-secondary">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">+254729396862</span>
          </a>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6 text-xs">
          <div className="hidden md:flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Westlands Rd, Nairobi</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="https://facebook.com/mjinidigital">
              <Facebook className="w-4 h-4" />
            </Link>
            <Link href="https://x.com/mjinidigital">
              <Twitter className="w-4 h-4" />
            </Link>
            <Link href="https://www.instagram.com/mjinidigital/">
              <Instagram className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
