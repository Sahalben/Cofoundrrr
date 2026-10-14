import { Container, Button, cx } from '../../../components/ui'
import { Link, useRoute } from '../../../lib/router'
import { DEMO_USERS, useCurrentUser, setCurrentUser } from '../../../lib/demoSession'
import { useProblemBoxRepo } from '../data/context'

export function ProblemBoxHeader() {
  const currentPath = useRoute()
  const currentUser = useCurrentUser()
  const repo = useProblemBoxRepo()
  const openReportsCount = repo.getReports().filter((r) => r.status === 'open').length

  return (
    <header className="border-b border-line bg-white">
      {/* Demo identity switcher banner */}
      <div className="border-b border-line/60 bg-mist/90 px-4 py-1.5 text-[0.6875rem] text-ink/70">
        <Container className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-forest">Demo Identity Switcher:</span>
            <span>Test 1-vote-per-user &amp; moderation rules:</span>
            <div className="flex items-center gap-1">
              {DEMO_USERS.map((u) => {
                const active = currentUser?.id === u.id
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setCurrentUser(u.id)}
                    className={cx(
                      'rounded-[4px] px-2 py-0.5 font-medium transition-colors',
                      active
                        ? 'bg-forest text-mist'
                        : 'bg-white text-ink/75 hover:bg-mint/80 border border-line',
                    )}
                  >
                    {u.displayName} ({u.role})
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset Problem Box to original seed dataset?')) {
                  repo.resetToSeed()
                }
              }}
              className="text-ink/50 underline hover:text-ink"
            >
              Reset Seed Data
            </button>
            <a href="#top" className="text-forest font-medium hover:underline">
              &larr; Back to Landing Page
            </a>
          </div>
        </Container>
      </div>

      {/* Main Problem Box navigation */}
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/problems" className="flex items-center gap-2.5 text-forest">
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="12" cy="16" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="20" cy="16" r="7.5" fill="none" stroke="currentColor" strokeOpacity=".4" strokeWidth="2.5" />
            </svg>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold tracking-tight">Cofoundrrr</span>
              <span className="rounded-[4px] bg-forest px-1.5 py-0.5 text-[0.6875rem] font-semibold text-mist uppercase tracking-wide">
                Problem Box
              </span>
            </div>
          </Link>

          <nav aria-label="Problem Box Navigation" className="hidden items-center gap-5 sm:flex">
            <Link
              to="/problems"
              className={cx(
                'text-xs font-semibold uppercase tracking-wider transition-colors',
                currentPath === '/problems'
                  ? 'text-forest border-b-2 border-forest pb-0.5'
                  : 'text-ink/60 hover:text-forest',
              )}
            >
              Directory
            </Link>

            <Link
              to="/problems/moderation"
              className={cx(
                'inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                currentPath === '/problems/moderation'
                  ? 'text-forest border-b-2 border-forest pb-0.5'
                  : 'text-ink/60 hover:text-forest',
              )}
            >
              <span>Moderation</span>
              {openReportsCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[0.625rem] text-mist font-bold">
                  {openReportsCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button href="#/problems/submit" size="md">
            + Submit Problem
          </Button>
        </div>
      </Container>
    </header>
  )
}
