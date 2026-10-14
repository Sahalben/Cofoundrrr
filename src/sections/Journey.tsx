import { Container, Eyebrow, Reveal } from '../components/ui'

const stages = [
  { n: 'People', d: 'Discover your professional identity and make it visible.', glyph: 1 },
  { n: 'Teams', d: 'Meet complementary collaborators and form around shared intent.', glyph: 3 },
  { n: 'Projects', d: 'Prove the partnership by building something real together.', glyph: 5 },
  { n: 'Startups', d: 'Develop promising projects into ventures, with programs and, over time, access to investment.', glyph: 7 },
]

function Glyph({ count }: { count: number }) {
  // Dots accumulate and cluster — an abstract picture of formation.
  const pts = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2
    const r = count === 1 ? 0 : 14
    return [32 + Math.cos(a) * r, 32 + Math.sin(a) * r]
  })
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
      {count > 1 && <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeOpacity=".25" />}
      {count >= 7 && <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeOpacity=".6" />}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={i === 0 ? '#F0F7F4' : 'currentColor'} />
      ))}
    </svg>
  )
}

export function Journey() {
  return (
    <section id="journey" className="bg-forest text-mist">
      <Container className="py-24 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow index="06" tone="dark">The ecosystem</Eyebrow>
          </div>
          <Reveal as="h2" className="text-headline font-semibold lg:col-span-8">
            People <span className="text-mint/45">→</span> teams <span className="text-mint/45">→</span> projects{' '}
            <span className="text-mint/45">→</span> startups.
          </Reveal>
        </div>

        <ol className="relative mt-20 grid gap-0 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          <span aria-hidden className="absolute left-0 right-0 top-8 hidden h-px bg-line-dark lg:block" />
          {stages.map((s, i) => (
            <Reveal
              as="li"
              key={s.n}
              delay={i * 120}
              className="relative border-t border-line-dark py-10 sm:pr-8 lg:border-t-0 lg:py-0"
            >
              <div className="relative bg-forest pr-4 text-mint lg:inline-block">
                <Glyph count={s.glyph} />
              </div>
              <p className="mt-8 text-sm tabular-nums text-mist/45">Stage 0{i + 1}</p>
              <h3 className="mt-2 text-title font-semibold">{s.n}</h3>
              <p className="mt-4 max-w-[17rem] leading-relaxed text-mist/65">{s.d}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  )
}
