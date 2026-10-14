/**
 * Problem Box domain model.
 * Mirrors docs/problem-box-schema.sql — keep the two in sync.
 */

export const INDUSTRIES = [
  'Agriculture',
  'Healthcare',
  'Education',
  'Transport & Mobility',
  'Environment & Waste',
  'Governance & Public Services',
  'Disaster Management',
  'Water',
  'Energy',
  'Fisheries & Livestock',
  'Finance',
  'Manufacturing',
  'Other',
] as const
export type Industry = (typeof INDUSTRIES)[number]

/** 1 = minor inconvenience … 5 = critical. `null` = not rated (e.g. imported). */
export type Severity = 1 | 2 | 3 | 4 | 5
export const SEVERITY_LABELS: Record<Severity, { label: string; hint: string }> = {
  1: { label: 'Minor', hint: 'An inconvenience with easy alternatives.' },
  2: { label: 'Moderate', hint: 'Costs time or money regularly.' },
  3: { label: 'Significant', hint: 'Meaningfully limits work, health or livelihood.' },
  4: { label: 'Severe', hint: 'Causes serious harm or loss for those affected.' },
  5: { label: 'Critical', hint: 'Threatens safety, health or survival of a livelihood.' },
}

/**
 * Validation kinds are deliberately distinct and never merged into one number
 * in the UI. General interest is NOT evidence of experience.
 */
export type ValidationKind = 'direct' | 'observed' | 'interest'
export const VALIDATION_KINDS: Record<ValidationKind, { label: string; short: string; description: string }> = {
  direct: {
    label: 'I have experienced this',
    short: 'Direct experience',
    description: 'You have personally faced this problem.',
  },
  observed: {
    label: 'I have seen this happen',
    short: 'Observed',
    description: 'You have witnessed others face it — customers, colleagues, family or community.',
  },
  interest: {
    label: 'I find this important',
    short: 'General interest',
    description: 'You care about it but have not experienced or observed it first-hand.',
  },
}
export const isExperienceKind = (k: ValidationKind) => k === 'direct' || k === 'observed'

export type SubmitterKind = 'individual' | 'organization' | 'public-source'

export interface Submitter {
  id: string
  displayName: string
  kind: SubmitterKind
  /** Only true after Cofoundrrr has verified an organisation. Never inferred. */
  verified: boolean
}

export type ProblemStatus = 'pending' | 'published' | 'duplicate' | 'removed'

export interface Evidence {
  id: string
  label: string
  /** http(s) only; validated by sanitize.safeUrl */
  url: string | null
  note: string
}

/** Attribution for problems imported from public problem-statement banks. */
export interface PublicSource {
  organization: string
  program: string
  sourceId: string
  url: string
  publishedYear: number | null
}

export interface Problem {
  id: string
  ref: string // human-readable reference, e.g. PB-0007
  title: string
  description: string
  affectedAudience: string
  industry: Industry
  severity: Severity | null
  existingWorkarounds: string
  evidence: Evidence[]
  submitterId: string
  createdAt: string // ISO
  updatedAt: string
  status: ProblemStatus
  duplicateOfId: string | null
  moderationNote: string
  source: PublicSource | null
}

export interface Validation {
  problemId: string
  userId: string
  kind: ValidationKind
  /** Optional rating; only accepted for experience-based kinds. */
  severity: Severity | null
  note: string
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  problemId: string
  authorId: string
  body: string
  createdAt: string
  status: 'visible' | 'removed'
}

export const REPORT_REASONS = {
  spam: 'Spam or promotion',
  duplicate: 'Duplicate of another problem',
  inaccurate: 'Inaccurate or misleading',
  offensive: 'Offensive or abusive',
  personal: 'Contains personal information',
  other: 'Other',
} as const
export type ReportReason = keyof typeof REPORT_REASONS

export interface Report {
  id: string
  targetType: 'problem' | 'comment'
  targetId: string
  problemId: string
  reporterId: string
  reason: ReportReason
  details: string
  createdAt: string
  status: 'open' | 'resolved' | 'dismissed'
  resolutionNote: string
}

/** Members who want to build a solution. Later links to projects/teams. */
export interface BuildInterest {
  problemId: string
  userId: string
  createdAt: string
}

export interface ProblemBoxState {
  version: number
  problems: Problem[]
  submitters: Submitter[]
  validations: Validation[]
  comments: Comment[]
  reports: Report[]
  buildInterest: BuildInterest[]
}

export type SortKey = 'validated' | 'rising' | 'newest' | 'severe'
export const SORTS: Record<SortKey, { label: string; explainer: string }> = {
  validated: {
    label: 'Most validated',
    explainer: 'Ordered by direct experience, then observed, then general interest. Kinds are never added together.',
  },
  rising: {
    label: 'Rising',
    explainer: 'Experience-based validations received in the last 14 days.',
  },
  newest: { label: 'Newest', explainer: 'Most recently published first.' },
  severe: {
    label: 'Most severe',
    explainer: 'Median severity from members with direct or observed experience; falls back to the submitter’s rating. Unrated problems last.',
  },
}

export type Result<T> = { ok: true; value: T } | { ok: false; errors: Record<string, string> }
