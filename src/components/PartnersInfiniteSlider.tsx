'use client'

import { motion, useMotionValue, useAnimationFrame, useSpring } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Title from './Title'

interface Partner {
  id: string
  name: string
  logo: {
    url: string
    alt?: string
  }
  website: string
}

interface PartnersSliderProps {
  partners: Partner[]
  title?: string
  subtitle?: string
  speed?: number
  direction?: 'left' | 'right'
}

export function PartnersSlider({
  partners,

  speed = 30,
  direction = 'left',
}: PartnersSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [contentWidth, setContentWidth] = useState(0)
  const x = useMotionValue(0)
  const springX = useSpring(x, { damping: 50, stiffness: 400 })

  // Clone partners for infinite scroll
  const extendedPartners = [...partners, ...partners, ...partners]

  useEffect(() => {
    if (sliderRef.current) {
      const firstChild = sliderRef.current.children[0] as HTMLElement
      setContentWidth(firstChild.offsetWidth * partners.length)
    }
  }, [partners.length])

  useAnimationFrame(() => {
    if (isHovered || !contentWidth) return

    const currentX = x.get()
    const moveAmount = speed * (direction === 'left' ? -1 : 1)

    if (direction === 'left' && currentX <= -contentWidth) {
      x.set(0)
    } else if (direction === 'right' && currentX >= contentWidth) {
      x.set(0)
    } else {
      x.set(currentX + moveAmount * 0.01)
    }
  })

  if (!partners.length) return null

  return (
    <section className="bg-background/10">
      <div className="container ">
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden">
            <motion.div ref={sliderRef} className="flex items-center gap-8" style={{ x: springX }}>
              {extendedPartners.map((partner, index) => (
                <motion.div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <Link
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shadow-sm flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-accent/10 transition-colors"
                  >
                    <div className="relative w-56 h-40">
                      <Image
                        src={partner.logo.url}
                        alt={partner.logo.alt || partner.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 224px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-base font-semibold text-foreground">{partner.name}</span>
                    <span className="text-xs font-semibold text-foreground text-primary">
                      {partner.website}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
