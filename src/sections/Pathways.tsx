import { Arrow, Container, Eyebrow, Reveal, cx } from '../components/ui'

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
    <section id="pathways">
      <Container className="py-24 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="02">Two pathways</Eyebrow>
            <Reveal as="h2" className="mt-8 text-headline font-semibold text-forest">
              One ecosystem. Two ways in.
            </Reveal>
          </div>
          <Reveal delay={100} className="text-lede text-ink/70 lg:col-span-4 lg:col-start-9">
            Whether you bring the skills or the vision, Cofoundrrr is designed around how teams actually form.
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 lg:mt-24 lg:grid-cols-2">
          {paths.map((p, i) => (
            <Reveal
              key={p.id}
              delay={i * 120}
              className={cx(
                'group flex flex-col rounded-[12px] p-8 sm:p-12',
                p.dark ? 'bg-ink text-mist' : 'bg-mint text-ink',
              )}
            >
              <p className={cx('text-[0.8125rem] font-medium uppercase tracking-[0.14em]', p.dark ? 'text-mint/70' : 'text-forest/60')}>
                {p.label}
              </p>
              <h3 className={cx('mt-10 text-title font-semibold sm:text-[2.5rem]', p.dark ? 'text-mist' : 'text-forest')}>{p.title}</h3>
              <p className={cx('mt-5 max-w-md leading-relaxed', p.dark ? 'text-mist/70' : 'text-ink/70')}>{p.body}</p>
              <ul className={cx('mt-10 divide-y border-y', p.dark ? 'divide-line-dark border-line-dark' : 'divide-line border-line')}>
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-4 py-4 text-[0.9375rem]">
                    <span className={cx('h-1.5 w-1.5 rounded-full', p.dark ? 'bg-mint' : 'bg-forest')} />
                    {pt}
                  </li>
                ))}
              </ul>
              <a
                href="#join"
                id={`pathway-cta-${p.id}`}
                className={cx('mt-10 inline-flex items-center gap-2 self-start font-medium', p.dark ? 'text-mint' : 'text-forest')}
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
