import Title from '@/components/Title'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import FacebookReviews from '@/components/FacebookReviews'
import GoogleReviews from '@/components/GoogleReviews'

interface ReviewsBlockProps {
  title?: string | null
  subTitle?: string | null
  description?: string | null
}

export const ReviewsBlockComponent: React.FC<ReviewsBlockProps> = () => {
  return (
    <div className="mx-auto max-w-7xl px-2 py-20">
      <FacebookReviews />
      <GoogleReviews />
    </div>
  )
}

export default ReviewsBlockComponent
