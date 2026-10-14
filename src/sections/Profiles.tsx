import { Container, Reveal } from '../components/ui'
import { MemberCard, StartupCard } from '../components/mockups/ProfileCards'
import { members, startup } from '../data/sample'

export function Profiles() {
  return (
    <section id="profiles" className="overflow-hidden bg-mint/60">
      <Container className="py-24 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal as="h2" className="text-headline font-semibold text-forest">
              Identity, made legible.
            </Reveal>
            <Reveal delay={100} className="mt-8 max-w-sm text-lede text-ink/70">
              Member profiles describe how someone thinks and what they've built. Startup profiles describe where a venture is
              and who it needs next.
            </Reveal>
            <Reveal delay={160} className="mt-10 space-y-5 border-t border-line pt-8 text-[0.9375rem]">
              {[
                ['Members', 'Capabilities, work, intent'],
                ['Startups', 'Thesis, stage, open roles'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="font-medium text-forest">{k}</span>
                  <span className="text-ink/60">{v}</span>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Editorial composition: overlapping, offset cards */}
          <div className="relative lg:col-span-8">
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <Reveal delay={80} className="sm:mt-16">
                <MemberCard member={members[0]} />
              </Reveal>
              <Reveal delay={200}>
                <StartupCard startup={startup} />
              </Reveal>
              <Reveal delay={280} className="sm:-mt-24 sm:ml-10">
                <MemberCard member={members[1]} compact />
              </Reveal>
            </div>
            <p className="mt-8 text-[0.75rem] text-ink/45 sm:text-right">Illustrative profiles. People and ventures shown are fictional.</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
