/**
 * Input handling for untrusted user content.
 *
 * Rendering safety comes from React's text escaping (we never use
 * dangerouslySetInnerHTML). These helpers normalise and bound input, and
 * restrict links to http(s). The same rules must be enforced server-side.
 */

export const LIMITS = {
  title: { min: 12, max: 140 },
  description: { min: 80, max: 5000 },
  affectedAudience: { min: 3, max: 300 },
  existingWorkarounds: { min: 0, max: 2000 },
  evidenceLabel: { min: 2, max: 120 },
  evidenceNote: { min: 0, max: 500 },
  evidenceCount: 5,
  validationNote: { min: 0, max: 280 },
  comment: { min: 2, max: 2000 },
  reportDetails: { min: 0, max: 1000 },
  moderationNote: { min: 0, max: 500 },
} as const

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g

/** Strips control/bidi characters, normalises whitespace, trims and truncates. */
export function cleanText(input: unknown, max: number, { multiline = false } = {}): string {
  if (typeof input !== 'string') return ''
  let s = input.normalize('NFC').replace(/\r\n?/g, '\n').replace(CONTROL, '')
  if (multiline) {
    s = s
      .split('\n')
      .map((l) => l.replace(/[ \t]+/g, ' ').trimEnd())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
  } else {
    s = s.replace(/\s+/g, ' ')
  }
  s = s.trim()
  return s.length > max ? s.slice(0, max).trimEnd() : s
}

/** Returns a normalised http(s) URL, or null for anything else (javascript:, data:, etc). */
export function safeUrl(input: unknown): string | null {
  if (typeof input !== 'string' || !input.trim()) return null
  try {
    const u = new URL(input.trim())
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    if (u.username || u.password) return null
    return u.toString()
  } catch {
    return null
  }
}

export function lengthError(value: string, field: string, { min, max }: { min: number; max: number }): string | null {
  if (value.length < min) return min === 1 ? `${field} is required.` : `${field} must be at least ${min} characters.`
  if (value.length > max) return `${field} must be at most ${max} characters.`
  return null
}
