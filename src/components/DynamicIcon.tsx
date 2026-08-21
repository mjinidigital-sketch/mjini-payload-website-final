import React from 'react'
import * as LucideIcons from 'lucide-react'

// Create a mapping from kebab-case to actual lucide icon names
const iconNameMap: Record<string, keyof typeof LucideIcons> = {
  'shopping-cart': 'ShoppingCart',
  building: 'Building',
  briefcase: 'Briefcase',
  'graduation-cap': 'GraduationCap',
  package: 'Package',
  'credit-card': 'CreditCard',
  target: 'Target',
  home: 'Home',
  plane: 'Plane',
  car: 'Car',
  bed: 'Bed',
  truck: 'Truck',
  sprout: 'Sprout',
  'book-open': 'BookOpen',
  heart: 'Heart',
  award: 'Award',
  'trending-up': 'TrendingUp',
  headphones: 'Headphones',
  globe: 'Globe',
  'check-circle': 'CheckCircle',
  'help-circle': 'HelpCircle',
  star: 'Star',
  'chevron-right': 'ChevronRight',
  'arrow-up-right': 'ArrowUpRight',
  clock: 'Clock',
  search: 'Search',
  smartphone: 'Smartphone',
  wrench: 'Wrench',
  palette: 'Palette',
  cloud: 'Cloud',
  'refresh-ccw': 'RefreshCcw',
  // Add more mappings as needed
}

export type IconName = keyof typeof iconNameMap

interface DynamicIconProps {
  name: IconName
  className?: string
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className }) => {
  const actualIconName = iconNameMap[name]

  if (!actualIconName) {
    console.warn(`Icon "${name}" not found in mapping`)
    return null
  }

  const IconComponent = LucideIcons[actualIconName] as React.ComponentType<{ className?: string }>

  if (!IconComponent) {
    console.warn(`Icon "${actualIconName}" not found in lucide-react`)
    return null
  }

  return <IconComponent className={className} />
}

export default DynamicIcon
