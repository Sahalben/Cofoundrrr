import { describe, it, expect } from 'vitest'
import {
  upsertValidation,
  removeValidation,
  breakdownFor,
  communitySeverity,
} from '../validation'
import type { Validation } from '../types'

describe('validation domain rules', () => {
  it('enforces one validation per user per problem and updates existing', () => {
    let list: Validation[] = []

    list = upsertValidation(list, {
      problemId: 'p1',
      userId: 'user-1',
      kind: 'interest',
    })
    expect(list).toHaveLength(1)
    expect(list[0].kind).toBe('interest')
    expect(list[0].severity).toBeNull()

    // Same user updates to direct experience with severity
    list = upsertValidation(list, {
      problemId: 'p1',
      userId: 'user-1',
      kind: 'direct',
      severity: 4,
      note: 'Happened to my farm last harvest',
    })
    expect(list).toHaveLength(1)
    expect(list[0].kind).toBe('direct')
    expect(list[0].severity).toBe(4)
    expect(list[0].note).toBe('Happened to my farm last harvest')

    // Different user adds validation
    list = upsertValidation(list, {
      problemId: 'p1',
      userId: 'user-2',
      kind: 'observed',
      severity: 3,
    })
    expect(list).toHaveLength(2)

    // User 1 cannot vote twice on the same problem
    expect(list.filter((v) => v.userId === 'user-1')).toHaveLength(1)
  })

  it('discards severity rating if kind is general interest', () => {
    const list = upsertValidation([], {
      problemId: 'p1',
      userId: 'user-1',
      kind: 'interest',
      severity: 5, // should be ignored
    })
    expect(list[0].severity).toBeNull()
  })

  it('correctly calculates breakdown separating experience from interest', () => {
    let list: Validation[] = []
    list = upsertValidation(list, { problemId: 'p1', userId: 'u1', kind: 'direct' })
    list = upsertValidation(list, { problemId: 'p1', userId: 'u2', kind: 'direct' })
    list = upsertValidation(list, { problemId: 'p1', userId: 'u3', kind: 'observed' })
    list = upsertValidation(list, { problemId: 'p1', userId: 'u4', kind: 'interest' })
    list = upsertValidation(list, { problemId: 'p2', userId: 'u1', kind: 'interest' })

    const b = breakdownFor(list, 'p1')
    expect(b.direct).toBe(2)
    expect(b.observed).toBe(1)
    expect(b.interest).toBe(1)
    expect(b.respondents).toBe(4)
  })

  it('calculates median community severity from experience-based validations only', () => {
    let list: Validation[] = []
    list = upsertValidation(list, { problemId: 'p1', userId: 'u1', kind: 'direct', severity: 2 })
    list = upsertValidation(list, { problemId: 'p1', userId: 'u2', kind: 'observed', severity: 4 })
    list = upsertValidation(list, { problemId: 'p1', userId: 'u3', kind: 'direct', severity: 5 })

    const res = communitySeverity(list, 'p1')
    expect(res).not.toBeNull()
    expect(res?.median).toBe(4)
    expect(res?.count).toBe(3)
  })

  it('removes validation when requested', () => {
    let list: Validation[] = [
      {
        problemId: 'p1',
        userId: 'u1',
        kind: 'direct',
        severity: 3,
        note: '',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ]
    list = removeValidation(list, 'p1', 'u1')
    expect(list).toHaveLength(0)
  })
})
