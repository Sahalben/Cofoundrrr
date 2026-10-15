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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-[10px] border border-white/10 bg-[#0A120E] p-6 shadow-float text-mist">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-base font-bold text-mist">Report Problem Statement</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-mist/40 hover:text-mist text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <span className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-[#0E261C] border border-mint/40 text-mint font-bold">
              ✓
            </span>
            <p className="mt-3 text-sm font-semibold text-mist">Report Submitted</p>
            <p className="mt-1 text-xs text-mist/60">
              The moderation team has been notified. Thank you for maintaining repository integrity.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-mist/70">
                Reason for report <span className="text-mint">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="mt-1 w-full rounded-[6px] border border-white/15 bg-[#08150E] px-3 py-2 text-xs text-mist focus:border-mint focus:bg-[#0A120E] focus:outline-none"
              >
                {(Object.entries(REPORT_REASONS) as [ReportReason, string][]).map(([k, label]) => (
                  <option key={k} value={k} className="bg-[#0A120E] text-mist">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-mist/70">
                Details or evidence (e.g. link to original problem if duplicate)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Provide helpful context for the moderation team..."
                className="mt-1 w-full rounded-[6px] border border-white/15 bg-[#08150E] px-3 py-2 text-xs text-mist placeholder:text-mist/40 focus:border-mint focus:bg-[#0A120E] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[6px] px-3 py-2 text-xs text-mist/60 hover:text-mist transition-colors"
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
