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
          'inline-flex items-center rounded-[4px] bg-mist px-2 py-0.5 text-[0.6875rem] font-medium text-ink/50',
          className,
        )}
      >
        Severity: Unrated
      </span>
    )
  }

  const rounded = Math.round(severity) as Severity
  const meta = SEVERITY_LABELS[rounded] ?? { label: `Level ${severity}`, hint: '' }

  // High severity: bold ink/forest tint; Low severity: subtle mint tint. NO GOLD.
  const toneClasses =
    rounded >= 4
      ? 'bg-forest text-mist font-semibold'
      : rounded === 3
        ? 'bg-ink/10 text-forest font-medium'
        : 'bg-mint text-forest font-medium'

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
