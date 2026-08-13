'use client'

import { ArrowRight } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import Image from 'next/image'
import { motion } from 'framer-motion'
import RichText from './RichText'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { Media } from './Media'

export default function AboutComponent({
  heading,
  subheading,
  content,
  ourValues,
  image,
  links,
}: {
  heading: string
  subheading: string
  content: any
  ourValues: Array<{ value?: string | null; icon?: string | null; id?: string | null }> | null
  image: any
  links?: any[]
}) {
  return (
    <section className="mx-auto w-full bg-background ">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:grid-cols-6 lg:gap-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="relative w-full rounded-3xl  lg:col-span-3"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative  w-full border-3 border-accent rounded-3xl bg-background dark:from-zinc-700 overflow-hidden"
            >
              {/* image from media */}
              <Media resource={image} />
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {content && (
              <div className="">
                <RichText
                  data={content}
                  enableProse={false}
                  enableGutter={false}
                  className={cn(
                    'prose-headings:text-foreground/85',

                    'prose-h3:font-bold',
                    'prose-h3:text-primary/85',
                    'prose-p:text-base',
                    'prose-p:text-muted-foreground',
                    'prose-p:mt-4',
                    'prose-p:max-w-xl',
                    'prose-p:text-base',
                    'prose-p:text-muted-foreground',
                    'prose-a:text-primary',
                    'prose-a:font-medium',
                  )}
                />
              </div>
            )}
            {/* Values */}
            <ul className="mt-6 divide-y border-y border-primary/20 *:flex *:items-center *:gap-2 *:py-1 text-sm">
              {ourValues?.map((item, index) => (
                <motion.li
                  key={item.id ?? index}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div className="flex items-center gap-2 py-1  divide-accent">
                    {item.icon && (
                      <DynamicIcon name={item.icon as IconName} className="size-5 text-accent  " />
                    )}
                    {item.value}
                  </div>
                </motion.li>
              ))}
            </ul>
            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4 mt-8"
            >
              {Array.isArray(links) && links.length > 0 && (
                <div className="flex flex-col gap-4 sm:flex-row mt-2">
                  {links.map(({ link }, i) => {
                    return (
                      <CMSLink
                        key={i}
                        {...link}
                        appearance={link?.appearance || (i === 0 ? 'primary' : 'outline-accent')}
                        size="lg"
                        className={cn(
                          'group inline-flex items-center justify-center gap-2 rounded-full font-semibold py-3 text-sm transition-all duration-300 hover:-translate-y-1',
                          link?.appearance === 'primary' || (!link?.appearance && i === 0)
                            ? 'border-4 border-primary shadow-lg'
                            : 'border-2',
                        )}
                      />
                    )
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
