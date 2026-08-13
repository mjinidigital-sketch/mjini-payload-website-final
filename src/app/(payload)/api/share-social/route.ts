import { NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'

export async function POST(req: Request) {
  try {
    const { title, slug, filename, collectionSlug } = await req.json()

    // 1. Calculate and build URLs dynamically
    const isMediaCollection = collectionSlug === 'media'

    // Fallback checks for regular collections vs media uploads
    if (!isMediaCollection && !slug) {
      return NextResponse.json({ error: 'Missing document slug' }, { status: 400 })
    }
    if (isMediaCollection && !filename) {
      return NextResponse.json({ error: 'Missing media file path payload' }, { status: 400 })
    }

    // Build the public asset bucket URL if it's a media document
    const bucketUrl = process.env.S3_BUCKET_URL?.replace(/\/$/, '')
    const bucket = process.env.S3_BUCKET
    const publicImageUrl =
      isMediaCollection && bucketUrl && bucket ? `${bucketUrl}/${bucket}/${filename}` : null

    const targetUrl = isMediaCollection
      ? publicImageUrl
      : `${process.env.NEXT_PUBLIC_SITE_URL}/${collectionSlug}/${slug}`

    const message = `${title || 'Check out our latest update!'}${targetUrl ? `\n\nLink: ${targetUrl}` : ''}`

    // ==========================================
    // 2. Broadcast to Facebook Graph API
    // ==========================================
    const fbPageId = process.env.FACEBOOK_PAGE_ID
    const fbToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN

    if (fbPageId && fbToken) {
      // If it is an image, hit the /photos endpoint instead of /feed
      const fbEndpoint = isMediaCollection
        ? `https://facebook.com{fbPageId}/photos`
        : `https://facebook.com{fbPageId}/feed`

      const fbBody = isMediaCollection
        ? { caption: message, url: publicImageUrl, access_token: fbToken }
        : { message: message, link: targetUrl, access_token: fbToken }

      await fetch(fbEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fbBody),
      })
    }

    // ==========================================
    // 3. Broadcast to X (Twitter) v2 API
    // ==========================================
    if (process.env.X_API_KEY) {
      const xClient = new TwitterApi({
        appKey: process.env.X_API_KEY,
        appSecret: process.env.X_API_SECRET!,
        accessToken: process.env.X_ACCESS_TOKEN,
        accessSecret: process.env.X_ACCESS_SECRET,
      })

      if (isMediaCollection && publicImageUrl) {
        // Fetch image payload binary over cloud storage and buffer it out to X media endpoints
        const imageResponse = await fetch(publicImageUrl)
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())

        // Match mime-type loosely via extension mapping
        const fileExt = filename.split('.').pop()?.toLowerCase() || 'jpeg'
        const mimeType =
          fileExt === 'png' ? 'image/png' : fileExt === 'gif' ? 'image/gif' : 'image/jpeg'

        // Upload media binary chunk first to resolve structural media ID
        const mediaId = await xClient.v1.uploadMedia(imageBuffer, { mimeType })

        // Tweet out referencing the media ID attachment
        await xClient.v2.tweet({
          text: title || 'Check out our latest media asset upload!',
          media: { media_ids: [mediaId] },
        })
      } else {
        // Standard text text/link fallback string tweet
        await xClient.v2.tweet(message)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Social Share API Error Details:', error)
    return NextResponse.json({ error: error.message || 'Failed sharing' }, { status: 500 })
  }
}
