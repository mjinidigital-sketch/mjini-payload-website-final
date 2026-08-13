// Clean shape returned to the app
interface CleanReviewOutput {
  author: string
  reviewBody: string
  ratingValue: number
  datePublished: string
  platform: 'Google'
}

export interface CleanPlacesOutput {
  rating: number
  reviewCount: number
  reviews: CleanReviewOutput[]
}

/**
 * Fetches live rating, review count, and reviews from Google Places API (New / v1).
 * Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env.
 * GOOGLE_PLACE_ID should be in the format: places/ChIJ...
 */
export async function getGoogleReviews(): Promise<CleanPlacesOutput | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const rawPlaceId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !rawPlaceId) {
    console.warn('Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID in environment.')
    return null
  }

  // Normalize: ensure place ID has the places/ prefix for v1 API
  const placeId = rawPlaceId.startsWith('places/') ? rawPlaceId : `places/${rawPlaceId}`

  try {
    const url = `https://places.googleapis.com/v1/${placeId}`
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      },
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}))
      console.error(
        `Google Places API (v1) HTTP ${res.status}:`,
        errJson.error?.message || res.statusText,
      )
      return null
    }

    const data = await res.json()

    if (data.rating === undefined || data.userRatingCount === undefined) {
      console.warn('Google Places API (v1) response missing rating or userRatingCount.')
      return null
    }

    const formattedReviews: CleanReviewOutput[] = (data.reviews || []).map((rev: any) => ({
      author: rev.authorAttribution?.displayName || 'Google User',
      reviewBody: rev.originalText?.text || rev.text?.text || '',
      ratingValue: rev.rating || 5,
      datePublished: rev.publishTime
        ? rev.publishTime.split('T')[0]
        : new Date().toISOString().split('T')[0],
      platform: 'Google' as const,
    }))

    return {
      rating: data.rating,
      reviewCount: data.userRatingCount,
      reviews: formattedReviews,
    }
  } catch (error) {
    console.error('Failed to fetch live data from Google Places:', error)
    return null
  }
}

