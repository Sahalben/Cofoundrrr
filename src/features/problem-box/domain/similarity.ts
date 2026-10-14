import type { Problem } from './types'

/**
 * Lightweight lexical similarity for duplicate detection and related problems.
 * Production should replace this with full-text search / embeddings, keeping
 * the same function signatures.
 */

const STOP = new Set(
  'a an and are as at be been by can do does for from has have how in into is it its of on or that the their there these this those to was were what when where which who why will with without not no our we you your they them using use used need needs lack lacking system based'.split(
    ' ',
  ),
)

export function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOP.has(t))
      .map((t) => {
        let s = t
        if (s.length > 4 && s.endsWith('s')) s = s.slice(0, -1)
        if (s.length > 5 && s.endsWith('ing')) s = s.slice(0, -3)
        if (s.length > 5 && s.endsWith('ed')) s = s.slice(0, -2)
        return s
      }),
  )
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  return inter / (a.size + b.size - inter)
}

/** Title matters more than description for duplicates. */
export function similarity(a: Pick<Problem, 'title' | 'description'>, b: Pick<Problem, 'title' | 'description'>): number {
  const t = jaccard(tokens(a.title), tokens(b.title))
  const d = jaccard(tokens(a.description), tokens(b.description))
  return 0.65 * t + 0.35 * d
}

export interface SimilarMatch {
  problem: Problem
  score: number
}

export function findSimilar(
  candidate: Pick<Problem, 'title' | 'description'> & { id?: string },
  pool: Problem[],
  { threshold = 0.22, limit = 5 } = {},
): SimilarMatch[] {
  return pool
    .filter((p) => p.id !== candidate.id && p.status !== 'removed')
    .map((p) => ({ problem: p, score: similarity(candidate, p) }))
    .filter((m) => m.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/** Related = similar text, boosted when in the same industry. */
export function relatedProblems(problem: Problem, pool: Problem[], limit = 4): Problem[] {
  return pool
    .filter((p) => p.id !== problem.id && p.status === 'published')
    .map((p) => ({ p, s: similarity(problem, p) + (p.industry === problem.industry ? 0.15 : 0) }))
    .filter((x) => x.s > 0.12)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p)
}

/** Candidate duplicate pairs for moderators, among non-removed, non-duplicate problems. */
export function duplicatePairs(pool: Problem[], threshold = 0.3): Array<{ a: Problem; b: Problem; score: number }> {
  const live = pool.filter((p) => p.status === 'published' || p.status === 'pending')
  const out: Array<{ a: Problem; b: Problem; score: number }> = []
  for (let i = 0; i < live.length; i++)
    for (let j = i + 1; j < live.length; j++) {
      const score = similarity(live[i], live[j])
      if (score >= threshold) out.push({ a: live[i], b: live[j], score })
    }
  return out.sort((x, y) => y.score - x.score)
}
