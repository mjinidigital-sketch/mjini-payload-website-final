// components/Footer/RowLabel.tsx
'use client'

import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

export const RowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ columnTitle?: string }>()

  const customLabel = data?.columnTitle
    ? `Column: ${data.columnTitle}`
    : `Column ${String(rowNumber).padStart(2, '0')}`

  return <div>{customLabel}</div>
}
