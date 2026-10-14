import { useState } from 'react'
import { Button } from '../../../components/ui'
import { REPORT_REASONS, type ReportReason } from '../domain/types'
import { useProblemBoxRepo } from '../data/context'
import { useCurrentUser } from '../../../lib/demoSession'

export function ReportModal({
  problemId,
  targetType = 'problem',
  targetId,
  isOpen,
  onClose,
}: {
  problemId: string
  targetType?: 'problem' | 'comment'
  targetId: string
  isOpen: boolean
  onClose: () => void
}) {
  const repo = useProblemBoxRepo()
  const currentUser = useCurrentUser()

  const [reason, setReason] = useState<ReportReason>('duplicate')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    repo.addReport({
      targetType,
      targetId,
      problemId,
      reporterId: currentUser.id,
      reason,
      details,
    })

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 1200)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest/40 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-[10px] border border-line bg-white p-6 shadow-float">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h3 className="text-base font-semibold text-forest">Report Problem Statement</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/40 hover:text-ink text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <span className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-mint text-forest font-bold">
              ✓
            </span>
            <p className="mt-3 text-sm font-semibold text-forest">Report Submitted</p>
            <p className="mt-1 text-xs text-ink/60">
              The moderation team has been notified. Thank you for maintaining repository integrity.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink/70">
                Reason for report <span className="text-forest">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="mt-1 w-full rounded-[6px] border border-line bg-mist/40 px-3 py-2 text-xs text-ink focus:border-forest focus:bg-white focus:outline-none"
              >
                {(Object.entries(REPORT_REASONS) as [ReportReason, string][]).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/70">
                Details or evidence (e.g. link to original problem if duplicate)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Provide helpful context for the moderation team..."
                className="mt-1 w-full rounded-[6px] border border-line bg-mist/40 px-3 py-2 text-xs text-ink focus:border-forest focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-line pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[6px] px-3 py-2 text-xs text-ink/60 hover:text-ink"
              >
                Cancel
              </button>
              <Button type="submit" size="md">
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
