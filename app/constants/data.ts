/**
 * NEXUS — Static Data Constants
 *
 * All placeholder data for the template.
 * Organized by domain. Never scatter raw data inside components.
 */

import type { TeamMember, ClubEvent, GalleryImage, MembershipPlan, WorkVertical } from '~/types'

// ─── Work Verticals ──────────────────────────────────────────────

export const WORK_VERTICALS: WorkVertical[] = [
  {
    title: 'Hackathons',
    description: 'Weekend-long build sprints where cross-functional teams ship real products, compete for prizes, and learn by doing.',
    icon: 'code',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Conferences',
    description: 'Speaker-led sessions featuring industry leaders, panels, and deep-dive workshops on design and technology.',
    icon: 'mic',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Creative Nights',
    description: 'Festivals, open mics, art showcases, and celebrations that bring the community together.',
    icon: 'palette',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Games & Sports',
    description: 'Tournaments, leagues, and casual game nights — from esports to outdoor sports — designed for every skill level.',
    icon: 'gamepad',
    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=800&auto=format&fit=crop',
  },
]

// ─── Team Members ────────────────────────────────────────────────

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Alex Chen',
    role: 'Founder',
    description: 'Lead architect with a background in systems engineering. Believes code should be beautiful inside and out.',
    quote: 'Build things that outlast the hype.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    socials: { linkedin: '#', instagram: '#' },
  },
  {
    name: 'Sarah Jenkins',
    role: 'Head of Operations',
    description: 'Operations specialist who turns chaos into clean systems. Keeps the entire collective running smoothly.',
    quote: 'Chaos is just order that hasn\'t been designed yet.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    socials: { linkedin: '#', instagram: '#' },
  },
  {
    name: 'David Kim',
    role: 'Event Director',
    description: 'The person behind every memorable gathering. Thinks every event should leave people talking for weeks.',
    quote: 'If they\'re not talking about it the next day, it didn\'t happen.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    socials: { linkedin: '#' },
  },
  {
    name: 'Elena Rostova',
    role: 'Creative Director',
    description: 'Designs everything you see. Obsessed with typography, color theory, and making interfaces feel alive.',
    quote: 'Aesthetics are a form of argument.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop',
    socials: { linkedin: '#', instagram: '#' },
  },
  {
    name: 'Marcus Wright',
    role: 'Lead Developer',
    description: 'Full-stack developer and performance optimizer. Builds the tools and platforms that power the collective.',
    quote: 'Ship it. Then make it perfect.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Aisha Patel',
    role: 'Head of Outreach',
    description: 'Connects the collective with sponsors, partners, and the wider community. Makes sure the right people know about us.',
    quote: 'Every partnership starts with a real conversation.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    socials: { linkedin: '#', instagram: '#' },
  },
]

// ─── Events ──────────────────────────────────────────────────────

export const EVENTS: ClubEvent[] = [
  {
    id: 'e1',
    title: 'HackManage 2026',
    description: '36-hour hackathon for business and tech students. Build a product, pitch it, win.',
    date: 'Sep 14-15, 2026',
    time: '9:00 AM',
    location: 'Main Auditorium',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
    category: 'hackathon',
    isPast: false,
  },
  {
    id: 'e2',
    title: 'Founders Forum',
    description: 'A speaker series featuring startup founders sharing real stories — failures, pivots, and breakthroughs.',
    date: 'Sep 28, 2026',
    time: '5:00 PM',
    location: 'Conference Hall B',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    category: 'conference',
    isPast: false,
  },
  {
    id: 'e3',
    title: 'Creative Night',
    description: 'An evening of performances, food, and digital art showcases from our collective.',
    date: 'Oct 12, 2026',
    time: '6:30 PM',
    location: 'Open Air Theatre',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    category: 'cultural',
    isPast: false,
  },
  {
    id: 'e4',
    title: 'Game Night Championship',
    description: 'The ultimate inter-batch tournament. Board games, card games, esports. Bragging rights included.',
    date: 'Oct 25, 2026',
    time: '7:00 PM',
    location: 'Student Lounge',
    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=800&auto=format&fit=crop',
    category: 'games',
    isPast: false,
  },
  {
    id: 'e5',
    title: 'Spring Mixer',
    description: 'Casual networking over drinks and live music. The best way to meet people outside your section.',
    date: 'Mar 8, 2026',
    time: '8:00 PM',
    location: 'Rooftop Terrace',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
    category: 'social',
    isPast: true,
  },
  {
    id: 'e6',
    title: 'Case Crunch',
    description: 'A rapid-fire case competition. Four hours, one case, fierce competition.',
    date: 'Feb 20, 2026',
    time: '10:00 AM',
    location: 'Lecture Hall 3',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
    category: 'conference',
    isPast: true,
  },
]

// ─── Gallery Images ──────────────────────────────────────────────

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'g1',
    src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop',
    alt: 'Students collaborating at hackathon',
    category: 'events',
    eventName: 'HackManage 2025',
    date: 'Sep 2025',
    aspect: 'tall',
  },
  {
    id: 'g2',
    src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&auto=format&fit=crop',
    alt: 'Speaker on stage at conference',
    category: 'events',
    eventName: 'Founders Forum',
    date: 'Oct 2025',
    aspect: 'wide',
  },
  {
    id: 'g3',
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    alt: 'Team working together',
    category: 'team',
    aspect: 'square',
  },
  {
    id: 'g4',
    src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop',
    alt: 'Cultural night performance',
    category: 'events',
    eventName: 'Cultural Night 2025',
    date: 'Nov 2025',
    aspect: 'tall',
  },
  {
    id: 'g5',
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    alt: 'Workshop in progress',
    category: 'workshops',
    aspect: 'wide',
  },
  {
    id: 'g6',
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
    alt: 'Campus building exterior',
    category: 'campus',
    aspect: 'square',
  },
  {
    id: 'g7',
    src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop',
    alt: 'Group discussion at workshop',
    category: 'workshops',
    aspect: 'tall',
  },
  {
    id: 'g8',
    src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
    alt: 'Team celebration',
    category: 'team',
    aspect: 'wide',
  },
  {
    id: 'g9',
    src: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&auto=format&fit=crop',
    alt: 'Social gathering with friends',
    category: 'events',
    eventName: 'Spring Mixer',
    date: 'Mar 2025',
    aspect: 'square',
  },
  {
    id: 'g10',
    src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop',
    alt: 'Brainstorming session',
    category: 'workshops',
    aspect: 'tall',
  },
  {
    id: 'g11',
    src: 'https://images.unsplash.com/photo-1507537362848-9c7e70b7b5c1?q=80&w=800&auto=format&fit=crop',
    alt: 'Campus at dusk',
    category: 'campus',
    aspect: 'wide',
  },
  {
    id: 'g12',
    src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
    alt: 'Game night crowd',
    category: 'events',
    eventName: 'Game Night Championship',
    date: 'Oct 2025',
    aspect: 'square',
  },
]

// ─── Membership Plans ────────────────────────────────────────────

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    title: 'Member',
    description: 'Join the community. Attend events, meet people, and stay in the loop.',
    perks: [
      'Access to all public events',
      'Club newsletter and updates',
      'Member-only Discord server',
      'Voting rights in club decisions',
    ],
  },
  {
    title: 'Core Team',
    description: 'Step up. Lead initiatives, organize events, and shape what the collective becomes.',
    perks: [
      'Everything in Member',
      'Lead or co-lead a vertical',
      'Priority access to speaker sessions',
      'Mentorship from alumni network',
      'Certificate of leadership',
    ],
    highlight: true,
  },
  {
    title: 'Partner',
    description: 'For organizations and sponsors who want to collaborate with NEXUS.',
    perks: [
      'Brand presence at all events',
      'Co-hosted workshops and sessions',
      'Access to talent pool',
      'Custom partnership packages',
    ],
  },
]

// ─── Nav Links ───────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Events', href: '/events' },
  { label: 'Team', href: '/team' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
] as const

// ─── Social Links ────────────────────────────────────────────────

export const SOCIAL_LINKS = {
  instagram: '#',
  linkedin: '#',
  twitter: '#',
  email: 'hello@nexus.dev',
} as const
