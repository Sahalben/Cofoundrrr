import type { Member, Startup } from '../../data/sample'
import { Avatar, Tag, cx } from '../ui'

/* ---------- Member profile card ---------- */
export function MemberCard({ member, compact, className }: { member: Member; compact?: boolean; className?: string }) {
  return (
    <article className={cx('rounded-[10px] bg-[#0E1A14] border border-white/10 p-6 shadow-2xl text-mist', className)} aria-label={`Sample profile: ${member.name}`}>
      <header className="flex items-start gap-4">
        <Avatar initials={member.initials} tone={member.tone === 'forest' ? 'mint' : member.tone} size={52} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[1.0625rem] font-semibold tracking-[-0.02em] text-mist">{member.name}</h3>
          <p className="text-sm text-mist/60">
            {member.role} · {member.location}
          </p>
        </div>
        <span className="relative mt-1.5 flex h-2 w-2" title="Open to collaborate">
          <span className="animate-pulse-dot absolute inset-0 rounded-full bg-mint/50" />
          <span className="relative h-2 w-2 rounded-full bg-mint" />
        </span>
      </header>

      <p className="mt-5 text-[0.9375rem] leading-relaxed text-mist/85">{member.headline}</p>

      {!compact && (
        <div className="mt-6 space-y-3">
          {member.capabilities.map((c) => (
            <div key={c.label}>
              <div className="mb-1.5 flex justify-between text-[0.75rem]">
                <span className="text-mist/85 font-medium">{c.label}</span>
                <span className="tabular-nums text-mint font-mono font-medium">{c.value}</span>
              </div>
              <div className="h-[3px] rounded-full bg-white/10">
                <div className="h-full rounded-full bg-mint" style={{ width: `${c.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-1.5">
        {member.skills.map((s) => (
          <Tag key={s} tone="dark">{s}</Tag>
        ))}
      </div>

      {!compact && (
        <footer className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[0.8125rem]">
          <span className="text-mist/75">
            Looking for <span className="text-mint font-semibold">{member.lookingFor}</span>
          </span>
        </footer>
      )}
    </article>
  )
}

/* ---------- Startup profile card ---------- */
export function StartupCard({ startup, className }: { startup: Startup; className?: string }) {
  const done = startup.milestones.filter((m) => m.done).length
  return (
    <article className={cx('rounded-[10px] bg-[#072B20] border border-mint/25 p-7 text-mist shadow-2xl', className)} aria-label={`Sample startup: ${startup.name}`}>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-mint text-lg font-bold text-forest-deep shadow-sm">
            {startup.mark}
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.025em] text-mist">{startup.name}</h3>
            <p className="text-[0.8125rem] text-mist/70">{startup.sector}</p>
          </div>
        </div>
        <Tag tone="dark">{startup.stage}</Tag>
      </header>

      <p className="mt-7 text-[1.375rem] font-medium leading-[1.25] tracking-[-0.025em] text-mist">{startup.oneLiner}</p>

      <div className="mt-8 grid grid-cols-2 gap-6 border-t border-line-dark pt-6">
        <div>
          <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-mint font-semibold">Team</p>
          <div className="mt-3 flex -space-x-2">
            {startup.team.map((t) => (
              <span key={t.initials} className="rounded-full ring-2 ring-[#072B20]">
                <Avatar initials={t.initials} tone={t.tone === 'forest' ? 'mint' : t.tone} size={34} />
              </span>
            ))}
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-dashed border-mint/40 text-mint ring-2 ring-[#072B20]">
              +
            </span>
          </div>
        </div>
        <div>
          <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-mint font-semibold">Progress</p>
          <div className="mt-3 flex gap-1">
            {startup.milestones.map((m) => (
              <span key={m.label} className={cx('h-1.5 flex-1 rounded-full', m.done ? 'bg-mint' : 'bg-white/15')} title={m.label} />
            ))}
          </div>
          <p className="mt-2 text-[0.75rem] text-mist/75">
            {done} of {startup.milestones.length} · {startup.milestones[done]?.label ?? 'Complete'} next
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-mint font-semibold">Open roles</p>
        <ul className="mt-3 divide-y divide-line-dark">
          {startup.openRoles.map((r) => (
            <li key={r} className="flex items-center justify-between py-2.5 text-[0.9375rem] text-mist/90">
              {r}
              <span className="text-[0.75rem] font-medium text-mint">Equity · Part-time</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
