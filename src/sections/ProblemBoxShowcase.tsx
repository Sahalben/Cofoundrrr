import { useState } from 'react'
import { Button, Container, Eyebrow, Reveal, cx } from '../components/ui'
import { SEED_PROBLEMS } from '../features/problem-box/data/seed'

const showcaseProblems = SEED_PROBLEMS.slice(0, 4)

const sampleValidations: Record<string, { direct: number; observed: number; interest: number }> = {
  'pb-0001': { direct: 3, observed: 7, interest: 14 },
  'pb-0002': { direct: 8, observed: 15, interest: 29 },
  'pb-0003': { direct: 4, observed: 9, interest: 22 },
  'pb-0004': { direct: 2, observed: 5, interest: 18 },
}

export function ProblemBoxShowcase() {
  const [selectedId, setSelectedId] = useState<string>('pb-0001')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All')

  const industries = ['All', 'Fisheries & Livestock', 'Transport & Mobility', 'Healthcare', 'Disaster Management']

  const filtered = showcaseProblems.filter(
    (p) => selectedIndustry === 'All' || p.industry === selectedIndustry,
  )

  const active = showcaseProblems.find((p) => p.id === selectedId) ?? showcaseProblems[0]
  const val = sampleValidations[active.id] ?? { direct: 3, observed: 7, interest: 14 }
  const total = val.direct + val.observed + val.interest

  return (
    <section id="problem-box">
      <Container className="py-24 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="05">Problem Box</Eyebrow>
            <Reveal as="h2" className="mt-8 text-headline font-semibold text-forest">
              Start with what is broken. Not synthetic guesses.
            </Reveal>
          </div>
          <Reveal delay={100} className="text-lede text-ink/70 lg:col-span-4 lg:col-start-9">
            <p>
              A community-maintained wiki of high-friction real-world problems submitted by citizens, enterprises, and public bodies. Validated with first-hand experience, not vanity upvotes.
            </p>
            <div className="mt-6">
              <Button href="#/problems" size="lg" arrow>
                Explore Problems
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Product window mockup */}
        <Reveal delay={120} className="mt-16 overflow-hidden rounded-[12px] bg-white shadow-float lg:mt-24">
          {/* Mockup top bar */}
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5 bg-mist/40">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2.5 w-2.5 rounded-full bg-mint" />
              ))}
            </div>
            <span className="text-[0.75rem] text-ink/45">
              Problem Box · Real-World Problem Directory
            </span>
            <span className="text-[0.75rem] text-ink/30">Preview</span>
          </div>

          <div className="grid lg:grid-cols-12">
            {/* Left Column: Filter & Integrity rules */}
            <aside className="border-b border-line p-6 lg:col-span-3 lg:border-b-0 lg:border-r">
              <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45 font-semibold">
                Filter Industry
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter problems by industry">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    role="tab"
                    aria-selected={selectedIndustry === ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className={cx(
                      'h-8 rounded-[5px] px-2.5 text-[0.8125rem] transition-colors',
                      selectedIndustry === ind
                        ? 'bg-forest text-mist'
                        : 'bg-mist text-ink/70 hover:text-forest',
                    )}
                  >
                    {ind === 'Fisheries & Livestock' ? 'Livestock' : ind === 'Transport & Mobility' ? 'Transport' : ind}
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-[8px] border border-line bg-mist/80 p-4 text-[0.8125rem]">
                <div className="flex items-center gap-1.5 text-forest font-semibold text-xs uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                  <span>Data Integrity Rule</span>
                </div>
                <p className="mt-2 text-ink/75 leading-relaxed text-[0.75rem]">
                  Validations separate direct personal experience, observed impact, and general interest. We never combine them into a misleading single &ldquo;vote count&rdquo;.
                </p>
              </div>

            </aside>

            {/* Middle Column: Problem list */}
            <div className="border-b border-line lg:col-span-5 lg:border-b-0 lg:border-r">
              <div className="p-3 border-b border-line bg-mist/20 text-xs text-ink/60 flex items-center justify-between">
                <span>Problem Statements ({filtered.length})</span>
                <span className="text-[0.6875rem] text-ink/45">Ranked by experience</span>
              </div>
              <ul className="divide-y divide-line">
                {filtered.map((p) => {
                  const pVal = sampleValidations[p.id] ?? { direct: 1, observed: 2, interest: 5 }
                  const isSelected = selectedId === p.id
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(p.id)}
                        className={cx(
                          'flex w-full flex-col gap-2 p-5 text-left transition-colors',
                          isSelected ? 'bg-mist' : 'hover:bg-mist/60',
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-forest">
                            {p.ref}
                          </span>
                          <span className="text-[0.6875rem] rounded-[4px] bg-mint/80 px-1.5 py-0.5 font-medium text-forest">
                            {p.industry}
                          </span>
                        </div>
                        <p className="font-semibold text-[0.9375rem] leading-snug tracking-[-0.015em] text-forest">
                          {p.title}
                        </p>
                        <div className="flex items-center gap-2 text-[0.75rem] text-ink/60">
                          <span className="truncate max-w-[220px]">
                            {p.source?.organization || 'Community Member'}
                          </span>
                          <span className="text-ink/30">·</span>
                          <span className="text-forest font-medium">
                            {pVal.direct} direct
                          </span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Right Column: Statement detail */}
            <div
              key={active.id}
              className="p-6 lg:col-span-4 lg:p-8 flex flex-col justify-between"
              style={{ animation: 'fade-in .4s var(--ease-out-quint)' }}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-forest">{active.ref}</span>
                  <span className="rounded-full bg-forest px-2.5 py-0.5 text-[0.6875rem] font-semibold text-mist uppercase tracking-wide">
                    {active.severity ? `Lv.${active.severity} Severe` : 'Community'}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold leading-snug tracking-[-0.02em] text-forest">
                  {active.title}
                </h3>

                {active.source && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-[4px] bg-mint/60 px-2 py-1 text-[0.6875rem] font-medium text-forest">
                    <span>Provenance:</span>
                    <span className="font-semibold truncate max-w-[200px]">{active.source.organization}</span>
                  </div>
                )}

                <p className="mt-4 text-[0.875rem] leading-relaxed text-ink/80 line-clamp-4">
                  {active.description}
                </p>

                <div className="mt-4 rounded-[6px] bg-mist/80 p-3 text-xs">
                  <p className="font-semibold text-forest uppercase tracking-wider text-[0.625rem]">
                    Affected Audience
                  </p>
                  <p className="mt-1 text-ink/75 leading-relaxed">
                    {active.affectedAudience}
                  </p>
                </div>

                {/* Validation breakdown visualization */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-forest">Validation Breakdown</span>
                    <span className="text-[0.6875rem] text-ink/50">{total} contributors</span>
                  </div>

                  <div className="mt-2 space-y-1.5 text-xs">
                    <div>
                      <div className="flex justify-between text-[0.6875rem] text-ink/75 mb-0.5">
                        <span className="font-medium text-forest">Direct Experience</span>
                        <span className="font-mono">{val.direct}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-line/20 overflow-hidden">
                        <div
                          className="h-full bg-forest rounded-full"
                          style={{ width: `${Math.round((val.direct / total) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[0.6875rem] text-ink/75 mb-0.5">
                        <span className="text-ink/80">Observed First-hand</span>
                        <span className="font-mono">{val.observed}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-line/20 overflow-hidden">
                        <div
                          className="h-full bg-forest/60 rounded-full"
                          style={{ width: `${Math.round((val.observed / total) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[0.6875rem] text-ink/75 mb-0.5">
                        <span className="text-ink/60">General Interest</span>
                        <span className="font-mono">{val.interest}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-line/20 overflow-hidden">
                        <div
                          className="h-full bg-forest/30 rounded-full"
                          style={{ width: `${Math.round((val.interest / total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Illustrative card actions */}
              <div className="mt-6 flex gap-2">
                <span className="inline-flex h-10 flex-1 items-center justify-center rounded-[6px] bg-forest text-[0.875rem] font-medium text-mist">
                  Validate problem
                </span>
                <span className="inline-flex h-10 items-center justify-center rounded-[6px] px-4 text-[0.875rem] text-ink ring-1 ring-inset ring-ink/15">
                  Save
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-6 text-[0.75rem] text-ink/45">
          Interactive preview with community-validated problem statements.
        </p>
      </Container>
    </section>
  )
}
