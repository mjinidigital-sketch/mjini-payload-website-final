'use client'

/**
 * SocialShareButtonAdmin — Payload Admin UI Field Component
 *
 * Registered as a `type: 'ui'` field in the sidebar of Posts, Pages,
 * Projects, Services and Media collections.
 *
 * Reads the current document's title, slug and meta.description directly
 * from the Payload form state (useAllFormFields + useDocumentInfo) so the
 * share URL is dynamically generated in real-time as the admin edits the content.
 */

import React, { useEffect, useMemo, useState } from 'react'
import { useAllFormFields, useDocumentInfo } from '@payloadcms/ui'
import {
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'next-share'

// ---------------------------------------------------------------------------
// Collection → public URL prefix map
// ---------------------------------------------------------------------------
const collectionPrefixMap: Record<string, string> = {
  posts: '/posts',
  pages: '',
  projects: '/projects',
  services: '/services',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Safely pull a scalar string from Payload's flattened field map. */
function getField(
  fields: ReturnType<typeof useAllFormFields>[0],
  key: string,
): string {
  const cell = fields[key]
  if (!cell) return ''
  const v = cell.value
  return typeof v === 'string' ? v : ''
}

/** Build the canonical public URL for this document. */
function buildShareUrl(collectionSlug: string | undefined, slug: string): string {
  if (typeof window === 'undefined') return ''
  let origin = process.env.NEXT_PUBLIC_SERVER_URL || window.location.origin
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    origin = 'https://mjinidigital.co.ke'
  }
  const prefix =
    collectionSlug !== undefined
      ? (collectionPrefixMap[collectionSlug] ?? '')
      : ''
  const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`
  return slug ? `${origin}${prefix}${cleanSlug}` : origin
}

// ---------------------------------------------------------------------------
// Admin UI component
// ---------------------------------------------------------------------------

const SocialShareButtonAdmin: React.FC = () => {
  const [mounted, setMounted] = useState(false)

  // Payload admin hooks
  const [fields] = useAllFormFields()
  const { collectionSlug } = useDocumentInfo()

  useEffect(() => {
    setMounted(true)
  }, [])

  const shareData = useMemo(() => {
    const title =
      getField(fields, 'meta.title') ||
      getField(fields, 'title') ||
      getField(fields, 'name') ||
      'Check this out'
    const slug = getField(fields, 'slug')
    const description =
      getField(fields, 'meta.description') ||
      getField(fields, 'summary') ||
      getField(fields, 'subTitle') ||
      ''
    
    let url = ''
    if (collectionSlug === 'media') {
      const mediaUrl = getField(fields, 'url')
      if (mediaUrl) {
        if (mediaUrl.startsWith('http')) {
          url = mediaUrl
        } else {
          const origin = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
            ? 'https://mjinidigital.co.ke'
            : window.location.origin
          url = `${origin}${mediaUrl}`
        }
      }
    } else {
      url = buildShareUrl(collectionSlug, slug)
    }

    return { title, slug, description, url }
  }, [fields, collectionSlug])

  // Dynamically resolve meta.image ID to absolute URL
  const mediaId = getField(fields, 'meta.image')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    if (!mediaId) {
      setImageUrl('')
      return
    }

    let isMounted = true
    fetch(`/api/media/${mediaId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch media')
        return res.json()
      })
      .then((data) => {
        if (isMounted && data && data.url) {
          const absoluteUrl = data.url.startsWith('http')
            ? data.url
            : `${window.location.origin}${data.url}`
          setImageUrl(absoluteUrl)
        }
      })
      .catch((err) => {
        console.error('Error fetching media for social share:', err)
      })

    return () => {
      isMounted = false
    }
  }, [mediaId])

  if (!mounted) return null

  // If slug is not entered yet, we fallback to a placeholder or show a hint
  const hasUrl = Boolean(shareData.slug || collectionSlug === 'media')
  const iconSize = 34
  const iconRound = true

  const shareTitle = shareData.title
  const shareDesc = shareData.description
  const combinedText = shareDesc ? `${shareTitle} — ${shareDesc}` : shareTitle

  const buttons = [
    {
      key: 'facebook',
      label: 'Facebook',
      color: '#1877F2',
      node: (
        <FacebookShareButton url={shareData.url} quote={combinedText}>
          <FacebookIcon size={iconSize} round={iconRound} />
        </FacebookShareButton>
      ),
    },
    {
      key: 'twitter',
      label: 'X',
      color: '#000000',
      node: (
        <TwitterShareButton url={shareData.url} title={combinedText}>
          <TwitterIcon size={iconSize} round={iconRound} />
        </TwitterShareButton>
      ),
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      color: '#25D366',
      node: (
        <WhatsappShareButton url={shareData.url} title={combinedText} separator=" — ">
          <WhatsappIcon size={iconSize} round={iconRound} />
        </WhatsappShareButton>
      ),
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      color: '#0A66C2',
      node: (
        <LinkedinShareButton url={shareData.url}>
          <LinkedinIcon size={iconSize} round={iconRound} />
        </LinkedinShareButton>
      ),
    },
    {
      key: 'pinterest',
      label: 'Pinterest',
      color: '#E60023',
      node: (
        <PinterestShareButton
          url={shareData.url}
          media={imageUrl}
          description={combinedText}
        >
          <PinterestIcon size={iconSize} round={iconRound} />
        </PinterestShareButton>
      ),
    },
    {
      key: 'reddit',
      label: 'Reddit',
      color: '#FF4500',
      node: (
        <RedditShareButton url={shareData.url} title={combinedText}>
          <RedditIcon size={iconSize} round={iconRound} />
        </RedditShareButton>
      ),
    },
    {
      key: 'telegram',
      label: 'Telegram',
      color: '#26A5E4',
      node: (
        <TelegramShareButton url={shareData.url} title={combinedText}>
          <TelegramIcon size={iconSize} round={iconRound} />
        </TelegramShareButton>
      ),
    },
  ]

  return (
    <div className="social-share-wrap" aria-label="Share this page on social media">
      <p className="social-share-label">Share this page</p>

      {hasUrl ? (
        <>
          {/* URL preview chip */}
          <div className="social-share-url-chip" title={shareData.url}>
            <span className="social-share-url-icon">🔗</span>
            <span className="social-share-url-text">{shareData.url}</span>
          </div>

          {/* Icon grid */}
          <div className="social-share-row">
            {buttons.map(({ key, label, color, node }) => (
              <div
                key={key}
                className="social-share-item"
                title={`Share on ${label}`}
                style={{ '--share-color': color } as React.CSSProperties}
              >
                {node}
                <span className="social-share-name">{label}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="social-share-hint">
          💡 Enter a slug and title first to enable sharing.
        </p>
      )}

      <style>{`
        .social-share-wrap {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px 0 10px;
          border-top: 1px solid var(--theme-elevation-150, #e4e4e7);
          margin-top: 4px;
        }

        .social-share-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--theme-elevation-500, #71717a);
          margin: 0;
          padding: 0;
        }

        .social-share-url-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--theme-elevation-50, #f4f4f5);
          border: 1px solid var(--theme-elevation-150, #e4e4e7);
          border-radius: 6px;
          padding: 5px 9px;
          overflow: hidden;
        }

        .social-share-url-icon {
          font-size: 12px;
          flex-shrink: 0;
        }

        .social-share-url-text {
          font-size: 11px;
          color: var(--theme-elevation-500, #71717a);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: monospace;
        }

        .social-share-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: flex-start;
        }

        .social-share-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        .social-share-item > button,
        .social-share-item > a {
          display: block;
          transition: transform 0.18s ease, filter 0.18s ease;
          border-radius: 50%;
        }

        .social-share-item:hover > button,
        .social-share-item:hover > a {
          transform: scale(1.15) translateY(-2px);
          filter: drop-shadow(0 4px 8px color-mix(in srgb, var(--share-color) 55%, transparent));
        }

        .social-share-name {
          font-size: 9px;
          font-weight: 500;
          color: var(--theme-elevation-400, #a1a1aa);
          text-align: center;
          letter-spacing: 0.04em;
          user-select: none;
          transition: color 0.15s ease;
        }

        .social-share-item:hover .social-share-name {
          color: var(--share-color);
        }

        .social-share-hint {
          font-size: 11px;
          color: var(--theme-elevation-500, #71717a);
          margin: 0;
          padding: 4px 0;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

export default SocialShareButtonAdmin
