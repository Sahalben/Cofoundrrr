import type { Severity, Validation, ValidationKind } from './types'
import { isExperienceKind } from './types'
import { LIMITS, cleanText } from './sanitize'

export interface ValidationInput {
  problemId: string
  userId: string
  kind: ValidationKind
  severity?: Severity | null
  note?: string
}

/**
 * Inserts or replaces the single validation a user holds for a problem.
 * The (problemId, userId) pair is unique — mirrors the DB unique constraint.
 * Severity is discarded for general interest so it never influences severity rankings.
 */
export function upsertValidation(list: Validation[], input: ValidationInput, now = new Date().toISOString()): Validation[] {
  const existing = list.find((v) => v.problemId === input.problemId && v.userId === input.userId)
  const next: Validation = {
    problemId: input.problemId,
    userId: input.userId,
    kind: input.kind,
    severity: isExperienceKind(input.kind) ? (input.severity ?? null) : null,
    note: cleanText(input.note ?? '', LIMITS.validationNote.max),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
  return [...list.filter((v) => v !== existing), next]
}

export function removeValidation(list: Validation[], problemId: string, userId: string): Validation[] {
  return list.filter((v) => !(v.problemId === problemId && v.userId === userId))
}

export interface Breakdown {
  direct: number
  observed: number
  interest: number
  /** Number of distinct members who responded. Not a demand metric. */
  respondents: number
}

export function breakdownFor(list: Validation[], problemId: string): Breakdown {
  const b: Breakdown = { direct: 0, observed: 0, interest: 0, respondents: 0 }
  const seen = new Set<string>()
  for (const v of list) {
    if (v.problemId !== problemId || seen.has(v.userId)) continue
    seen.add(v.userId)
    b[v.kind]++
    b.respondents++
  }
  return b
}

/** Median of experience-based severity ratings, or null if none. */
export function communitySeverity(list: Validation[], problemId: string): { median: number; count: number } | null {
  const ratings = list
    .filter((v) => v.problemId === problemId && isExperienceKind(v.kind) && v.severity !== null)
    .map((v) => v.severity as number)
    .sort((a, b) => a - b)
  if (!ratings.length) return null
  const mid = Math.floor(ratings.length / 2)
  const median = ratings.length % 2 ? ratings[mid] : (ratings[mid - 1] + ratings[mid]) / 2
  return { median, count: ratings.length }
}
