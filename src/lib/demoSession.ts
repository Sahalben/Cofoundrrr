import { useSyncExternalStore } from 'react'

/**
 * DEMO IDENTITY — NOT AUTHENTICATION.
 *
 * Cofoundrrr has no auth backend yet. This module provides a small set of
 * clearly-labelled demo identities so features that depend on "who is acting"
 * (one validation per user, authorship, moderator permissions) can be
 * exercised in the browser. Replace with the real auth provider's session.
 */

export type Role = 'member' | 'moderator'

export interface DemoUser {
  id: string
  displayName: string
  initials: string
  role: Role
}

export const DEMO_USERS: DemoUser[] = [
  { id: 'demo-member-a', displayName: 'Demo Member A', initials: 'MA', role: 'member' },
  { id: 'demo-member-b', displayName: 'Demo Member B', initials: 'MB', role: 'member' },
  { id: 'demo-moderator', displayName: 'Demo Moderator', initials: 'DM', role: 'moderator' },
]

const KEY = 'cofoundrrr.demoSession.v1'
const listeners = new Set<() => void>()

function read(): string | null {
  try {
    const v = localStorage.getItem(KEY)
    if (v === null) return DEMO_USERS[0].id
    return v === '' ? null : v
  } catch {
    return DEMO_USERS[0].id
  }
}

let currentId: string | null = typeof window === 'undefined' ? null : read()

export function setCurrentUser(id: string | null) {
  currentId = id
  try {
    localStorage.setItem(KEY, id ?? '')
  } catch {
    /* storage unavailable — keep in memory */
  }
  listeners.forEach((l) => l())
}

export function getCurrentUser(): DemoUser | null {
  return DEMO_USERS.find((u) => u.id === currentId) ?? null
}

export function useCurrentUser(): DemoUser | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    getCurrentUser,
    () => null,
  )
}
