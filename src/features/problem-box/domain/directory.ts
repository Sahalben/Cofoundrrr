import type { Industry, Problem, Severity, SortKey, SubmitterKind, Validation } from './types'
import { isExperienceKind } from './types'
import { breakdownFor, communitySeverity } from './validation'
import { tokens } from './similarity'

const DAY = 86_400_000
export const RISING_WINDOW_DAYS = 14

export interface DirectoryQuery {
  q?: string
  industry?: Industry | 'all'
  minSeverity?: Severity | null
  submitterKind?: SubmitterKind | 'all'
  sort?: SortKey
  page?: number
  pageSize?: number
}

export interface DirectoryResult {
  items: Problem[]
  total: number
  page: number
  pageCount: number
}

/** Effective severity: community median (experience only) else submitter rating. */
export function effectiveSeverity(p: Problem, validations: Validation[]): number | null {
  return communitySeverity(validations, p.id)?.median ?? p.severity
}

export function sortProblems(problems: Problem[], validations: Validation[], sort: SortKey, now = Date.now()): Problem[] {
  const list = [...problems]
  const byNewest = (a: Problem, b: Problem) => b.createdAt.localeCompare(a.createdAt)

  switch (sort) {
    case 'newest':
      return list.sort(byNewest)

    case 'validated': {
      // Lexicographic: direct, then observed, then interest. No blended score.
      const bd = new Map(list.map((p) => [p.id, breakdownFor(validations, p.id)]))
      return list.sort((a, b) => {
        const x = bd.get(a.id)!, y = bd.get(b.id)!
        return y.direct - x.direct || y.observed - x.observed || y.interest - x.interest || byNewest(a, b)
      })
    }

    case 'rising': {
      const since = now - RISING_WINDOW_DAYS * DAY
      const recent = (id: string, exp: boolean) =>
        validations.filter(
          (v) => v.problemId === id && isExperienceKind(v.kind) === exp && Date.parse(v.updatedAt) >= since,
        ).length
      return list.sort(
        (a, b) => recent(b.id, true) - recent(a.id, true) || recent(b.id, false) - recent(a.id, false) || byNewest(a, b),
      )
    }

    case 'severe':
      return list.sort((a, b) => {
        const x = effectiveSeverity(a, validations), y = effectiveSeverity(b, validations)
        if (x === null && y === null) return byNewest(a, b)
        if (x === null) return 1
        if (y === null) return -1
        return y - x || byNewest(a, b)
      })
  }
}

export function matchesQuery(p: Problem, q: string, submitterName = ''): boolean {
  const needles = [...tokens(q)]
  if (!needles.length) return true
  const hay = `${p.ref} ${p.title} ${p.description} ${p.affectedAudience} ${p.industry} ${p.source?.organization ?? ''} ${submitterName}`.toLowerCase()
  return needles.every((n) => hay.includes(n))
}

export function queryDirectory(
  problems: Problem[],
  validations: Validation[],
  submitterKindOf: (p: Problem) => SubmitterKind,
  submitterNameOf: (p: Problem) => string,
  query: DirectoryQuery,
  now = Date.now(),
): DirectoryResult {
  const { q = '', industry = 'all', minSeverity = null, submitterKind = 'all', sort = 'validated', pageSize = 10 } = query

  const filtered = problems.filter(
    (p) =>
      p.status === 'published' &&
      (industry === 'all' || p.industry === industry) &&
      (submitterKind === 'all' || submitterKindOf(p) === submitterKind) &&
      (minSeverity === null || (effectiveSeverity(p, validations) ?? 0) >= minSeverity) &&
      matchesQuery(p, q, submitterNameOf(p)),
  )
  const sorted = sortProblems(filtered, validations, sort, now)
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount)
  return { items: sorted.slice((page - 1) * pageSize, page * pageSize), total: sorted.length, page, pageCount }
}
