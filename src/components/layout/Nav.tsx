import { useEffect, useState } from 'react'
import { Button, Container, cx } from '../ui'
import { MetalButton } from '../spectrumui'

export const navLinks = [
  { href: '#problem', label: 'Why' },
  { href: '#pathways', label: 'Pathways' },
  { href: '#discovery', label: 'Discovery' },
  { href: '#problem-box', label: 'Problem Box' },
  { href: '#journey', label: 'Ecosystem' },
  { href: '#programs', label: 'Programs' },
]

/** Sections with a dark background. The nav flips to light text over these. */
const DARK_SECTIONS = new Set(['top', 'problem', 'pathways', 'profiles', 'discovery', 'problem-box', 'journey', 'programs', 'join'])
const NAV_PROBE_Y = 36 // vertical centre of the 72px nav

type NavTheme = 'light' | 'dark' // describes the background beneath the nav

export function Wordmark({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const fg = tone === 'dark' ? 'text-forest' : 'text-mist'
  return (
    <a href="#top" id="nav-wordmark" className={cx('flex items-center gap-2.5 transition-colors duration-300', fg)} aria-label="Cofoundrrr home">
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
        <circle cx="12" cy="16" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="20" cy="16" r="7.5" fill="none" stroke="currentColor" strokeOpacity=".4" strokeWidth="2.5" />
      </svg>
      <span className="text-[1.1875rem] font-semibold tracking-[-0.045em]">
        Cofound<span className="opacity-45">rrr</span>
      </span>
    </a>
  )
}

/** Determines whether the section currently behind the nav is dark or light. */
function useNavTheme(): NavTheme {
  const [theme, setTheme] = useState<NavTheme>('dark')
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const blocks = document.querySelectorAll<HTMLElement>('main > section, footer')
      for (const el of blocks) {
        const r = el.getBoundingClientRect()
        if (r.top <= NAV_PROBE_Y && r.bottom > NAV_PROBE_Y) {
          const dark = el.tagName === 'FOOTER' || DARK_SECTIONS.has(el.id)
          setTheme(dark ? 'dark' : 'light')
          return
        }
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return theme
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const theme = useNavTheme()
  const onDark = theme === 'dark'

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container className="flex h-[72px] items-center justify-between">
        <Wordmark tone={onDark ? 'light' : 'dark'} />
        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              id={`nav-link-${l.href.slice(1)}`}
              className={cx(
                'text-[0.8125rem] font-medium uppercase tracking-[0.1em] transition-colors duration-300',
                onDark ? 'text-mist/75 hover:text-mist' : 'text-forest/75 hover:text-forest',
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex">
            <MetalButton
              href="#join"
              id="nav-join"
              preset="silver"
              theme={onDark ? 'dark' : 'light'}
              size="sm"
              className={cx(
                'px-4 py-1.5 text-xs font-semibold uppercase tracking-wider',
                onDark
                  ? 'text-mist bg-forest-deep/80 hover:bg-forest-deep'
                  : 'text-forest bg-white/85 hover:bg-white',
              )}
            >
              Join Cofoundrrr
            </MetalButton>
          </div>
          <button
            id="nav-menu-toggle"
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6">
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className={cx(
                    'absolute left-0 h-[1.5px] w-6 transition-all duration-300',
                    onDark ? 'bg-mist' : 'bg-forest',
                    open ? cx('top-1.5', i ? '-rotate-45' : 'rotate-45') : i ? 'top-3' : 'top-0',
                  )}
                />
              ))}
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile menu drawer: frosted glass backdrop with editorial styling */}
      <div
        id="mobile-menu"
        className={cx(
          'overflow-hidden transition-[max-height] duration-500 md:hidden',
          open ? 'max-h-[520px] border-b shadow-2xl' : 'max-h-0',
          onDark
            ? 'bg-[#000000]/95 backdrop-blur-2xl border-white/10 text-mist'
            : 'bg-white/95 backdrop-blur-2xl border-line text-forest',
        )}
      >
        <Container className="flex flex-col py-6">
          <div className={cx('flex flex-col divide-y', onDark ? 'divide-white/10' : 'divide-line')}>
            {navLinks.map((l, idx) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cx(
                  'flex items-center justify-between py-3.5 text-lg font-medium tracking-[-0.02em] transition-colors',
                  onDark ? 'text-mist/90 hover:text-mint' : 'text-forest hover:text-mint',
                )}
              >
                <span>{l.label}</span>
                <span className="text-xs font-mono font-medium text-mint/70">0{idx + 1}</span>
              </a>
            ))}
          </div>
          <div className="pt-6">
            <Button
              href="#join"
              size="lg"
              variant={onDark ? 'light' : 'primary'}
              className="w-full justify-center"
              arrow
              onClick={() => setOpen(false)}
            >
              Join Cofoundrrr
            </Button>
          </div>
        </Container>
      </div>
    </header>
  )
}
