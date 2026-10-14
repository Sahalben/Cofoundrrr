import { useSyncExternalStore } from 'react'

export type SurfaceTheme = 'auto' | 'dark' | 'light'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribe(onChange: () => void) {
  if (typeof window === 'undefined') return () => {}
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  const mq = window.matchMedia(DARK_QUERY)
  mq.addEventListener('change', onChange)
  return () => {
    observer.disconnect()
    mq.removeEventListener('change', onChange)
  }
}

function read(): 'dark' | 'light' {
  if (typeof document === 'undefined') return 'dark'
  const list = document.documentElement.classList
  if (list.contains('dark')) return 'dark'
  if (list.contains('light')) return 'light'
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

const onServer = () => 'dark' as const

export function useSurfaceTheme(theme: SurfaceTheme = 'auto'): 'dark' | 'light' {
  const resolved = useSyncExternalStore(subscribe, read, onServer)
  return theme === 'auto' ? resolved : theme
}
