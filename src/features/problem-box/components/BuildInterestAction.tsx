import { useState } from 'react'
import { cx } from '../../../components/ui'
import { useProblemBoxRepo } from '../data/context'
import { useCurrentUser } from '../../../lib/demoSession'

export function BuildInterestAction({
  problemId,
  className,
}: {
  problemId: string
  className?: string
}) {
  const repo = useProblemBoxRepo()
  const currentUser = useCurrentUser()
  const [justToggled, setJustToggled] = useState(false)

  const interestList = repo.getBuildInterest(problemId)
  const isCommitted = currentUser ? repo.hasBuildInterest(problemId, currentUser.id) : false
  const count = interestList.length

  const handleToggle = () => {
    if (!currentUser) return
    repo.toggleBuildInterest(problemId, currentUser.id)
    setJustToggled(true)
    setTimeout(() => setJustToggled(false), 2000)
  }

  return (
    <div
      className={cx(
        'flex flex-col gap-3 rounded-[8px] border border-line bg-mist/60 p-5 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-forest" />
          <h4 className="text-sm font-semibold text-forest">Build This Problem</h4>
        </div>
        <p className="mt-1 text-xs text-ink/70">
          Signal intent to develop a startup or project tackling this problem. Connect with co-builders in Cofoundrrr.
        </p>
        <p className="mt-1.5 text-[0.6875rem] text-ink/50">
          {count === 0
            ? 'No members registered yet. Be the first to start building.'
            : `${count} member${count === 1 ? '' : 's'} registered intent to build a solution.`}
        </p>
      </div>

      <div className="flex flex-col items-start gap-1 sm:items-end">
        <button
          type="button"
          onClick={handleToggle}
          disabled={!currentUser}
          className={cx(
            'inline-flex items-center gap-2 rounded-[6px] px-4 py-2 text-xs font-semibold tracking-[-0.01em] transition-all',
            isCommitted
              ? 'bg-forest text-mist'
              : 'border border-forest/30 bg-white text-forest hover:bg-mint',
            !currentUser && 'cursor-not-allowed opacity-50',
          )}
        >
          {isCommitted ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 6.5L4.5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Registered to Build
            </>
          ) : (
            <>
              <span>+</span> Register to Build
            </>
          )}
        </button>

        {justToggled && (
          <span className="text-[0.625rem] text-forest font-medium">
            {isCommitted ? 'Intent recorded in project matching queue' : 'Removed from builder queue'}
          </span>
        )}
      </div>
    </div>
  )
}
