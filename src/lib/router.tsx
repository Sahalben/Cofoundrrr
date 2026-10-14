import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

/**
 * Minimal hash router (no dependency).
 *
 * Only hashes that start with "#/" are treated as routes. Plain anchors such as
 * "#pathways" keep working as in-page links on the landing page.
 */

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getHash = () => window.location.hash

export function routeFromHash(hash: string): string {
  return hash.startsWith('#/') ? hash.slice(1).split('?')[0] || '/' : '/'
}

/** Returns the current route path, e.g. "/problems/pb-0003". */
export function useRoute(): string {
  const hash = useSyncExternalStore(subscribe, getHash, () => '')
  return routeFromHash(hash)
}

/** Returns the current non-route anchor (e.g. "pathways"), if any. */
export function useAnchor(): string | null {
  const hash = useSyncExternalStore(subscribe, getHash, () => '')
  return hash && !hash.startsWith('#/') ? hash.slice(1) : null
}

export function navigate(path: string) {
  window.location.hash = path.startsWith('#') ? path : `#${path}`
}

/** Matches "/problems/:id" style patterns. Returns params or null. */
export function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean)
  const a = path.split('/').filter(Boolean)
  if (p.length !== a.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(a[i])
    else if (p[i] !== a[i]) return null
  }
  return params
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }

/** Route link. Scrolls to the top on navigation, like a normal page change. */
export function Link({ to, onClick, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && e.button === 0) {
      window.scrollTo({ top: 0 })
    }
  }
  return <a href={`#${to}`} onClick={handle} {...rest} />
}
