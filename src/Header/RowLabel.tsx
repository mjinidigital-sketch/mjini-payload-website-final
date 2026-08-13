'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import type { Header } from '@/payload-types'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['navItems']>[number]>()

  const label = data?.data?.label ? `Nav ${data.rowNumber! + 1}: ${data.data.label}` : 'Nav item'

  return <div>{label}</div>
}
