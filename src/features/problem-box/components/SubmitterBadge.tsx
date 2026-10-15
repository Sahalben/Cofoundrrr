import { cx } from '../../../components/ui'
import type { Submitter, PublicSource } from '../domain/types'

export function SubmitterBadge({
  submitter,
  source,
  className,
}: {
  submitter?: Submitter
  source?: PublicSource | null
  className?: string
}) {
  if (source) {
    return (
      <div className={cx('inline-flex flex-wrap items-center gap-1.5 text-[0.8125rem]', className)}>
        <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#0E261C] border border-mint/30 px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wide uppercase text-mint">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Public Archive
        </span>
        <span className="font-medium text-mist">{source.organization}</span>
        {source.sourceId && (
          <span className="font-mono text-[0.75rem] text-mist/50">({source.sourceId})</span>
        )}
      </div>
    )
  }

  if (!submitter) {
    return <span className={cx('text-[0.8125rem] text-mist/50', className)}>Anonymous</span>
  }

  const isVerifiedOrg = submitter.kind === 'organization' && submitter.verified

  return (
    <div className={cx('inline-flex flex-wrap items-center gap-1.5 text-[0.8125rem]', className)}>
      <span className="font-medium text-mist">{submitter.displayName}</span>
      {isVerifiedOrg ? (
        <span
          className="inline-flex items-center gap-1 rounded-[4px] bg-mint px-1.5 py-0.5 text-[0.6875rem] font-bold text-forest-deep"
          title="Verified institutional partner"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6.5L4.5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Verified Org
        </span>
      ) : submitter.kind === 'organization' ? (
        <span className="inline-flex items-center rounded-[4px] bg-white/10 border border-white/10 px-1.5 py-0.5 text-[0.6875rem] text-mist/70">
          Unverified Org
        </span>
      ) : (
        <span className="inline-flex items-center rounded-[4px] bg-white/5 border border-white/10 px-1.5 py-0.5 text-[0.6875rem] text-mist/50">
          Community Member
        </span>
      )}
    </div>
  )
}
