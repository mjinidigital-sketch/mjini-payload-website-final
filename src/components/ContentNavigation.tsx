'use client'

import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface HeadingItem {
  id: string
  text: string
  level: number
}

interface TreeHeading extends HeadingItem {
  children: HeadingItem[]
}

const ContentNavigation: React.FC = () => {
  const [headingTree, setHeadingTree] = useState<TreeHeading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll('article h2, article h3, article h4'),
    ) as HTMLElement[]

    const usedIds = new Set<string>()
    const flatItems: HeadingItem[] = headingElements.map((el) => {
      const level = Number(el.tagName.substring(1))
      let id = el.id

      if (!id) {
        const baseId = slugify(el.innerText) || `heading-${level}`
        id = baseId
        let counter = 1
        while (usedIds.has(id) || document.getElementById(id)) {
          id = `${baseId}-${counter++}`
        }
        el.id = id
      }
      usedIds.add(id)

      return { id, text: el.innerText, level }
    })

    // Transform flat headings into a nested parent/child tree
    const tree: TreeHeading[] = []
    let currentH2: TreeHeading | null = null

    flatItems.forEach((item) => {
      if (item.level === 2) {
        currentH2 = { ...item, children: [] }
        tree.push(currentH2)
      } else if (currentH2) {
        currentH2.children.push(item)
      }
    })

    setHeadingTree(tree)
    if (!flatItems.length) return

    // Intersection Observer for scroll tracking
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          const newActiveId = visible[0].target.id
          setActiveId(newActiveId)

          // Auto-expand the active section's collapsible panel
          const parentH2 = tree.find(
            (p) => p.id === newActiveId || p.children.some((c) => c.id === newActiveId),
          )
          if (parentH2) {
            setOpenSections((prev) => ({ ...prev, [parentH2.id]: true }))
          }
        }
      },
      {
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0,
      },
    )

    headingElements.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [])

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleLinkClick = (id: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return

    const offset = 100
    const top = target.getBoundingClientRect().top + window.scrollY - offset

    window.scrollTo({ top, behavior: 'smooth' })
    window.history.replaceState(null, '', `#${id}`)
    setActiveId(id)
  }

  if (!headingTree.length) return null

  return (
    <nav
      aria-label="Table of contents"
      className="static lg:sticky top-20 max-h-none lg:max-h-[calc(100vh-120px)] overflow-y-auto mb-4 lg:mb-0 p-4 rounded-xl border border-zinc-200/80 bg-white/70 backdrop-blur-md shadow-sm transition-all"
    >
      <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase mb-3 px-1">
        On this page
      </p>

      <ul className="space-y-1.5 list-none m-0 p-0">
        {headingTree.map((parent) => {
          const isParentActive = activeId === parent.id
          const isChildActive = parent.children.some((child) => child.id === activeId)
          const isExpanded = !!openSections[parent.id]
          const hasChildren = parent.children.length > 0

          return (
            <li key={parent.id} className="m-0">
              {/* Parent H2 Header row */}
              <div className="group flex items-center justify-between rounded-lg transition-colors duration-150 hover:bg-zinc-50">
                <a
                  href={`#${parent.id}`}
                  onClick={(e) => handleLinkClick(parent.id, e)}
                  className={`flex-1 text-sm py-2 px-2.5 font-medium transition-all duration-200 outline-none ${
                    isParentActive
                      ? 'text-blue-600 font-semibold translate-x-1'
                      : isChildActive
                        ? 'text-zinc-900 font-medium'
                        : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {parent.text}
                </a>

                {/* Collapsible toggle arrow button */}
                {hasChildren && (
                  <button
                    onClick={() => toggleSection(parent.id)}
                    aria-label="Toggle section"
                    className="p-2 mr-1 text-zinc-400 hover:text-zinc-600 rounded-md focus:outline-none"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ease-in-out ${
                        isExpanded ? 'rotate-180 text-zinc-700' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Subheadings Collapsible Container */}
              {hasChildren && (
                <div
                  className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100 mt-0.5' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden border-l border-zinc-200 ml-4 pl-2 space-y-1">
                    {parent.children.map((child) => {
                      const isSubActive = activeId === child.id

                      return (
                        <a
                          key={child.id}
                          href={`#${child.id}`}
                          onClick={(e) => handleLinkClick(child.id, e)}
                          className={`block text-[13px] py-1.5 px-2 transition-all duration-200 rounded-md ${
                            child.level === 4 ? 'pl-5' : 'pl-2'
                          } ${
                            isSubActive
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                          }`}
                        >
                          {child.text}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default ContentNavigation
