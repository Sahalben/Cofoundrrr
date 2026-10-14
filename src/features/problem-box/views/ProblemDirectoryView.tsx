import { useState, useMemo } from 'react'
import { Container, cx } from '../../../components/ui'
import { Link } from '../../../lib/router'
import { useProblemBoxState } from '../data/context'
import { queryDirectory, effectiveSeverity } from '../domain/directory'
import { breakdownFor } from '../domain/validation'
import {
  INDUSTRIES,
  SORTS,
  type Industry,
  type SortKey,
  type SubmitterKind,
  type Severity,
} from '../domain/types'
import { SeverityBadge } from '../components/SeverityBadge'
import { SubmitterBadge } from '../components/SubmitterBadge'
import { ValidationBreakdown } from '../components/ValidationBreakdown'

export function ProblemDirectoryView() {
  const state = useProblemBoxState()

  const [q, setQ] = useState('')
  const [industry, setIndustry] = useState<Industry | 'all'>('all')
  const [minSeverity, setMinSeverity] = useState<Severity | null>(null)
  const [submitterKind, setSubmitterKind] = useState<SubmitterKind | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('validated')
  const [page, setPage] = useState(1)

  const submitterMap = useMemo(
    () => new Map(state.submitters.map((s) => [s.id, s])),
    [state.submitters],
  )

  const result = useMemo(() => {
    return queryDirectory(
      state.problems,
      state.validations,
      (p) => submitterMap.get(p.submitterId)?.kind ?? 'individual',
      (p) => submitterMap.get(p.submitterId)?.displayName ?? '',
      {
        q,
        industry,
        minSeverity,
        submitterKind,
        sort,
        page,
        pageSize: 6,
      },
    )
  }, [state.problems, state.validations, submitterMap, q, industry, minSeverity, submitterKind, sort, page])

  return (
    <div className="min-h-screen bg-mist/40 pb-24">
      {/* Editorial Header */}
      <section className="border-b border-line bg-white py-12">
        <Container>
          <div className="max-w-2xl">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-forest/70">
              Wiki &amp; Discovery Repository
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-forest sm:text-4xl">
              Real-World Problem Directory
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              A community-curated, verified repository of high-friction real-world problems submitted by citizens,
              enterprises, and public institutions. Transparently validated without synthetic vanity metrics.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Search & Filters Bar */}
      <section className="border-b border-line bg-white py-4">
        <Container>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setPage(1)
                }}
                placeholder="Search problems by keyword, audience, ref, or ministry..."
                className="w-full rounded-[6px] border border-line bg-mist/40 px-3.5 py-2 text-xs text-ink placeholder:text-ink/40 focus:border-forest focus:bg-white focus:outline-none"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => {
                    setQ('')
                    setPage(1)
                  }}
                  className="absolute right-3 top-2 text-xs text-ink/40 hover:text-ink"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Selects */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Industry Filter */}
              <select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value as Industry | 'all')
                  setPage(1)
                }}
                className="rounded-[6px] border border-line bg-white px-2.5 py-1.5 text-xs text-ink focus:border-forest focus:outline-none"
              >
                <option value="all">All Industries</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>

              {/* Submitter Kind Filter */}
              <select
                value={submitterKind}
                onChange={(e) => {
                  setSubmitterKind(e.target.value as SubmitterKind | 'all')
                  setPage(1)
                }}
                className="rounded-[6px] border border-line bg-white px-2.5 py-1.5 text-xs text-ink focus:border-forest focus:outline-none"
              >
                <option value="all">All Submitters</option>
                <option value="organization">Organizations</option>
                <option value="public-source">Public Problem Banks (SIH / KSUM)</option>
                <option value="individual">Community Members</option>
              </select>

              {/* Min Severity */}
              <select
                value={minSeverity ?? ''}
                onChange={(e) => {
                  const val = e.target.value ? (Number(e.target.value) as Severity) : null
                  setMinSeverity(val)
                  setPage(1)
                }}
                className="rounded-[6px] border border-line bg-white px-2.5 py-1.5 text-xs text-ink focus:border-forest focus:outline-none"
              >
                <option value="">Any Severity</option>
                <option value="3">Severity Lv.3+ (Significant)</option>
                <option value="4">Severity Lv.4+ (Severe)</option>
                <option value="5">Severity Lv.5 (Critical)</option>
              </select>
            </div>
          </div>

          {/* Ranking Sort Tabs */}
          <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-line/60 pt-3">
            <span className="mr-2 text-[0.6875rem] font-bold uppercase tracking-wider text-ink/50">
              Rank By:
            </span>
            {(Object.entries(SORTS) as [SortKey, typeof SORTS[SortKey]][]).map(([key, info]) => {
              const active = sort === key
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => {
                    setSort(key)
                    setPage(1)
                  }}
                  title={info.explainer}
                  className={cx(
                    'rounded-[4px] px-2.5 py-1 text-xs font-semibold transition-colors',
                    active
                      ? 'bg-forest text-mist'
                      : 'bg-transparent text-ink/70 hover:bg-mist hover:text-forest',
                  )}
                >
                  {info.label}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-[0.6875rem] text-ink/50 italic">
            {SORTS[sort].explainer}
          </p>
        </Container>
      </section>

      {/* Directory Content List */}
      <Container className="mt-8">
        <div className="flex items-center justify-between pb-4 text-xs text-ink/60">
          <span>
            Showing <strong className="font-semibold text-forest">{result.items.length}</strong> of{' '}
            <strong className="font-semibold text-forest">{result.total}</strong> validated problem statements
          </span>
          {result.pageCount > 1 && (
            <span>
              Page {result.page} of {result.pageCount}
            </span>
          )}
        </div>

        {result.items.length === 0 ? (
          <div className="rounded-[8px] border border-line bg-white p-12 text-center">
            <p className="text-base font-semibold text-forest">No matching problem statements found</p>
            <p className="mt-1 text-xs text-ink/60">
              Try adjusting your search query, industry filter, or severity threshold.
            </p>
            <div className="mt-5">
              <Link
                to="/problems/submit"
                className="inline-flex items-center rounded-[6px] bg-forest px-4 py-2 text-xs font-medium text-mist hover:bg-forest-deep"
              >
                + Submit the first statement for this topic
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {result.items.map((problem) => {
              const submitter = submitterMap.get(problem.submitterId)
              const breakdown = breakdownFor(state.validations, problem.id)
              const sev = effectiveSeverity(problem, state.validations)
              const commentCount = state.comments.filter(
                (c) => c.problemId === problem.id && c.status === 'visible',
              ).length
              const buildCount = state.buildInterest.filter((b) => b.problemId === problem.id).length

              return (
                <article
                  key={problem.id}
                  className="group rounded-[8px] border border-line bg-white p-6 shadow-card transition-all hover:border-forest/40 hover:shadow-float"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-forest/70">{problem.ref}</span>
                      <span className="rounded-[4px] bg-mist px-2 py-0.5 text-[0.6875rem] font-medium text-ink/70">
                        {problem.industry}
                      </span>
                      <SeverityBadge severity={sev} />
                    </div>

                    <SubmitterBadge submitter={submitter} source={problem.source} />
                  </div>

                  <h3 className="mt-3 text-lg font-bold tracking-tight text-forest">
                    <Link
                      to={`/problems/${problem.id}`}
                      className="hover:underline underline-offset-2"
                    >
                      {problem.title}
                    </Link>
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-ink/80 line-clamp-3">
                    {problem.description}
                  </p>

                  <div className="mt-3 text-[0.75rem] text-ink/65">
                    <span className="font-medium text-ink/80">Affected Audience: </span>
                    {problem.affectedAudience}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4">
                    {/* Separation of direct vs observed vs interest */}
                    <ValidationBreakdown breakdown={breakdown} compact />

                    <div className="flex items-center gap-4 text-[0.75rem] text-ink/55">
                      {buildCount > 0 && (
                        <span className="font-medium text-forest">
                          {buildCount} builder{buildCount === 1 ? '' : 's'} registered
                        </span>
                      )}
                      <span>
                        {commentCount} discussion{commentCount === 1 ? '' : 's'}
                      </span>
                      <Link
                        to={`/problems/${problem.id}`}
                        className="font-bold text-forest underline hover:text-ink"
                      >
                        Explore Details &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {result.pageCount > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={result.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-[6px] border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink disabled:opacity-40"
            >
              &larr; Previous
            </button>
            <span className="text-xs text-ink/60 px-2">
              Page {result.page} of {result.pageCount}
            </span>
            <button
              type="button"
              disabled={result.page >= result.pageCount}
              onClick={() => setPage((p) => Math.min(result.pageCount, p + 1))}
              className="rounded-[6px] border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink disabled:opacity-40"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </Container>
    </div>
  )
}
