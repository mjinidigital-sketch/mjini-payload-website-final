'use client'

import React, { useEffect, useMemo, useState } from 'react'
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
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'next-share'

export interface SocialShareProps {
  /** Canonical URL of the page being shared */
  url: string
  /** Meta title — used as share title/subject */
  title: string
  /** Meta description — used as share summary */
  description?: string
  /** Absolute URL of the meta image — used by Pinterest */
  imageUrl?: string
  /** Facebook App ID — required for Messenger (optional, falls back gracefully) */
  facebookAppId?: string
}

/**
 * SocialShareButtons
 *
 * Renders a polished horizontal row of social‑share buttons powered by
 * `next-share`. Each button opens a native share dialog in a small popup
 * window so the reader never leaves the page.
 *
 * Props are resolved server‑side from meta fields on each page / collection
 * route and passed in as plain values — no Payload UI dependency here.
 */
export const SocialShareButtons: React.FC<SocialShareProps> = ({
  url,
  title,
  description = '',
  imageUrl = '',
  facebookAppId = '',
}) => {
  const [mounted, setMounted] = useState(false)

  // Only render after hydration to avoid SSR/client mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedUrl = useMemo(() => {
    if (!url) return ''
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return url.replace(/https?:\/\/(localhost:\d+|127\.0\.0\.1:\d+)/, 'https://mjinidigital.co.ke')
    }
    return url
  }, [url])

  if (!mounted) return null

  const iconSize = 36
  const iconRound = true

  const buttons = [
    {
      key: 'facebook',
      label: 'Facebook',
      color: '#1877F2',
      node: (
        <FacebookShareButton
          url={resolvedUrl}
          quote={description ? `${title} — ${description}` : title}
        >
          <FacebookIcon size={iconSize} round={iconRound} />
        </FacebookShareButton>
      ),
    },
    {
      key: 'twitter',
      label: 'X',
      color: '#000000',
      node: (
        <TwitterShareButton
          url={resolvedUrl}
          title={description ? `${title} — ${description}` : title}
        >
          <TwitterIcon size={iconSize} round={iconRound} />
        </TwitterShareButton>
      ),
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      color: '#25D366',
      node: (
        <WhatsappShareButton
          url={resolvedUrl}
          title={description ? `${title} — ${description}` : title}
          separator=" — "
        >
          <WhatsappIcon size={iconSize} round={iconRound} />
        </WhatsappShareButton>
      ),
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      color: '#0A66C2',
      node: (
        <LinkedinShareButton url={resolvedUrl}>
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
          url={resolvedUrl}
          media={imageUrl}
          description={description ? `${title} — ${description}` : title}
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
        <RedditShareButton
          url={resolvedUrl}
          title={description ? `${title} — ${description}` : title}
        >
          <RedditIcon size={iconSize} round={iconRound} />
        </RedditShareButton>
      ),
    },
    {
      key: 'telegram',
      label: 'Telegram',
      color: '#26A5E4',
      node: (
        <TelegramShareButton
          url={resolvedUrl}
          title={description ? `${title} — ${description}` : title}
        >
          <TelegramIcon size={iconSize} round={iconRound} />
        </TelegramShareButton>
      ),
    },
    {
      key: 'messenger',
      label: 'Messenger',
      color: '#0099FF',
      node: (
        <FacebookMessengerShareButton url={url} appId={facebookAppId}>
          <FacebookMessengerIcon size={iconSize} round={iconRound} />
        </FacebookMessengerShareButton>
      ),
    },
  ]

  return (
    <div className="social-share-wrap" aria-label="Share this page on social media">
      {/* Label row */}
      <p className="social-share-label">Share this</p>

      {/* Icon row */}
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

      {/* Scoped styles injected inline — keeps the component self‑contained */}
      <style>{`
        .social-share-wrap {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px 0 8px;
        }

        .social-share-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #71717a;
          margin: 0;
          padding: 0;
        }

        .social-share-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: flex-start;
        }

        .social-share-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }

        /* Smooth scale + colour glow on hover */
        .social-share-item > button,
        .social-share-item > a {
          display: block;
          transition: transform 0.18s ease, filter 0.18s ease;
          border-radius: 50%;
        }

        .social-share-item:hover > button,
        .social-share-item:hover > a {
          transform: scale(1.15) translateY(-2px);
          filter: drop-shadow(0 4px 8px color-mix(in srgb, var(--share-color) 50%, transparent));
        }

        .social-share-name {
          font-size: 10px;
          font-weight: 500;
          color: #a1a1aa;
          text-align: center;
          letter-spacing: 0.04em;
          user-select: none;
          transition: color 0.15s ease;
        }

        .social-share-item:hover .social-share-name {
          color: var(--share-color);
        }
      `}</style>
    </div>
  )
}

export default SocialShareButtons
