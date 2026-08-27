/**
 * Cyber After Hours Content Constants
 * Reuses images and data from the core Managia dataset, augmented with cyber-brutalist metadata.
 */

import { WORK_VERTICALS, EVENTS, TEAM_MEMBERS, GALLERY_IMAGES } from '~/constants/data'

export interface CyberSticker {
  id: string
  text: string
  subtext?: string
  bg: string
  textColor: string
  borderColor: string
  initialX: number
  initialY: number
  initialRotate: number
  badgeType?: 'star' | 'pill' | 'rect' | 'stamp' | 'barcode'
}

export const CYBER_STICKERS: CyberSticker[] = [
  {
    id: 'st-1',
    text: 'MBA BUT MAKE IT PUNK',
    subtext: '0% SLEEP // 100% BUILD',
    bg: '#CCFF00',
    textColor: '#08080C',
    borderColor: '#08080C',
    initialX: 30,
    initialY: 40,
    initialRotate: -6,
    badgeType: 'stamp',
  },
  {
    id: 'st-2',
    text: 'PROD > PERFECTION',
    subtext: '⚡ SHIP AT 3AM',
    bg: '#00F0FF',
    textColor: '#08080C',
    borderColor: '#00F0FF',
    initialX: 72,
    initialY: 60,
    initialRotate: 8,
    badgeType: 'pill',
  },
  {
    id: 'st-3',
    text: 'NO BORING MEETINGS',
    subtext: 'VERIFIED CHAOS',
    bg: '#FF007F',
    textColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    initialX: 18,
    initialY: 140,
    initialRotate: -12,
    badgeType: 'star',
  },
  {
    id: 'st-4',
    text: 'FOUNDER SPEEDRUN',
    subtext: '9999+ APPS',
    bg: '#9D00FF',
    textColor: '#CCFF00',
    borderColor: '#CCFF00',
    initialX: 65,
    initialY: 170,
    initialRotate: 4,
    badgeType: 'barcode',
  },
]

export const CYBER_BEATPAD_PADS = [
  { key: '1', char: 'Q', label: '808 KICK', color: '#CCFF00', noteIndex: 0 },
  { key: '2', char: 'W', label: 'GLITCH SNARE', color: '#00F0FF', noteIndex: 1 },
  { key: '3', char: 'E', label: 'NEON HAT', color: '#FF007F', noteIndex: 2 },
  { key: '4', char: 'R', label: 'CYBER CHORD', color: '#9D00FF', noteIndex: 3 },
  { key: '5', char: 'A', label: 'LASER ZAP', color: '#FF5500', noteIndex: 4 },
  { key: '6', char: 'S', label: 'RAVE HORN', color: '#CCFF00', noteIndex: 5 },
  { key: '7', char: 'D', label: 'SUB DROP', color: '#00F0FF', noteIndex: 6 },
  { key: '8', char: 'F', label: 'ARCADE CHIME', color: '#FF007F', noteIndex: 7 },
]

export const CYBER_HERO_TICKER = [
  '⚡ 48-HR BUILD SPRINTS',
  '🔥 ZERO SLIDES ALLOWED',
  '🚀 500+ FOUNDERS & CREATORS',
  '👾 CAMPUS ARCADE RESIDENCY',
  '💿 SOUNDTRACK BY SYNTHESIS ENGINE',
  '💀 CODE OVER CORPORATE LOBBIES',
]

export const TERMINAL_COMMANDS: Record<string, string> = {
  'help': 'AVAILABLE COMMANDS:\n- matrix    : Toggle falling digital matrix rain\n- party     : Launch hyper-confetti blast\n- synth     : Run synthesized chord demo\n- warp      : Toggle reality morph back to classroom\n- stats     : Print club metrics telemetry\n- clear     : Wipe terminal screen\n- lore      : Why Managia exists',
  'lore': 'MANAGIA LORE:\nStarted by late-night builders who got tired of sitting through 80-slide decks.\nWe build real products, drop live beats, host hackathons, and prove that business school can have taste.',
  'stats': 'SYSTEM TELEMETRY:\n• Active Cohort: 340 Builders\n• Shipped Projects: 42\n• Caffeine Level: 99.8%\n• Average Sleep: 4.2 hrs\n• Status: OPERATIONAL',
}
