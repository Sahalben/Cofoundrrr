import { describe, it, expect } from 'vitest'
import { cleanText, safeUrl, lengthError } from '../sanitize'

describe('sanitize input utilities', () => {
  it('cleans text and normalises spacing', () => {
    const raw = '  Problem   with    spaces\n\n\nand   multiple   newlines  '
    const cleaned = cleanText(raw, 100, { multiline: true })
    expect(cleaned).toBe('Problem with spaces\n\nand multiple newlines')
  })

  it('strips hidden control and bidi characters', () => {
    const dirty = 'Safe\u200BText\u202Ereversed'
    const cleaned = cleanText(dirty, 50)
    expect(cleaned).toBe('SafeTextreversed')
  })

  it('validates safe http/https URLs strictly and rejects bad schemes', () => {
    expect(safeUrl('https://sih.gov.in')).toBe('https://sih.gov.in/')
    expect(safeUrl('http://example.org/doc.pdf')).toBe('http://example.org/doc.pdf')
    expect(safeUrl('javascript:alert(1)')).toBeNull()
    expect(safeUrl('data:text/html,bad')).toBeNull()
    expect(safeUrl('not-a-url')).toBeNull()
    expect(safeUrl('https://user:pass@evil.com')).toBeNull()
  })

  it('checks length constraints accurately', () => {
    expect(lengthError('ab', 'Title', { min: 3, max: 10 })).toBe('Title must be at least 3 characters.')
    expect(lengthError('12345678901', 'Title', { min: 3, max: 10 })).toBe('Title must be at most 10 characters.')
    expect(lengthError('Valid', 'Title', { min: 3, max: 10 })).toBeNull()
  })
})
