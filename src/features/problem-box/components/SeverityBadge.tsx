import { cx } from '../../../components/ui'
import { SEVERITY_LABELS, type Severity } from '../domain/types'

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity | null | number
  className?: string
}) {
  if (severity === null || severity === undefined) {
    return (
      <span
        className={cx(
          'inline-flex items-center rounded-[4px] bg-white/5 border border-white/10 px-2 py-0.5 text-[0.6875rem] font-medium text-mist/50',
          className,
        )}
      >
        Severity: Unrated
      </span>
    )
  }

  const rounded = Math.round(severity) as Severity
  const meta = SEVERITY_LABELS[rounded] ?? { label: `Level ${severity}`, hint: '' }

  // High severity: deep rose-red tint; Level 3: emerald/mint tint; Level 1-2: subtle mist tint. STRICTLY NO GOLD.
  const toneClasses =
    rounded >= 4
      ? 'bg-[#2B1114] text-[#FF9E9E] border border-[#FF6B6B]/25 font-semibold'
      : rounded === 3
        ? 'bg-[#0E261C] text-mint border border-mint/30 font-medium'
        : 'bg-white/5 text-mist/80 border border-white/10 font-medium'

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-[4px] px-2 py-0.5 text-[0.75rem]',
        toneClasses,
        className,
      )}
      title={meta.hint}
    >
      <span className="tabular-nums font-mono text-[0.6875rem]">Lv.{severity}</span>
      <span>{meta.label}</span>
    </span>
  )
}
