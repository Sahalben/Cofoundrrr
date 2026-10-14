import { Arrow, Container, Reveal } from '../components/ui'
import { programs } from '../data/sample'

export function Programs() {
  return (
    <section id="programs">
      <Container className="py-24 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal as="h2" className="text-headline font-semibold text-forest">
              Structure for every stage.
            </Reveal>
          </div>
          <Reveal delay={100} className="text-lede text-ink/70 lg:col-span-4 lg:col-start-9">
            Cohort-based programs that help people grow, teams gel and ventures take shape. Planned for launch.
          </Reveal>
        </div>

        <div className="mt-16 border-t border-ink/15 lg:mt-24">
          {programs.map((p, i) => (
            <Reveal
              key={p.code}
              delay={i * 80}
              className="group grid gap-6 border-b border-ink/15 py-10 transition-colors hover:bg-mint/40 md:grid-cols-12 md:items-start md:px-4 lg:py-12"
            >
              <span className="text-sm tabular-nums text-ink/45 md:col-span-1">{p.code}</span>
              <div className="md:col-span-4">
                <h3 className="text-title font-semibold text-forest">{p.title}</h3>
                <p className="mt-2 text-sm text-ink/55">
                  {p.duration} · {p.format}
                </p>
              </div>
              <p className="leading-relaxed text-ink/75 md:col-span-4">{p.description}</p>
              <div className="flex items-start justify-between gap-4 md:col-span-3">
                <ul className="space-y-1.5 text-[0.875rem] text-ink/60">
                  {p.outcomes.map((o) => (
                    <li key={o}>— {o}</li>
                  ))}
                </ul>
                <Arrow className="mt-1 shrink-0 text-forest opacity-30 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
