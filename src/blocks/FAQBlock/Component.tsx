import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Faq } from '@/payload-types'
import { Plus } from 'lucide-react'

import Title from '@/components/Title'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import RichText from '@/components/RichText'

interface FAQsBlockProps {
  blockType: 'faqsBlock'
  title?: string | null
  subTitle?: string | null
  description?: string | null
  populateBy?: 'collection' | 'selection' | null
  service?: { id?: string | number | null; title?: string | null } | string | number | null
  limit?: number | null
  selectedDocs?: (Faq | string | number)[] | null
}

export const FAQsBlockComponent: React.FC<FAQsBlockProps> = async ({
  title,
  subTitle,
  description,
  populateBy,
  service,
  limit,
  selectedDocs,
}) => {
  const payload = await getPayload({ config: configPromise })

  let faqs: Faq[] = []

  if (populateBy === 'selection') {
    const ids = (selectedDocs ?? [])
      .map((doc) => (typeof doc === 'object' && doc ? doc.id : doc))
      .filter((id): id is string | number => Boolean(id))

    if (ids.length > 0) {
      const result = await payload.find({
        collection: 'faqs',
        depth: 0,
        limit: ids.length,
        where: {
          id: { in: ids },
        },
      })

      // Preserve the manual order selected in Payload
      faqs = ids
        .map((id) => result.docs.find((doc) => doc.id === id))
        .filter((doc): doc is Faq => Boolean(doc))
    }
  } else {
    const serviceId = typeof service === 'object' && service ? service.id : service

    const result = await payload.find({
      collection: 'faqs',
      depth: 0,
      limit: limit || 6,
      sort: 'createdAt',
      where: serviceId
        ? {
            service: {
              equals: serviceId,
            },
          }
        : undefined,
    })

    faqs = result.docs
  }

  if (!faqs.length) {
    return null
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 bg-muted border">
      <div className="mx-auto container px-2">
        {/* Header */}
        <div className="mx-auto max-w-3xl mb-8 ">
          <Title
            title={title || ''}
            subTitle={subTitle || ''}
            description={description || ''}
            className="mx-auto"
          />
        </div>

        <hr className="" />

        {/* FAQ List */}
        <Accordion
          type="single"
          collapsible
          className="mt-10 grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-6 w-full"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.id ?? index}
              value={`faq-${faq.id ?? index}`}
              className="rounded-xl border border-border bg-card px-5 py-1 transition-all duration-200 hover:border-primary/30 data-[state=open]:border-primary/40 data-[state=open]:shadow-sm sm:px-6"
            >
              <AccordionTrigger
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-4
                  py-4
                  text-left
                  text-base
                  font-semibold
                  tracking-tight
                  hover:no-underline
                  sm:py-5
                  sm:text-lg
                  cursor-pointer
                "
              >
                <span className="flex-1">{faq.question}</span>

                {/* Plus / Close Icon */}
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-border
                    bg-background
                    transition-all
                    duration-300
                    group-data-[state=open]:rotate-45
                    group-data-[state=open]:border-primary
                    group-data-[state=open]:bg-primary
                    group-data-[state=open]:text-primary-foreground
                  "
                >
                  <Plus className="h-4 w-4" strokeWidth={1.8} />
                </span>
              </AccordionTrigger>

              <AccordionContent
                className="
                  pb-5
                  pt-1
                  text-sm
                  leading-7
                  text-muted-foreground
                  sm:pb-6
                  sm:text-base
                "
              >
                {faq.answer ? <RichText data={faq.answer as any} enableGutter={false} /> : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export { FAQsBlockComponent as FAQBlockComponent }

export default FAQsBlockComponent
