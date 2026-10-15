import { Arrow, Container, Reveal } from '../components/ui'
import { programs } from '../data/sample'

export function Programs() {
  return (
    <section id="programs" className="bg-[#000000] text-mist">
      <Container className="py-24 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal as="h2" className="text-headline font-semibold text-mist">
              Structure for every stage.
            </Reveal>
          </div>
          <Reveal delay={100} className="text-lede text-mist/80 lg:col-span-4 lg:col-start-9">
            Cohort-based programs that help people grow, teams gel and ventures take shape. Planned for launch.
          </Reveal>
        </div>

        <div className="mt-16 border-t border-line-dark lg:mt-24">
          {programs.map((p, i) => (
            <Reveal
              key={p.code}
              delay={i * 80}
              className="group grid gap-6 border-b border-line-dark py-10 transition-colors hover:bg-white/[0.04] md:grid-cols-12 md:items-start md:px-4 lg:py-12"
            >
              <span className="text-sm font-semibold tabular-nums text-mint md:col-span-1">{p.code}</span>
              <div className="md:col-span-4">
                <h3 className="text-title font-semibold text-mist">{p.title}</h3>
                <p className="mt-2 text-sm text-mist/70">
                  {p.duration} · {p.format}
                </p>
              </div>
              <p className="leading-relaxed text-mist/85 md:col-span-4">{p.description}</p>
              <div className="flex items-start justify-between gap-4 md:col-span-3">
                <ul className="space-y-1.5 text-[0.875rem] text-mist/75">
                  {p.outcomes.map((o) => (
                    <li key={o}>
                      <span className="text-mint mr-1.5">—</span>
                      {o}
                    </li>
                  ))}
                </ul>
                <Arrow className="mt-1 shrink-0 text-mint opacity-60 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
