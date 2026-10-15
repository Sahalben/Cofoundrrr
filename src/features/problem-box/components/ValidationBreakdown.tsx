import { cx } from '../../../components/ui'
import type { Breakdown } from '../domain/validation'

export function ValidationBreakdown({
  breakdown,
  communityMedian,
  compact = false,
  className,
}: {
  breakdown: Breakdown
  communityMedian?: number | null
  compact?: boolean
  className?: string
}) {
  if (compact) {
    return (
      <div className={cx('flex items-center gap-3 text-[0.75rem]', className)}>
        <span
          className="inline-flex items-center gap-1 font-medium text-mint"
          title="Direct Personal Experience"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          <span className="tabular-nums font-semibold">{breakdown.direct}</span>
          <span className="text-mist/60 font-normal">direct</span>
        </span>

        <span
          className="inline-flex items-center gap-1 text-mist/90"
          title="Observed in Others"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          <span className="tabular-nums font-semibold">{breakdown.observed}</span>
          <span className="text-mist/60 font-normal">observed</span>
        </span>

        <span
          className="inline-flex items-center gap-1 text-mist/70"
          title="General Interest / Priority"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          <span className="tabular-nums font-semibold">{breakdown.interest}</span>
          <span className="text-mist/50 font-normal">interest</span>
        </span>
      </div>
    )
  }

  const total = breakdown.respondents

  return (
    <div className={cx('rounded-[8px] border border-white/10 bg-[#0A120E] p-5 shadow-card', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <h4 className="text-sm font-bold text-mist">Community Validation Breakdown</h4>
          <p className="mt-0.5 text-[0.6875rem] text-mist/50">
            {total === 0 ? 'No responses recorded yet.' : `${total} total contributor response${total === 1 ? '' : 's'}. Categories are evaluated distinctly.`}
          </p>
        </div>
        {communityMedian !== undefined && communityMedian !== null && (
          <div className="text-right">
            <span className="text-[0.6875rem] uppercase tracking-wider text-mist/50">Experience Severity</span>
            <p className="text-sm font-bold text-mint">Median Lv.{communityMedian.toFixed(1)}</p>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {/* Direct */}
        <div className="rounded-[6px] bg-[#0E261C]/50 border border-mint/20 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[0.75rem] font-semibold text-mint">Direct Experience</span>
            <span className="tabular-nums text-base font-bold text-mint">{breakdown.direct}</span>
          </div>
          <p className="mt-1 text-[0.6875rem] leading-tight text-mist/70">
            Personally experienced this problem first-hand.
          </p>
        </div>

        {/* Observed */}
        <div className="rounded-[6px] bg-white/[0.03] border border-white/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[0.75rem] font-semibold text-mist">Observed Experience</span>
            <span className="tabular-nums text-base font-bold text-mist">{breakdown.observed}</span>
          </div>
          <p className="mt-1 text-[0.6875rem] leading-tight text-mist/60">
            Witnessed customers, peers, or community face it.
          </p>
        </div>

        {/* General Interest */}
        <div className="rounded-[6px] bg-white/[0.02] border border-white/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[0.75rem] font-semibold text-mist/80">General Interest</span>
            <span className="tabular-nums text-base font-bold text-mist/80">{breakdown.interest}</span>
          </div>
          <p className="mt-1 text-[0.6875rem] leading-tight text-mist/50">
            Considers problem significant, but lacks first-hand exposure.
          </p>
        </div>
      </div>

      <p className="mt-3 text-[0.6875rem] italic text-mist/40">
        Notice: Responses reflect qualitative community feedback and do not constitute certified market sizing or economic demand.
      </p>
    </div>
  )
}
