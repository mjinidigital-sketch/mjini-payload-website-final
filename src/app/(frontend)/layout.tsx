import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'
import { Footer } from '@/Footer/Component'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { Header } from '@/Header/Component'
import Script from 'next/script'
import GoogleMap from '@/components/Maps'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Header />
        {children}
        <GoogleMap />
        <Footer />

        {/* ✅ Next.js optimized Elfsight Script */}
        <Script
          src="https://static.elfsight.com/platform/platform.js"
          strategy="afterInteractive"
        />

        {/* ✅ Next.js optimized Tawk.to Script */}
        <Script
          src="https://embed.tawk.to/6a835d320532ca34496634f7/1k08k1dnp"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
