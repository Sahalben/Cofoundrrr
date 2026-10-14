import { useState, useMemo } from 'react'
import { Container, Button } from '../../../components/ui'
import { Link, navigate } from '../../../lib/router'
import { useProblemBoxRepo, useProblemBoxState } from '../data/context'
import { useCurrentUser } from '../../../lib/demoSession'
import {
  INDUSTRIES,
  SEVERITY_LABELS,
  type Industry,
  type Severity,
  type Evidence,
} from '../domain/types'
import { cleanText, safeUrl, lengthError, LIMITS } from '../domain/sanitize'
import { findSimilar } from '../domain/similarity'
import { DuplicateWarning } from '../components/DuplicateWarning'

export function ProblemSubmitView() {
  const repo = useProblemBoxRepo()
  const state = useProblemBoxState()
  const currentUser = useCurrentUser()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [affectedAudience, setAffectedAudience] = useState('')
  const [industry, setIndustry] = useState<Industry>('Healthcare')
  const [severity, setSeverity] = useState<Severity>(3)
  const [existingWorkarounds, setExistingWorkarounds] = useState('')
  
  // Evidence items
  const [evidenceLabel, setEvidenceLabel] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [evidenceNote, setEvidenceNote] = useState('')
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([])

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Real-time duplicate detection
  const duplicateMatches = useMemo(() => {
    if (title.trim().length < 10) return []
    return findSimilar({ title, description }, state.problems, { threshold: 0.18, limit: 3 })
  }, [title, description, state.problems])

  const handleAddEvidence = () => {
    if (!evidenceLabel.trim()) return
    const cleanedUrl = safeUrl(evidenceUrl)
    if (evidenceUrl.trim() && !cleanedUrl) {
      setErrors((prev) => ({ ...prev, evidenceUrl: 'Only valid http:// or https:// URLs are allowed.' }))
      return
    }
    setErrors((prev) => {
      const next = { ...prev }
      delete next.evidenceUrl
      return next
    })

    const newEvidence: Evidence = {
      id: `ev-${Date.now()}`,
      label: cleanText(evidenceLabel, LIMITS.evidenceLabel.max),
      url: cleanedUrl,
      note: cleanText(evidenceNote, LIMITS.evidenceNote.max),
    }

    setEvidenceList((prev) => [...prev, newEvidence])
    setEvidenceLabel('')
    setEvidenceUrl('')
    setEvidenceNote('')
  }

  const handleRemoveEvidence = (id: string) => {
    setEvidenceList((prev) => prev.filter((e) => e.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    const titleErr = lengthError(title.trim(), 'Title', LIMITS.title)
    if (titleErr) newErrors.title = titleErr

    const descErr = lengthError(description.trim(), 'Description', LIMITS.description)
    if (descErr) newErrors.description = descErr

    const audErr = lengthError(affectedAudience.trim(), 'Affected Audience', LIMITS.affectedAudience)
    if (audErr) newErrors.affectedAudience = audErr

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const submitterId = currentUser ? currentUser.id : 'anon-community'
    const authorName = currentUser ? currentUser.displayName : 'Community Member'

    const created = repo.submitProblem(
      {
        title: cleanText(title, LIMITS.title.max),
        description: cleanText(description, LIMITS.description.max, { multiline: true }),
        affectedAudience: cleanText(affectedAudience, LIMITS.affectedAudience.max),
        industry,
        severity,
        existingWorkarounds: cleanText(existingWorkarounds, LIMITS.existingWorkarounds.max, { multiline: true }),
        evidence: evidenceList,
        submitterId,
        source: null,
      },
      authorName,
    )

    navigate(`/problems/${created.id}`)
  }

  return (
    <div className="min-h-screen bg-mist/30 pb-24">
      {/* Header */}
      <section className="border-b border-line bg-white py-10">
        <Container>
          <div className="max-w-2xl">
            <Link to="/problems" className="text-xs text-forest underline hover:text-ink">
              &larr; Back to Problem Directory
            </Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-forest">
              Submit a Problem Statement
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-ink/70">
              Contribute a friction point, structural obstacle, or market failure that needs a dedicated solution.
              Quality statements help founders and teams assemble around high-conviction challenges.
            </p>
          </div>
        </Container>
      </section>

      <Container className="mt-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="rounded-[10px] border border-line bg-white p-6 sm:p-8 shadow-card space-y-6">
          {/* Real-time duplicate warning */}
          <DuplicateWarning matches={duplicateMatches} />

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest">
              Problem Title <span className="text-forest">*</span>
            </label>
            <p className="mt-0.5 text-[0.6875rem] text-ink/60">
              Clear, descriptive summary of the problem (12–140 characters).
            </p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lack of cold chain telemetry for remote clinic vaccines"
              className="mt-1.5 w-full rounded-[6px] border border-line bg-mist/30 px-3.5 py-2 text-xs text-ink focus:border-forest focus:bg-white focus:outline-none"
            />
            {errors.title && <p className="mt-1 text-xs text-red-700 font-medium">{errors.title}</p>}
          </div>

          {/* Industry & Severity */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest">
                Industry Sector <span className="text-forest">*</span>
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as Industry)}
                className="mt-1.5 w-full rounded-[6px] border border-line bg-mist/30 px-3 py-2 text-xs text-ink focus:border-forest focus:bg-white focus:outline-none"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest">
                Initial Severity Assessment <span className="text-forest">*</span>
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value) as Severity)}
                className="mt-1.5 w-full rounded-[6px] border border-line bg-mist/30 px-3 py-2 text-xs text-ink focus:border-forest focus:bg-white focus:outline-none"
              >
                {([1, 2, 3, 4, 5] as Severity[]).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Level {lvl} — {SEVERITY_LABELS[lvl].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest">
              Detailed Problem Description <span className="text-forest">*</span>
            </label>
            <p className="mt-0.5 text-[0.6875rem] text-ink/60">
              Provide specific context, failure modes, and why existing solutions do not work (min 80 characters).
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Explain the background, why this occurs, and the direct consequences on stakeholders..."
              className="mt-1.5 w-full rounded-[6px] border border-line bg-mist/30 px-3.5 py-2 text-xs text-ink focus:border-forest focus:bg-white focus:outline-none"
            />
            <div className="mt-1 flex justify-between text-[0.6875rem] text-ink/40">
              <span>{description.length} / 5000 chars</span>
              <span>Min. 80 chars required</span>
            </div>
            {errors.description && (
              <p className="mt-1 text-xs text-red-700 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Affected Audience */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest">
              Who is specifically affected? <span className="text-forest">*</span>
            </label>
            <p className="mt-0.5 text-[0.6875rem] text-ink/60">
              Identify key personas (e.g. smallholder dairy farmers, junior doctors, municipal technicians).
            </p>
            <input
              type="text"
              value={affectedAudience}
              onChange={(e) => setAffectedAudience(e.target.value)}
              placeholder="e.g. Rural healthcare workers, ASHAs, and pediatric patients"
              className="mt-1.5 w-full rounded-[6px] border border-line bg-mist/30 px-3.5 py-2 text-xs text-ink focus:border-forest focus:bg-white focus:outline-none"
            />
            {errors.affectedAudience && (
              <p className="mt-1 text-xs text-red-700 font-medium">{errors.affectedAudience}</p>
            )}
          </div>

          {/* Existing Workarounds */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest">
              Current Workarounds &amp; Limitations (Optional)
            </label>
            <p className="mt-0.5 text-[0.6875rem] text-ink/60">
              What do people currently do to cope with this issue?
            </p>
            <textarea
              value={existingWorkarounds}
              onChange={(e) => setExistingWorkarounds(e.target.value)}
              rows={3}
              placeholder="e.g. Manual paper logs, ad-hoc spreadsheets, costly outsourced testing..."
              className="mt-1.5 w-full rounded-[6px] border border-line bg-mist/30 px-3.5 py-2 text-xs text-ink focus:border-forest focus:bg-white focus:outline-none"
            />
          </div>

          {/* Supporting Evidence Attachments */}
          <div className="rounded-[8px] border border-line/80 bg-mist/40 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              Supporting Evidence &amp; Documentation (Optional)
            </h4>
            <p className="mt-0.5 text-[0.6875rem] text-ink/60">
              Add links to official reports, research articles, or incident documentation.
            </p>

            {evidenceList.length > 0 && (
              <ul className="mt-3 space-y-2">
                {evidenceList.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex items-center justify-between rounded-[4px] bg-white p-2.5 text-xs border border-line"
                  >
                    <div>
                      <span className="font-semibold text-forest">{ev.label}</span>
                      {ev.url && <span className="ml-2 text-ink/40 font-mono text-[0.6875rem] truncate">({ev.url})</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvidence(ev.id)}
                      className="text-xs text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {evidenceList.length < 5 && (
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <input
                  type="text"
                  value={evidenceLabel}
                  onChange={(e) => setEvidenceLabel(e.target.value)}
                  placeholder="Doc title / label"
                  className="rounded-[4px] border border-line bg-white px-2.5 py-1.5 text-xs text-ink focus:border-forest focus:outline-none"
                />
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://... (http/https only)"
                  className="rounded-[4px] border border-line bg-white px-2.5 py-1.5 text-xs text-ink focus:border-forest focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddEvidence}
                  disabled={!evidenceLabel.trim()}
                  className="rounded-[4px] bg-forest px-3 py-1.5 text-xs font-semibold text-mist hover:bg-forest-deep disabled:opacity-50"
                >
                  + Add Evidence Link
                </button>
              </div>
            )}
            {errors.evidenceUrl && (
              <p className="mt-1.5 text-xs text-red-700 font-medium">{errors.evidenceUrl}</p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-line pt-4">
            <Link to="/problems" className="text-xs text-ink/60 hover:text-ink">
              Cancel
            </Link>
            <Button type="submit" size="lg">
              Publish Problem Statement
            </Button>
          </div>
        </form>
      </Container>
    </div>
  )
}
