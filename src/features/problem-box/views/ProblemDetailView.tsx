import { useState } from 'react'
import { Container } from '../../../components/ui'
import { Link } from '../../../lib/router'
import { useProblemBoxRepo, useProblemBoxState } from '../data/context'
import { breakdownFor, communitySeverity } from '../domain/validation'
import { relatedProblems } from '../domain/similarity'
import { SeverityBadge } from '../components/SeverityBadge'
import { SubmitterBadge } from '../components/SubmitterBadge'
import { ValidationBreakdown } from '../components/ValidationBreakdown'
import { ValidationAction } from '../components/ValidationAction'
import { BuildInterestAction } from '../components/BuildInterestAction'
import { ReportModal } from '../components/ReportModal'
import { useCurrentUser } from '../../../lib/demoSession'

export function ProblemDetailView({ problemId }: { problemId: string }) {
  const repo = useProblemBoxRepo()
  const state = useProblemBoxState()
  const currentUser = useCurrentUser()

  const [commentBody, setCommentBody] = useState('')
  const [commentError, setCommentError] = useState<string | null>(null)
  const [isReportOpen, setIsReportOpen] = useState(false)

  const problem = repo.getProblemById(problemId)

  if (!problem) {
    return (
      <div className="min-h-screen bg-mist/40 py-24">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-forest">Problem Statement Not Found</h2>
          <p className="mt-2 text-sm text-ink/60">
            The requested statement ref &ldquo;{problemId}&rdquo; does not exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/problems"
              className="inline-flex items-center rounded-[6px] bg-forest px-4 py-2 text-xs font-medium text-mist"
            >
              &larr; Return to Problem Directory
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const submitter = repo.getSubmitterById(problem.submitterId)
  const validations = repo.getValidations(problem.id)
  const breakdown = breakdownFor(validations, problem.id)
  const commSev = communitySeverity(validations, problem.id)
  const userValidation = currentUser ? repo.getUserValidation(problem.id, currentUser.id) : undefined
  const comments = repo.getComments(problem.id)
  const related = relatedProblems(problem, state.problems)

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      setCommentError('Please select a demo user in the top banner to post a comment.')
      return
    }
    if (commentBody.trim().length < 2) {
      setCommentError('Comment must be at least 2 characters.')
      return
    }
    setCommentError(null)
    repo.addComment({
      problemId: problem.id,
      authorId: currentUser.id,
      body: commentBody,
    })
    setCommentBody('')
  }

  return (
    <div className="min-h-screen bg-mist/30 pb-24">
      {/* Breadcrumb Header */}
      <section className="border-b border-line bg-white py-4">
        <Container className="flex items-center justify-between text-xs text-ink/60">
          <div className="flex items-center gap-2">
            <Link to="/problems" className="hover:text-forest underline">
              Directory
            </Link>
            <span>/</span>
            <span className="font-mono font-bold text-forest">{problem.ref}</span>
            <span>/</span>
            <span className="truncate max-w-xs">{problem.title}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="text-ink/40 hover:text-red-700 text-xs flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M2.5 1a.75.75 0 00-.75.75v13.5a.75.75 0 001.5 0V9h8.28a.75.75 0 00.64-.36l2-3.5a.75.75 0 000-.78l-2-3.5A.75.75 0 0011.52 1H2.5z"/>
            </svg>
            Report statement
          </button>
        </Container>
      </section>

      <Container className="mt-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Statement & Validation Column */}
          <main className="lg:col-span-8 space-y-6">
            <article className="rounded-[8px] border border-line bg-white p-6 sm:p-8 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-forest/70">{problem.ref}</span>
                  <span className="rounded-[4px] bg-mist px-2.5 py-0.5 text-xs font-medium text-ink/70">
                    {problem.industry}
                  </span>
                  <SeverityBadge severity={problem.severity} />
                </div>
                <SubmitterBadge submitter={submitter} source={problem.source} />
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-forest sm:text-3xl leading-snug">
                {problem.title}
              </h1>

              {/* Duplicate or Moderation note if any */}
              {problem.status === 'duplicate' && problem.duplicateOfId && (
                <div className="mt-4 rounded-[6px] border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
                  <strong>Notice:</strong> This statement has been identified as a duplicate of{' '}
                  <Link to={`/problems/${problem.duplicateOfId}`} className="underline font-bold text-forest">
                    {problem.duplicateOfId}
                  </Link>. Please contribute validation on the primary entry.
                </div>
              )}

              {/* Core Description */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink/50">Problem Statement</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/90 whitespace-pre-line">
                  {problem.description}
                </p>
              </div>

              {/* Affected Audience */}
              <div className="mt-6 rounded-[6px] bg-mist/60 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest">Who is affected</h4>
                <p className="mt-1 text-xs text-ink/85">{problem.affectedAudience}</p>
              </div>

              {/* Existing Workarounds */}
              {problem.existingWorkarounds && (
                <div className="mt-4 rounded-[6px] bg-mist/60 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
                    Current workarounds &amp; why they fall short
                  </h4>
                  <p className="mt-1 text-xs text-ink/85">{problem.existingWorkarounds}</p>
                </div>
              )}

              {/* Attached Evidence Links */}
              {problem.evidence && problem.evidence.length > 0 && (
                <div className="mt-6 border-t border-line/60 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50">
                    Supporting Documents &amp; Evidence
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {problem.evidence.map((ev) => (
                      <li key={ev.id} className="text-xs">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-forest">{ev.label}</span>
                          {ev.url && (
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[0.6875rem] text-forest underline hover:text-ink"
                            >
                              [Open source document &rarr;]
                            </a>
                          )}
                        </div>
                        {ev.note && <p className="mt-0.5 text-ink/60">{ev.note}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Public Source Citation */}
              {problem.source && (
                <div className="mt-6 rounded-[6px] border border-line bg-mint/20 p-4 text-xs text-ink/75">
                  <div className="flex items-center gap-1.5 font-bold text-forest">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Public Problem Bank Provenance</span>
                  </div>
                  <div className="mt-2 grid gap-1 text-[0.6875rem] sm:grid-cols-2">
                    <div>
                      <span className="text-ink/50">Sponsoring Body: </span>
                      <strong className="text-forest">{problem.source.organization}</strong>
                    </div>
                    <div>
                      <span className="text-ink/50">Program / Edition: </span>
                      <span>{problem.source.program} ({problem.source.publishedYear ?? 'Public Archive'})</span>
                    </div>
                    <div>
                      <span className="text-ink/50">Challenge PS ID: </span>
                      <span className="font-mono font-semibold">{problem.source.sourceId}</span>
                    </div>
                    <div>
                      <span className="text-ink/50">Source URL: </span>
                      <a
                        href={problem.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-forest hover:text-ink truncate block"
                      >
                        {problem.source.url}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </article>

            {/* Validation Breakdown Section */}
            <ValidationBreakdown breakdown={breakdown} communityMedian={commSev?.median} />

            {/* Validation Form Component (Single vote per user guaranteed) */}
            <ValidationAction
              problemId={problem.id}
              existingValidation={userValidation}
            />

            {/* "Build this problem" Venture & Team Action */}
            <BuildInterestAction problemId={problem.id} />

            {/* Comments & Discussion */}
            <section className="rounded-[8px] border border-line bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-forest">
                Community Discussion &amp; Field Notes ({comments.length})
              </h3>
              <p className="mt-0.5 text-xs text-ink/60">
                Share additional empirical observations, technical constraints, or edge cases.
              </p>

              {/* New Comment Box */}
              <form onSubmit={handleAddComment} className="mt-4">
                {commentError && (
                  <p className="mb-2 text-xs font-medium text-red-700">{commentError}</p>
                )}
                <textarea
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder={
                    currentUser
                      ? `Contribute as ${currentUser.displayName}...`
                      : 'Select a demo user identity in the header to join the discussion...'
                  }
                  rows={3}
                  disabled={!currentUser}
                  className="w-full rounded-[6px] border border-line bg-mist/30 px-3 py-2 text-xs text-ink focus:border-forest focus:bg-white focus:outline-none disabled:opacity-60"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!currentUser || !commentBody.trim()}
                    className="rounded-[6px] bg-forest px-4 py-2 text-xs font-semibold text-mist hover:bg-forest-deep disabled:opacity-50 transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              {/* Comment Thread */}
              <div className="mt-6 divide-y divide-line/60 border-t border-line/60">
                {comments.length === 0 ? (
                  <p className="py-6 text-center text-xs text-ink/50">
                    No field notes added yet. Be the first to start the discussion.
                  </p>
                ) : (
                  comments.map((comm) => (
                    <div key={comm.id} className="py-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-forest">{comm.authorId}</span>
                        <span className="text-[0.6875rem] text-ink/40">
                          {new Date(comm.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-ink/85 leading-relaxed whitespace-pre-line">
                        {comm.body}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>

          {/* Sidebar: Metadata and Related Problems */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-[8px] border border-line bg-white p-5 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-forest/70">Statement Metadata</h4>
              <dl className="mt-3 divide-y divide-line/60">
                <div className="flex justify-between py-2">
                  <dt className="text-ink/60">Catalog Ref</dt>
                  <dd className="font-mono font-bold text-forest">{problem.ref}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-ink/60">Industry Sector</dt>
                  <dd className="font-medium text-forest">{problem.industry}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-ink/60">Submitter Severity</dt>
                  <dd>
                    <SeverityBadge severity={problem.severity} />
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-ink/60">Community Severity</dt>
                  <dd className="font-semibold text-forest">
                    {commSev ? `Lv.${commSev.median.toFixed(1)} (${commSev.count} ratings)` : 'No ratings yet'}
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-ink/60">Cataloged On</dt>
                  <dd className="text-ink/80">{new Date(problem.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>

            {/* Related Problems */}
            {related.length > 0 && (
              <div className="rounded-[8px] border border-line bg-white p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest/70">
                  Related Problem Statements
                </h4>
                <p className="mt-0.5 text-[0.6875rem] text-ink/50">
                  Based on semantic context and domain overlap
                </p>

                <ul className="mt-3 divide-y divide-line/60">
                  {related.map((rel) => (
                    <li key={rel.id} className="py-2.5">
                      <Link
                        to={`/problems/${rel.id}`}
                        className="text-xs font-semibold text-forest hover:underline line-clamp-2"
                      >
                        [{rel.ref}] {rel.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-2 text-[0.6875rem] text-ink/50">
                        <span>{rel.industry}</span>
                        <span>&bull;</span>
                        <SeverityBadge severity={rel.severity} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Container>

      {/* Report Modal */}
      <ReportModal
        problemId={problem.id}
        targetId={problem.id}
        targetType="problem"
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  )
}
