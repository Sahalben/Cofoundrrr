import { describe, it, expect } from 'vitest'
import { tokens, similarity, findSimilar } from '../similarity'
import type { Problem } from '../types'

describe('similarity and duplicate detection', () => {
  it('tokenizes text stripping stop words and punctuation', () => {
    const t = tokens('How to manage crop residue and stubble burning in Punjab farms?')
    expect(t.has('crop')).toBe(true)
    expect(t.has('residue')).toBe(true)
    expect(t.has('stubble')).toBe(true)
    expect(t.has('burn')).toBe(true) // stemmed from burning
    expect(t.has('how')).toBe(false) // stop word
    expect(t.has('and')).toBe(false) // stop word
  })

  it('detects strong similarity between duplicate problem statements', () => {
    const p1 = {
      title: 'Real-time monitoring of crop residue and stubble burning in fields',
      description: 'Farmers burning paddy crop residue and stubble causes severe air pollution and smog.',
    }
    const p2 = {
      title: 'Automated satellite detection of crop residue and stubble burning',
      description: 'Farmers burning crop residue and stubble produce toxic smoke and smog across rural lands.',
    }
    const p3 = {
      title: 'Cold chain temperature tracking for vaccine vials',
      description: 'Lack of continuous monitoring causes spoilage of vaccine stock in rural health centers.',
    }

    const sim12 = similarity(p1, p2)
    const sim13 = similarity(p1, p3)

    expect(sim12).toBeGreaterThan(0.25)
    expect(sim13).toBeLessThan(0.05)
  })

  it('findSimilar identifies top matches from candidate pool', () => {
    const pool: Problem[] = [
      {
        id: 'p1',
        ref: 'PB-0001',
        title: 'Non-invasive cattle identification using muzzle print biometrics',
        description: 'Traditional ear tags cause physical injury and detach. Muzzle prints provide unique identification.',
        affectedAudience: 'Dairy farmers',
        industry: 'Fisheries & Livestock',
        severity: 3,
        existingWorkarounds: '',
        evidence: [],
        submitterId: 'sub-1',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        status: 'published',
        duplicateOfId: null,
        moderationNote: '',
        source: null,
      },
      {
        id: 'p2',
        ref: 'PB-0002',
        title: 'Biometric identification of dairy cattle without ear tags',
        description: 'Need image processing solution for unique cow identity using facial or muzzle recognition.',
        affectedAudience: 'Livestock officers',
        industry: 'Fisheries & Livestock',
        severity: 3,
        existingWorkarounds: '',
        evidence: [],
        submitterId: 'sub-2',
        createdAt: '2026-01-02T00:00:00Z',
        updatedAt: '2026-01-02T00:00:00Z',
        status: 'published',
        duplicateOfId: null,
        moderationNote: '',
        source: null,
      },
    ]

    const matches = findSimilar(
      {
        title: 'Cattle identification and muzzle biometric recognition',
        description: 'A way to identify cows without painful ear tags.',
      },
      pool,
    )

    expect(matches.length).toBeGreaterThan(0)
    expect(matches[0].problem.id).toBe('p1')
  })
})
