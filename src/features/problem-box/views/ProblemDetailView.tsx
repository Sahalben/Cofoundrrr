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
      <div className="min-h-screen bg-[#000000] py-24 text-mist">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-mist">Problem Statement Not Found</h2>
          <p className="mt-2 text-sm text-mist/60">
            The requested statement ref &ldquo;{problemId}&rdquo; does not exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/problems"
              className="inline-flex items-center rounded-[6px] bg-mint px-4 py-2 text-xs font-bold text-forest-deep hover:bg-mint/90 transition-colors"
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
    <div className="min-h-screen bg-[#000000] pb-24 text-mist">
      {/* Breadcrumb Header */}
      <section className="border-b border-white/10 bg-[#08150E]/80 backdrop-blur-md py-4">
        <Container className="flex items-center justify-between text-xs text-mist/60">
          <div className="flex items-center gap-2">
            <Link to="/problems" className="hover:text-mint underline transition-colors">
              Directory
            </Link>
            <span>/</span>
            <span className="font-mono font-bold text-mint">{problem.ref}</span>
            <span>/</span>
            <span className="truncate max-w-xs text-mist/80">{problem.title}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="text-mist/40 hover:text-[#FF6B6B] text-xs flex items-center gap-1 transition-colors"
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
            <article className="rounded-[8px] border border-white/10 bg-[#0A120E] p-6 sm:p-8 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-mint">{problem.ref}</span>
                  <span className="rounded-[4px] bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs font-medium text-mist/70">
                    {problem.industry}
                  </span>
                  <SeverityBadge severity={problem.severity} />
                </div>
                <SubmitterBadge submitter={submitter} source={problem.source} />
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-mist sm:text-3xl leading-snug">
                {problem.title}
              </h1>

              {/* Duplicate or Moderation note if any */}
              {problem.status === 'duplicate' && problem.duplicateOfId && (
                <div className="mt-4 rounded-[6px] border border-[#FF6B6B]/30 bg-[#2B1114] p-3 text-xs text-[#FFC4C4]">
                  <strong>Notice:</strong> This statement has been identified as a duplicate of{' '}
                  <Link to={`/problems/${problem.duplicateOfId}`} className="underline font-bold text-mint">
                    {problem.duplicateOfId}
                  </Link>. Please contribute validation on the primary entry.
                </div>
              )}

              {/* Core Description */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-mist/50">Problem Statement</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist/90 whitespace-pre-line">
                  {problem.description}
                </p>
              </div>

              {/* Affected Audience */}
              <div className="mt-6 rounded-[6px] bg-[#0E261C]/50 border border-mint/20 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-mint">Who is affected</h4>
                <p className="mt-1 text-xs text-mist/85">{problem.affectedAudience}</p>
              </div>

              {/* Existing Workarounds */}
              {problem.existingWorkarounds && (
                <div className="mt-4 rounded-[6px] bg-white/[0.03] border border-white/10 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-mist/80">
                    Current workarounds &amp; why they fall short
                  </h4>
                  <p className="mt-1 text-xs text-mist/75">{problem.existingWorkarounds}</p>
                </div>
              )}

              {/* Attached Evidence Links */}
              {problem.evidence && problem.evidence.length > 0 && (
                <div className="mt-6 border-t border-white/10 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-mist/50">
                    Supporting Documents &amp; Evidence
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {problem.evidence.map((ev) => (
                      <li key={ev.id} className="text-xs">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-mint">{ev.label}</span>
                          {ev.url && (
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[0.6875rem] text-mint underline hover:text-mist transition-colors"
                            >
                              [Open source document &rarr;]
                            </a>
                          )}
                        </div>
                        {ev.note && <p className="mt-0.5 text-mist/60">{ev.note}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Public Source Citation */}
              {problem.source && (
                <div className="mt-6 rounded-[6px] border border-mint/30 bg-[#0E261C]/60 p-4 text-xs text-mist/85">
                  <div className="flex items-center gap-1.5 font-bold text-mint">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Public Problem Bank Provenance</span>
                  </div>
                  <div className="mt-2 grid gap-1 text-[0.6875rem] sm:grid-cols-2">
                    <div>
                      <span className="text-mist/50">Sponsoring Body: </span>
                      <strong className="text-mist font-semibold">{problem.source.organization}</strong>
                    </div>
                    <div>
                      <span className="text-mist/50">Program / Edition: </span>
                      <span className="text-mist/80">{problem.source.program} ({problem.source.publishedYear ?? 'Public Archive'})</span>
                    </div>
                    <div>
                      <span className="text-mist/50">Challenge PS ID: </span>
                      <span className="font-mono font-semibold text-mint">{problem.source.sourceId}</span>
                    </div>
                    <div>
                      <span className="text-mist/50">Source URL: </span>
                      <a
                        href={problem.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-mint hover:text-mist truncate block transition-colors"
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
            <section className="rounded-[8px] border border-white/10 bg-[#0A120E] p-6 shadow-sm">
              <h3 className="text-sm font-bold text-mist">
                Community Discussion &amp; Field Notes ({comments.length})
              </h3>
              <p className="mt-0.5 text-xs text-mist/60">
                Share additional empirical observations, technical constraints, or edge cases.
              </p>

              {/* New Comment Box */}
              <form onSubmit={handleAddComment} className="mt-4">
                {commentError && (
                  <p className="mb-2 text-xs font-medium text-[#FF6B6B]">{commentError}</p>
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
                  className="w-full rounded-[6px] border border-white/15 bg-[#08150E] px-3 py-2 text-xs text-mist placeholder:text-mist/40 focus:border-mint focus:bg-[#0A120E] focus:outline-none disabled:opacity-40"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!currentUser || !commentBody.trim()}
                    className="rounded-[6px] bg-mint px-4 py-2 text-xs font-bold text-forest-deep hover:bg-mint/90 disabled:opacity-50 transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              {/* Comment Thread */}
              <div className="mt-6 divide-y divide-white/10 border-t border-white/10">
                {comments.length === 0 ? (
                  <p className="py-6 text-center text-xs text-mist/50">
                    No field notes added yet. Be the first to start the discussion.
                  </p>
                ) : (
                  comments.map((comm) => (
                    <div key={comm.id} className="py-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-mint">{comm.authorId}</span>
                        <span className="text-[0.6875rem] text-mist/40">
                          {new Date(comm.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-mist/85 leading-relaxed whitespace-pre-line">
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
            <div className="rounded-[8px] border border-white/10 bg-[#0A120E] p-5 text-xs shadow-card">
              <h4 className="font-bold uppercase tracking-wider text-mint">Statement Metadata</h4>
              <dl className="mt-3 divide-y divide-white/10">
                <div className="flex justify-between py-2">
                  <dt className="text-mist/60">Catalog Ref</dt>
                  <dd className="font-mono font-bold text-mint">{problem.ref}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-mist/60">Industry Sector</dt>
                  <dd className="font-medium text-mist">{problem.industry}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-mist/60">Submitter Severity</dt>
                  <dd>
                    <SeverityBadge severity={problem.severity} />
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-mist/60">Community Severity</dt>
                  <dd className="font-semibold text-mint">
                    {commSev ? `Lv.${commSev.median.toFixed(1)} (${commSev.count} ratings)` : 'No ratings yet'}
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-mist/60">Cataloged On</dt>
                  <dd className="text-mist/80">{new Date(problem.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>

            {/* Related Problems */}
            {related.length > 0 && (
              <div className="rounded-[8px] border border-white/10 bg-[#0A120E] p-5 shadow-card">
                <h4 className="text-xs font-bold uppercase tracking-wider text-mint">
                  Related Problem Statements
                </h4>
                <p className="mt-0.5 text-[0.6875rem] text-mist/50">
                  Based on semantic context and domain overlap
                </p>

                <ul className="mt-3 divide-y divide-white/10">
                  {related.map((rel) => (
                    <li key={rel.id} className="py-2.5">
                      <Link
                        to={`/problems/${rel.id}`}
                        className="text-xs font-semibold text-mist hover:text-mint hover:underline line-clamp-2 transition-colors"
                      >
                        [{rel.ref}] {rel.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-2 text-[0.6875rem] text-mist/50">
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
