'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter, useSearchParams } from 'next/navigation'

export const Search: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [value, setValue] = useState('')

  // Sync state with URL query parameter on mount/change
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setValue(q)
  }, [searchParams])

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    const currentQ = searchParams.get('q') || ''
    if (debouncedValue !== currentQ) {
      const params = new URLSearchParams(searchParams.toString())
      if (debouncedValue) {
        params.set('q', debouncedValue)
      } else {
        params.delete('q')
      }
      router.push(`/search?${params.toString()}`)
    }
  }, [debouncedValue, router, searchParams])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Search..."
          value={value}
        />
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}

