import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Header as HeaderType } from '@/payload-types'
import { HeaderClient } from './Component.client'

export async function Header() {
  try {
    const getHeader = getCachedGlobal('header', 1)
    const headerData = await getHeader()

    return <HeaderClient data={headerData as HeaderType} />
  } catch (error) {
    console.error('Failed to fetch header data:', error)

    // Return empty header with fallback data
    const fallbackData: HeaderType = {
      id: 0,
      navItems: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return <HeaderClient data={fallbackData} />
  }
}
