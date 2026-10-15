import { Arrow, Container, Reveal, cx } from '../components/ui'

const paths = [
  {
    id: 'builders',
    label: 'For builders & experts',
    title: 'Show what you can really do.',
    body: 'Build a profile around capabilities and work, not titles. Get discovered by founders and peers who need exactly what you bring.',
    points: ['Capability-led profile', 'Portfolio of real projects', 'Invitations to join teams'],
    cta: 'Join as a builder',
    dark: false,
  },
  {
    id: 'founders',
    label: 'For founders',
    title: 'Build the team your idea deserves.',
    body: 'Present your startup with clarity, define the roles you need, and meet complementary people ready to commit.',
    points: ['Startup profile & milestones', 'Open roles with clear terms', 'Shortlists of compatible talent'],
    cta: 'Join as a founder',
    dark: true,
  },
]

export function Pathways() {
  return (
    <section id="pathways" className="bg-[#000000] text-mist">
      <Container className="py-24 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal as="h2" className="text-headline font-semibold text-mist">
              One ecosystem. Two ways in.
            </Reveal>
          </div>
          <Reveal delay={100} className="text-lede text-mist/80 lg:col-span-4 lg:col-start-9">
            Whether you bring the skills or the vision, Cofoundrrr is designed around how teams actually form.
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 lg:mt-24 lg:grid-cols-2">
          {paths.map((p, i) => (
            <Reveal
              key={p.id}
              delay={i * 120}
              className={cx(
                'group flex flex-col rounded-[12px] p-6 sm:p-12 transition-all duration-300',
                p.dark
                  ? 'bg-[#0E2219] border border-mint/25 text-mist shadow-xl hover:border-mint/50 hover:-translate-y-0.5'
                  : 'bg-[#0C1712] border border-white/12 text-mist shadow-xl hover:border-white/25 hover:-translate-y-0.5',
              )}
            >
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-mint">
                {p.label}
              </p>
              <h3 className="mt-10 text-title font-semibold text-mist sm:text-[2.5rem]">{p.title}</h3>
              <p className="mt-5 max-w-md leading-relaxed text-mist/80">{p.body}</p>
              <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-4 py-4 text-[0.9375rem] text-mist/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_8px_rgba(221,238,230,0.6)]" />
                    {pt}
                  </li>
                ))}
              </ul>
              <a
                href="#join"
                id={`pathway-cta-${p.id}`}
                className="mt-10 inline-flex items-center gap-2 self-start font-medium text-mint transition-colors hover:text-white"
              >
                {p.cta}
                <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
