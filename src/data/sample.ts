/**
 * Illustrative sample data for landing-page mockups only.
 * These are fictional people and ventures — not real users or traction.
 */

export type Member = {
  id: string
  name: string
  initials: string
  role: string
  location: string
  headline: string
  skills: string[]
  capabilities: { label: string; value: number }[]
  lookingFor: string
  projects: number
  tone: 'forest' | 'mist' | 'mint' | 'ink'
}

export type Startup = {
  id: string
  name: string
  mark: string
  stage: string
  sector: string
  oneLiner: string
  team: { initials: string; tone: Member['tone'] }[]
  openRoles: string[]
  milestones: { label: string; done: boolean }[]
}

export const members: Member[] = [
  {
    id: 'amara',
    name: 'Amara Okafor',
    initials: 'AO',
    role: 'Product Designer',
    location: 'Lagos · Remote',
    headline: 'Designing calm interfaces for complicated systems.',
    skills: ['Interaction design', 'Design systems', 'Research'],
    capabilities: [
      { label: 'Product thinking', value: 92 },
      { label: 'Visual design', value: 86 },
      { label: 'Prototyping', value: 78 },
    ],
    lookingFor: 'Early-stage climate or health team',
    projects: 4,
    tone: 'mist',
  },
  {
    id: 'rohan',
    name: 'Rohan Mehta',
    initials: 'RM',
    role: 'Backend Engineer',
    location: 'Bengaluru',
    headline: 'Distributed systems, data pipelines, quiet reliability.',
    skills: ['Go', 'Postgres', 'Infrastructure'],
    capabilities: [
      { label: 'Systems design', value: 90 },
      { label: 'Data engineering', value: 82 },
      { label: 'DevOps', value: 74 },
    ],
    lookingFor: 'Technical co-founder role',
    projects: 6,
    tone: 'forest',
  },
  {
    id: 'lena',
    name: 'Lena Vogel',
    initials: 'LV',
    role: 'Growth & Operations',
    location: 'Berlin',
    headline: 'Turning first customers into repeatable motion.',
    skills: ['Go-to-market', 'Partnerships', 'Ops'],
    capabilities: [
      { label: 'Go-to-market', value: 88 },
      { label: 'Operations', value: 84 },
      { label: 'Fundraising prep', value: 70 },
    ],
    lookingFor: 'B2B team pre-seed',
    projects: 3,
    tone: 'mint',
  },
  {
    id: 'kenji',
    name: 'Kenji Watanabe',
    initials: 'KW',
    role: 'ML Engineer',
    location: 'Tokyo · Remote',
    headline: 'Applied machine learning for real-world sensing.',
    skills: ['PyTorch', 'Computer vision', 'MLOps'],
    capabilities: [
      { label: 'Modelling', value: 91 },
      { label: 'Research', value: 85 },
      { label: 'Deployment', value: 72 },
    ],
    lookingFor: 'Research-led venture',
    projects: 5,
    tone: 'ink',
  },
]

export const startup: Startup = {
  id: 'verdant',
  name: 'Verdant Grid',
  mark: 'V',
  stage: 'Idea → Prototype',
  sector: 'Climate · Energy',
  oneLiner: 'Helping small manufacturers measure and reduce energy waste, machine by machine.',
  team: [
    { initials: 'SN', tone: 'forest' },
    { initials: 'AO', tone: 'mist' },
  ],
  openRoles: ['Backend Engineer', 'ML Engineer', 'Industrial Sales'],
  milestones: [
    { label: 'Problem interviews', done: true },
    { label: 'Founding team', done: false },
    { label: 'Working prototype', done: false },
    { label: 'First pilot', done: false },
  ],
}

export type Program = {
  code: string
  title: string
  duration: string
  format: string
  description: string
  outcomes: string[]
}

export const programs: Program[] = [
  {
    code: 'P—01',
    title: 'Identity Sprint',
    duration: '2 weeks',
    format: 'Cohort · Remote',
    description: 'Articulate what you are exceptional at and translate it into a profile collaborators can trust.',
    outcomes: ['Capability map', 'Portfolio review', 'Peer feedback'],
  },
  {
    code: 'P—02',
    title: 'Team Formation Lab',
    duration: '4 weeks',
    format: 'Cohort · Hybrid',
    description: 'Work in rotating small teams on real briefs to discover who you build well with.',
    outcomes: ['Paired projects', 'Working agreements', 'Team retros'],
  },
  {
    code: 'P—03',
    title: 'Venture Bootcamp',
    duration: '8 weeks',
    format: 'Selective · Hybrid',
    description: 'Take a formed team from problem to validated prototype with mentors and structured milestones.',
    outcomes: ['Customer discovery', 'Prototype', 'Demo day'],
  },
]
