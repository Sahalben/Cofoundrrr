import { useState, useMemo } from 'react'
import { Container, cx } from '../../../components/ui'
import { Link } from '../../../lib/router'
import { useProblemBoxRepo, useProblemBoxState } from '../data/context'
import { useCurrentUser } from '../../../lib/demoSession'
import { duplicatePairs } from '../domain/similarity'

export function ProblemModerationView() {
  const repo = useProblemBoxRepo()
  const state = useProblemBoxState()
  const currentUser = useCurrentUser()

  const [activeTab, setActiveTab] = useState<'reports' | 'duplicates'>('reports')
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({})

  const isModerator = currentUser?.role === 'moderator'

  const reports = repo.getReports()
  const openReports = reports.filter((r) => r.status === 'open')
  const resolvedReports = reports.filter((r) => r.status !== 'open')

  // Candidate duplicate pairs computed across the problem catalog
  const dupPairs = useMemo(() => duplicatePairs(state.problems, 0.2), [state.problems])

  const handleResolve = (reportId: string, status: 'resolved' | 'dismissed') => {
    const note = resolutionNotes[reportId] || (status === 'resolved' ? 'Reviewed and actioned.' : 'Reviewed and dismissed.')
    repo.resolveReport(reportId, note, status)
  }

  const handleMarkDuplicate = (problemId: string, targetDuplicateOfId: string) => {
    if (window.confirm(`Mark ${problemId} as a duplicate of ${targetDuplicateOfId}?`)) {
      repo.markDuplicate(problemId, targetDuplicateOfId)
    }
  }

  const handleSetStatus = (problemId: string, status: 'published' | 'removed') => {
    repo.setProblemStatus(problemId, status, `Moderator action by ${currentUser?.displayName ?? 'Admin'}`)
  }

  return (
    <div className="min-h-screen bg-[#000000] pb-24 text-mist">
      {/* Header */}
      <section className="border-b border-white/10 bg-[#08150E]/80 backdrop-blur-md py-10">
        <Container>
          <div className="max-w-2xl">
            <Link to="/problems" className="text-xs text-mint underline hover:text-mist transition-colors">
              &larr; Back to Problem Directory
            </Link>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-[4px] bg-[#0E261C] border border-mint/30 px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wider text-mint">
                Moderation Queue
              </span>
              <span className="text-xs text-mist/60">Content Integrity &amp; Quality</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-mist">
              Problem Box Moderation
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-mist/70">
              Audit reported entries, triage potential duplicate submissions, and maintain institutional standards.
            </p>
          </div>
        </Container>
      </section>

      {!isModerator && (
        <Container className="mt-6">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4 text-xs text-mist/80">
            <strong className="text-mint">Viewing in Member Mode:</strong> Only users with the Moderator role can resolve reports or merge duplicates.
            Switch your identity to <strong className="font-semibold text-mint">Demo Moderator</strong> using the demo switcher in the top banner.
          </div>
        </Container>
      )}

      {/* Navigation tabs */}
      <Container className="mt-6">
        <div className="flex border-b border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={cx(
              'border-b-2 px-4 py-2 text-xs font-semibold transition-colors',
              activeTab === 'reports'
                ? 'border-mint text-mint'
                : 'border-transparent text-mist/60 hover:text-mist',
            )}
          >
            Reported Content ({openReports.length} Open)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('duplicates')}
            className={cx(
              'border-b-2 px-4 py-2 text-xs font-semibold transition-colors',
              activeTab === 'duplicates'
                ? 'border-mint text-mint'
                : 'border-transparent text-mist/60 hover:text-mist',
            )}
          >
            Duplicate Candidates ({dupPairs.length})
          </button>
        </div>

        {/* Tab 1: Reports */}
        {activeTab === 'reports' && (
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-mint">
                Open Reports ({openReports.length})
              </h3>

              {openReports.length === 0 ? (
                <div className="rounded-[8px] border border-white/10 bg-[#0A120E] p-8 text-center text-xs text-mist/50">
                  No open reports. All flagged content has been reviewed.
                </div>
              ) : (
                openReports.map((r) => {
                  const targetProblem = repo.getProblemById(r.problemId)
                  return (
                    <div
                      key={r.id}
                      className="rounded-[8px] border border-white/10 bg-[#0A120E] p-5 shadow-sm space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="rounded-[4px] bg-[#2B1114] border border-[#FF6B6B]/25 px-2 py-0.5 text-[0.6875rem] font-bold text-[#FF9E9E] uppercase">
                            Reason: {r.reason}
                          </span>
                          <span className="text-xs text-mist/50">Reported on {new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="text-xs font-mono text-mist/60">Reporter: {r.reporterId}</span>
                      </div>

                      {targetProblem && (
                        <div className="rounded-[6px] bg-white/[0.03] border border-white/10 p-3 text-xs">
                          <span className="font-semibold text-mint">Target Statement: </span>
                          <Link
                            to={`/problems/${targetProblem.id}`}
                            className="font-bold underline text-mist hover:text-mint transition-colors"
                          >
                            [{targetProblem.ref}] {targetProblem.title}
                          </Link>
                          <span className="ml-2 rounded-[4px] bg-[#0A120E] px-1.5 py-0.5 text-[0.625rem] text-mist/60 border border-white/10">
                            Status: {targetProblem.status}
                          </span>
                        </div>
                      )}

                      {r.details && (
                        <div className="text-xs text-mist/80">
                          <span className="font-medium text-mist/60">Reporter Details: </span>
                          <span>&ldquo;{r.details}&rdquo;</span>
                        </div>
                      )}

                      {/* Moderator Resolution Action */}
                      {isModerator && (
                        <div className="border-t border-white/10 pt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <input
                            type="text"
                            placeholder="Resolution notes (optional)..."
                            value={resolutionNotes[r.id] ?? ''}
                            onChange={(e) =>
                              setResolutionNotes({ ...resolutionNotes, [r.id]: e.target.value })
                            }
                            className="rounded-[4px] border border-white/15 bg-[#08150E] px-2.5 py-1 text-xs text-mist flex-1 max-w-md focus:border-mint focus:outline-none"
                          />
                          <div className="flex items-center gap-2">
                            {targetProblem && targetProblem.status === 'published' && (
                              <button
                                type="button"
                                onClick={() => handleSetStatus(targetProblem.id, 'removed')}
                                className="rounded-[4px] bg-[#2B1114] border border-[#FF6B6B]/30 px-2.5 py-1 text-xs font-semibold text-[#FF9E9E] hover:bg-[#3D181C] transition-colors"
                              >
                                Remove Statement
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleResolve(r.id, 'dismissed')}
                              className="rounded-[4px] border border-white/15 px-2.5 py-1 text-xs text-mist/70 hover:bg-white/10 transition-colors"
                            >
                              Dismiss Report
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResolve(r.id, 'resolved')}
                              className="rounded-[4px] bg-mint px-3 py-1 text-xs font-bold text-forest-deep hover:bg-mint/90 transition-colors"
                            >
                              Mark Resolved
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Resolved Reports History */}
            {resolvedReports.length > 0 && (
              <div className="mt-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-mist/50">
                  Resolved Reports History ({resolvedReports.length})
                </h4>
                <div className="mt-3 divide-y divide-white/10 rounded-[8px] border border-white/10 bg-[#0A120E]">
                  {resolvedReports.map((r) => (
                    <div key={r.id} className="p-3 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-mint">[{r.targetType}] {r.problemId}</span>
                        <span className="ml-2 text-mist/60">({r.reason})</span>
                        {r.resolutionNote && (
                          <p className="text-[0.6875rem] text-mist/50 mt-0.5">Note: {r.resolutionNote}</p>
                        )}
                      </div>
                      <span className="text-[0.6875rem] uppercase font-bold text-mist/40">
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Duplicate Candidates */}
        {activeTab === 'duplicates' && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-mint">
              Algorithmic Duplicate Candidate Pairs ({dupPairs.length})
            </h3>
            <p className="text-xs text-mist/60">
              Evaluated using title and description token similarity. High overlap indicates opportunities to merge statements.
            </p>

            {dupPairs.length === 0 ? (
              <div className="rounded-[8px] border border-white/10 bg-[#0A120E] p-8 text-center text-xs text-mist/50">
                No high-similarity duplicate pairs detected.
              </div>
            ) : (
              dupPairs.map(({ a, b, score }, idx) => (
                <div
                  key={`${a.id}-${b.id}-${idx}`}
                  className="rounded-[8px] border border-white/10 bg-[#0A120E] p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                    <span className="font-semibold text-mint">
                      Similarity Score: <span className="tabular-nums font-bold font-mono text-mint">{(score * 100).toFixed(0)}%</span>
                    </span>
                    <span className="text-mist/40">Pair candidate #{idx + 1}</span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div className="rounded-[6px] bg-white/[0.03] border border-white/10 p-3">
                      <span className="font-mono font-bold text-mint">{a.ref}</span>
                      <p className="mt-1 font-semibold text-mist">
                        <Link to={`/problems/${a.id}`} className="hover:text-mint hover:underline transition-colors">
                          {a.title}
                        </Link>
                      </p>
                      <p className="mt-1 text-[0.6875rem] text-mist/70 line-clamp-2">{a.description}</p>
                      {isModerator && (
                        <button
                          type="button"
                          onClick={() => handleMarkDuplicate(a.id, b.id)}
                          className="mt-3 text-xs font-semibold text-mint underline hover:text-mist transition-colors"
                        >
                          Mark {a.ref} as duplicate of {b.ref} &rarr;
                        </button>
                      )}
                    </div>

                    <div className="rounded-[6px] bg-white/[0.03] border border-white/10 p-3">
                      <span className="font-mono font-bold text-mint">{b.ref}</span>
                      <p className="mt-1 font-semibold text-mist">
                        <Link to={`/problems/${b.id}`} className="hover:text-mint hover:underline transition-colors">
                          {b.title}
                        </Link>
                      </p>
                      <p className="mt-1 text-[0.6875rem] text-mist/70 line-clamp-2">{b.description}</p>
                      {isModerator && (
                        <button
                          type="button"
                          onClick={() => handleMarkDuplicate(b.id, a.id)}
                          className="mt-3 text-xs font-semibold text-mint underline hover:text-mist transition-colors"
                        >
                          Mark {b.ref} as duplicate of {a.ref} &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Container>
    </div>
  )
}
