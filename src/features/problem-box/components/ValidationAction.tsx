import { useState } from 'react'
import { cx, Button } from '../../../components/ui'
import {
  VALIDATION_KINDS,
  SEVERITY_LABELS,
  isExperienceKind,
  type ValidationKind,
  type Severity,
  type Validation,
} from '../domain/types'
import { useProblemBoxRepo } from '../data/context'
import { useCurrentUser } from '../../../lib/demoSession'

export function ValidationAction({
  problemId,
  existingValidation,
  onUpdated,
}: {
  problemId: string
  existingValidation?: Validation
  onUpdated?: () => void
}) {
  const repo = useProblemBoxRepo()
  const currentUser = useCurrentUser()

  const [kind, setKind] = useState<ValidationKind | null>(existingValidation?.kind ?? null)
  const [severity, setSeverity] = useState<Severity | null>(existingValidation?.severity ?? null)
  const [note, setNote] = useState<string>(existingValidation?.note ?? '')
  const [isEditing, setIsEditing] = useState<boolean>(!existingValidation)
  const [error, setError] = useState<string | null>(null)

  if (!currentUser) {
    return (
      <div className="rounded-[8px] border border-line bg-mist/60 p-5 text-sm text-ink/75">
        <p className="font-semibold text-forest">Sign in to validate this problem statement</p>
        <p className="mt-1 text-xs text-ink/60">
          (Select a demo identity in the header above to test single-vote validation response workflows.)
        </p>
      </div>
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!kind) {
      setError('Please select how you relate to this problem.')
      return
    }

    setError(null)
    repo.saveValidation({
      problemId,
      userId: currentUser.id,
      kind,
      severity: isExperienceKind(kind) ? severity : null,
      note,
    })

    setIsEditing(false)
    onUpdated?.()
  }

  const handleRetract = () => {
    repo.deleteValidation(problemId, currentUser.id)
    setKind(null)
    setSeverity(null)
    setNote('')
    setIsEditing(true)
    onUpdated?.()
  }

  if (existingValidation && !isEditing) {
    const meta = VALIDATION_KINDS[existingValidation.kind]
    return (
      <div className="rounded-[8px] border border-line bg-mint/30 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-forest">
              Your Validation Response
            </span>
            <p className="mt-1 text-base font-semibold text-forest">{meta.label}</p>
            <p className="text-xs text-ink/60">{meta.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-forest underline underline-offset-2 hover:text-ink"
            >
              Update response
            </button>
            <span className="text-ink/20">|</span>
            <button
              type="button"
              onClick={handleRetract}
              className="text-xs text-ink/60 hover:text-red-700"
            >
              Retract
            </button>
          </div>
        </div>

        {existingValidation.severity && (
          <div className="mt-3 text-xs text-ink/80">
            <span className="font-medium">Assessed Severity: </span>
            <span className="font-semibold text-forest">
              Level {existingValidation.severity} — {SEVERITY_LABELS[existingValidation.severity].label}
            </span>
          </div>
        )}

        {existingValidation.note && (
          <p className="mt-2 text-xs italic text-ink/75">
            &ldquo;{existingValidation.note}&rdquo;
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="rounded-[8px] border border-line bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div>
          <h4 className="text-sm font-semibold text-forest">
            {existingValidation ? 'Update Your Validation Response' : 'Validate This Problem Statement'}
          </h4>
          <p className="mt-0.5 text-xs text-ink/60">
            One response per member. Honest assessments maintain repository credibility.
          </p>
        </div>
        {existingValidation && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-xs text-ink/50 hover:text-ink"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-[4px] bg-red-50 p-2 text-xs font-medium text-red-800">
          {error}
        </div>
      )}

      {/* Validation Kind Selection */}
      <div className="mt-4 space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
          How do you know this problem exists? <span className="text-forest">*</span>
        </label>

        <div className="grid gap-2 sm:grid-cols-3">
          {(Object.entries(VALIDATION_KINDS) as [ValidationKind, typeof VALIDATION_KINDS[ValidationKind]][]).map(
            ([k, info]) => {
              const selected = kind === k
              return (
                <button
                  type="button"
                  key={k}
                  onClick={() => {
                    setKind(k)
                    if (!isExperienceKind(k)) setSeverity(null)
                  }}
                  className={cx(
                    'flex flex-col rounded-[6px] border p-3 text-left transition-colors',
                    selected
                      ? 'border-forest bg-mint/50 ring-1 ring-forest'
                      : 'border-line bg-white hover:bg-mist/60',
                  )}
                >
                  <span className="text-xs font-bold text-forest">{info.label}</span>
                  <span className="mt-1 text-[0.6875rem] leading-tight text-ink/65">
                    {info.description}
                  </span>
                </button>
              )
            },
          )}
        </div>
      </div>

      {/* Severity selection — strictly hidden/disabled if General Interest */}
      {kind && isExperienceKind(kind) && (
        <div className="mt-5 border-t border-line/60 pt-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
            Based on your experience, how severe is this problem?
          </label>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {([1, 2, 3, 4, 5] as Severity[]).map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => setSeverity(lvl)}
                className={cx(
                  'rounded-[4px] border p-2 text-center transition-colors',
                  severity === lvl
                    ? 'border-forest bg-forest text-mist'
                    : 'border-line bg-white hover:bg-mist text-ink/80',
                )}
              >
                <div className="text-xs font-bold">{lvl}</div>
                <div className="text-[0.625rem] truncate">{SEVERITY_LABELS[lvl].label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Optional Note */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-ink/70">
          Optional context or evidence note (max 280 chars)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 280))}
          placeholder="Briefly describe what you observed or experienced..."
          rows={2}
          className="mt-1.5 w-full rounded-[6px] border border-line bg-mist/30 px-3 py-2 text-xs text-ink focus:border-forest focus:bg-white focus:outline-none"
        />
      </div>

      <div className="mt-5 flex items-center justify-end gap-3 border-t border-line pt-4">
        {existingValidation && (
          <button
            type="button"
            onClick={handleRetract}
            className="text-xs text-ink/50 hover:text-red-700"
          >
            Delete response
          </button>
        )}
        <Button type="submit" size="md">
          {existingValidation ? 'Save updated response' : 'Submit validation'}
        </Button>
      </div>
    </form>
  )
}
