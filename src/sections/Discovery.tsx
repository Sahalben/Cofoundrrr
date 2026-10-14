import { useState } from 'react'
import { Avatar, Container, Reveal, Tag, cx } from '../components/ui'
import { members, startup } from '../data/sample'

const filters = ['All', 'Engineering', 'Design', 'Growth'] as const
type Filter = (typeof filters)[number]
const roleMap: Record<string, Filter> = {
  amara: 'Design',
  rohan: 'Engineering',
  lena: 'Growth',
  kenji: 'Engineering',
}
/* Illustrative "complement" notes — narrative, not a scoring algorithm. */
const fit: Record<string, string> = {
  amara: 'Already collaborating',
  rohan: 'Covers backend role',
  lena: 'Covers industrial sales gap',
  kenji: 'Covers ML role',
}

export function Discovery() {
  const [filter, setFilter] = useState<Filter>('All')
  const [selected, setSelected] = useState<string>('rohan')
  const list = members.filter((m) => filter === 'All' || roleMap[m.id] === filter)
  const active = members.find((m) => m.id === selected) ?? members[0]

  return (
    <section id="discovery">
      <Container className="py-24 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal as="h2" className="text-headline font-semibold text-forest">
              Find the people who complete the picture.
            </Reveal>
          </div>
          <Reveal delay={100} className="text-lede text-ink/70 lg:col-span-4 lg:col-start-9">
            Discovery starts from what a team is missing, not from a keyword search.
          </Reveal>
        </div>

        {/* Product window mockup */}
        <Reveal delay={120} className="mt-16 overflow-hidden rounded-[12px] bg-white shadow-float lg:mt-24">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2.5 w-2.5 rounded-full bg-mint" />
              ))}
            </div>
            <span className="text-[0.75rem] text-ink/45">Discover · {startup.name}</span>
            <span className="text-[0.75rem] text-ink/30">Preview</span>
          </div>

          <div className="grid lg:grid-cols-12">
            {/* Left: needs */}
            <aside className="border-b border-line p-6 lg:col-span-3 lg:border-b-0 lg:border-r">
              <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">Team needs</p>
              <ul className="mt-4 space-y-2">
                {startup.openRoles.map((r) => (
                  <li key={r} className="flex items-center justify-between rounded-[6px] bg-mist px-3 py-2.5 text-[0.875rem]">
                    {r}
                    <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">Filter</p>
              <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter talent">
                {filters.map((f) => (
                  <button
                    key={f}
                    id={`discovery-filter-${f.toLowerCase()}`}
                    role="tab"
                    aria-selected={filter === f}
                    onClick={() => setFilter(f)}
                    className={cx(
                      'h-8 rounded-[5px] px-3 text-[0.8125rem] transition-colors',
                      filter === f ? 'bg-forest text-mist' : 'bg-mist text-ink/70 hover:text-forest',
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </aside>

            {/* Middle: list */}
            <div className="border-b border-line lg:col-span-5 lg:border-b-0 lg:border-r">
              <ul className="divide-y divide-line">
                {list.map((m) => (
                  <li key={m.id}>
                    <button
                      id={`discovery-member-${m.id}`}
                      onClick={() => setSelected(m.id)}
                      className={cx(
                        'flex w-full items-center gap-4 px-6 py-5 text-left transition-colors',
                        selected === m.id ? 'bg-mist' : 'hover:bg-mist/60',
                      )}
                    >
                      <Avatar initials={m.initials} tone={m.tone} size={42} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium tracking-[-0.015em] text-forest">{m.name}</p>
                        <p className="truncate text-[0.8125rem] text-ink/55">{m.role} · {m.location}</p>
                      </div>
                      <span className="hidden text-right text-[0.75rem] text-ink/50 sm:block">{fit[m.id]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: detail */}
            <div key={active.id} className="p-6 lg:col-span-4 lg:p-8" style={{ animation: 'fade-in .5s var(--ease-out-quint)' }}>
              <div className="flex items-center gap-4">
                <Avatar initials={active.initials} tone={active.tone} size={56} />
                <div>
                  <p className="text-lg font-semibold tracking-[-0.02em] text-forest">{active.name}</p>
                  <p className="text-[0.8125rem] text-ink/55">{active.role}</p>
                </div>
              </div>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink/80">{active.headline}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {active.skills.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
              <div className="mt-6 rounded-[8px] bg-mint/70 p-4 text-[0.875rem]">
                <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-forest/60">Why this person</p>
                <p className="mt-1.5 text-ink">{fit[active.id]} · {active.projects} shipped projects</p>
              </div>
              <div className="mt-6 flex gap-2">
                <span className="inline-flex h-10 flex-1 items-center justify-center rounded-[6px] bg-forest text-[0.875rem] font-medium text-mist">
                  Invite to team
                </span>
                <span className="inline-flex h-10 items-center justify-center rounded-[6px] px-4 text-[0.875rem] text-ink ring-1 ring-inset ring-ink/15">
                  Save
                </span>
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mt-6 text-[0.75rem] text-ink/45">Interactive preview with illustrative data.</p>
      </Container>
    </section>
  )
}
