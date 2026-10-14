import { Link } from '../../../lib/router'
import type { SimilarMatch } from '../domain/similarity'

export function DuplicateWarning({ matches }: { matches: SimilarMatch[] }) {
  if (!matches.length) return null

  return (
    <div className="rounded-[8px] border border-amber-300 bg-amber-50/70 p-4 text-xs text-amber-950">
      <div className="flex items-center gap-1.5 font-bold text-amber-900">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z"/>
        </svg>
        <span>Similar Problem Statements Already Exist</span>
      </div>

      <p className="mt-1 text-amber-900/80">
        To prevent fragmenting community validation, please review existing statements before posting a duplicate:
      </p>

      <ul className="mt-2.5 divide-y divide-amber-200/60 border-y border-amber-200/60">
        {matches.map(({ problem, score }) => (
          <li key={problem.id} className="py-2">
            <Link
              to={`/problems/${problem.id}`}
              className="font-semibold text-forest underline hover:text-ink"
            >
              [{problem.ref}] {problem.title}
            </Link>
            <div className="mt-0.5 flex items-center gap-2 text-[0.6875rem] text-amber-900/70">
              <span>Similarity match: {Math.round(score * 100)}%</span>
              <span>&bull;</span>
              <span>{problem.industry}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
