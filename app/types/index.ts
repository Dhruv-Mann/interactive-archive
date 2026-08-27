/**
 * Managia — Shared Types
 *
 * All domain-level types used across components, pages, and constants.
 * Never use `any`. Keep types small, composable, and domain-oriented.
 */

export interface TeamMember {
  name: string
  role: string
  bio: string
  quote?: string
  image: string
  socials?: {
    linkedin?: string
    instagram?: string
    twitter?: string
  }
}

export interface ClubEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
  category: 'hackathon' | 'conference' | 'cultural' | 'games' | 'social'
  isPast: boolean
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  category: 'events' | 'team' | 'campus' | 'workshops'
  eventName?: string
  date?: string
  /** Aspect class for waterfall variety: 'tall', 'wide', 'square' */
  aspect: 'tall' | 'wide' | 'square'
}

export interface MembershipPlan {
  title: string
  description: string
  perks: string[]
  highlight?: boolean
}

export interface WorkVertical {
  title: string
  description: string
  icon: string
  image: string
}
