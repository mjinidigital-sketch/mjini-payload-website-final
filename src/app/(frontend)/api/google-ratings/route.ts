import { NextResponse } from 'next/server'
import { getGoogleReviews } from '@/utilities/getGoogleReviews'

export async function GET() {
  const reviews = await getGoogleReviews()
  return NextResponse.json(reviews)
}
