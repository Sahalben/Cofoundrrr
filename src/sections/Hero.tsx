import { Container } from '../components/ui'

/**
 * Hero — single statement on Mint, with the brand mark (two interlocking
 * rings) drawn as oversized line art behind the type.
 */
export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-mint text-forest">
      <svg
        aria-hidden
        viewBox="0 0 900 600"
        fill="none"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-auto max-w-none -translate-x-[30%] -translate-y-[55%] sm:-translate-x-[38%] lg:-translate-x-[42%]"
      >
        {[
          { cx: 360, d: 0 },
          { cx: 540, d: 0.25 },
        ].map((c) => (
          <circle
            key={c.cx}
            cx={c.cx}
            cy="300"
            r="240"
            stroke="currentColor"
            strokeOpacity=".16"
            strokeWidth="1.25"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1,
              animation: `draw 2.4s ${0.2 + c.d}s var(--ease-out-quint) forwards`,
            }}
          />
        ))}
      </svg>

      <Container className="relative flex flex-1 flex-col justify-end pb-14 pt-32 sm:pb-20 lg:pb-24">
        <h1
          className="font-bold uppercase leading-[0.9] tracking-[-0.045em] text-forest"
          style={{ fontSize: 'clamp(3.5rem, 11vw, 11rem)', animation: 'fade-in 1.1s var(--ease-out-quint) both' }}
        >
          You never
          <br />
          build alone.
        </h1>
      </Container>

      <a
        href="#problem"
        id="hero-scroll"
        aria-label="Scroll to next section"
        className="absolute bottom-8 right-5 text-forest/70 transition-transform duration-500 hover:translate-y-1 sm:right-8 lg:bottom-12 lg:right-12"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M7 1v12M2 8l5 5 5-5" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </a>
    </section>
  )
}
