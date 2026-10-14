import { Button, Container, Reveal } from '../components/ui'

export function ClosingCTA() {
  return (
    <section id="join" className="relative overflow-hidden bg-forest-deep text-mist">
      <svg aria-hidden viewBox="0 0 800 400" className="pointer-events-none absolute -right-40 top-1/2 h-[140%] -translate-y-1/2 opacity-[0.09] lg:right-0">
        <circle cx="300" cy="200" r="180" fill="none" stroke="#F0F7F4" strokeWidth="1.5" />
        <circle cx="500" cy="200" r="180" fill="none" stroke="#DDEEE6" strokeWidth="1.5" />
      </svg>
      <Container className="relative py-28 lg:py-44">
        <Reveal as="p" className="text-[0.8125rem] font-medium uppercase tracking-[0.16em] text-mint/70">
          Early access
        </Reveal>
        <Reveal as="h2" delay={80} className="mt-8 max-w-[14ch] text-display font-semibold">
          Find your people.
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal delay={160} className="text-lede text-mist/70 md:col-span-6 lg:col-span-5">
            Cofoundrrr is opening to its first members and founders. Join early and help shape the ecosystem from day one.
          </Reveal>
          <Reveal delay={220} className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end">
            <Button href="#join" id="cta-builder" size="lg" variant="light" arrow>
              Join as a builder
            </Button>
            <Button href="#join" id="cta-founder" size="lg" variant="ghost-dark">
              Join as a founder
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
