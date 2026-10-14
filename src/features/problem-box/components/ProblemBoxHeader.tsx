import { Container, Button, cx } from '../../../components/ui'
import { Link, useRoute } from '../../../lib/router'
import { useProblemBoxRepo } from '../data/context'

export function ProblemBoxHeader() {
  const currentPath = useRoute()
  const repo = useProblemBoxRepo()
  const openReportsCount = repo.getReports().filter((r) => r.status === 'open').length

  return (
    <header className="border-b border-line bg-white sticky top-0 z-30">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-5 sm:gap-7">
          <Link to="/problems" className="flex items-center gap-2.5 text-forest shrink-0">
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

          <nav aria-label="Problem Box Navigation" className="flex items-center gap-4 sm:gap-6">
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

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-ink/75 hover:bg-mint/50 hover:text-forest transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
              <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="hidden xs:inline">Back to Home</span>
            <span className="xs:hidden">Home</span>
          </a>
          <span className="h-4 w-px bg-line/80 shrink-0" aria-hidden="true" />
          <Button href="#/problems/submit" size="md" className="whitespace-nowrap text-xs sm:text-sm">
            + Submit Problem
          </Button>
        </div>
      </Container>
    </header>
  )
}
