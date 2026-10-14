import { describe, it, expect } from 'vitest'
import { sortProblems, queryDirectory } from '../directory'
import type { Problem, Validation } from '../types'

describe('directory querying and ranking integrity', () => {
  const baseProblem: Omit<Problem, 'id' | 'ref' | 'title' | 'createdAt' | 'industry' | 'severity'> = {
    description: 'Detailed description exceeding length requirements for testing purposes.',
    affectedAudience: 'Testing audience',
    existingWorkarounds: '',
    evidence: [],
    submitterId: 'sub-1',
    updatedAt: '2026-01-01T00:00:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: null,
  }

  const p1: Problem = { ...baseProblem, id: 'p1', ref: 'PB-0001', title: 'Problem One', createdAt: '2026-01-01T00:00:00Z', industry: 'Healthcare', severity: 2 }
  const p2: Problem = { ...baseProblem, id: 'p2', ref: 'PB-0002', title: 'Problem Two', createdAt: '2026-01-02T00:00:00Z', industry: 'Agriculture', severity: 5 }
  const p3: Problem = { ...baseProblem, id: 'p3', ref: 'PB-0003', title: 'Problem Three', createdAt: '2026-01-03T00:00:00Z', industry: 'Healthcare', severity: 4 }

  it('ranks by validated using lexicographic order (direct > observed > interest) rather than plain vote count sum', () => {
    // Problem 1 has 1 direct validation and 0 interest
    // Problem 2 has 0 direct, 0 observed, but 10 general interest votes
    // Integrity requirement: General interest must NEVER outrank direct personal experience
    const validations: Validation[] = [
      { problemId: 'p1', userId: 'u1', kind: 'direct', severity: 3, note: '', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      ...Array.from({ length: 10 }, (_, i) => ({
        problemId: 'p2',
        userId: `interest-user-${i}`,
        kind: 'interest' as const,
        severity: null,
        note: '',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      })),
    ]

    const sorted = sortProblems([p2, p1], validations, 'validated')
    expect(sorted[0].id).toBe('p1') // p1 wins because it has direct experience, even though p2 has 10 votes
  })

  it('filters directory by industry and search query', () => {
    const validations: Validation[] = []
    const res = queryDirectory(
      [p1, p2, p3],
      validations,
      () => 'organization',
      () => 'Org Name',
      { industry: 'Healthcare', q: 'Three' },
    )

    expect(res.total).toBe(1)
    expect(res.items[0].id).toBe('p3')
  })

  it('sorts by most severe using effective severity (community experience median then submitter rating)', () => {
    const validations: Validation[] = [
      // p1 had submitter severity 2, but 3 community members with direct experience rated it 5
      { problemId: 'p1', userId: 'u1', kind: 'direct', severity: 5, note: '', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      { problemId: 'p1', userId: 'u2', kind: 'direct', severity: 5, note: '', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      { problemId: 'p1', userId: 'u3', kind: 'observed', severity: 5, note: '', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    ]

    // p2 has submitter rating 5, p1 now has community median 5, p3 has submitter 4
    const sorted = sortProblems([p3, p1, p2], validations, 'severe')
    expect(sorted[2].id).toBe('p3') // lowest severity
  })
})
