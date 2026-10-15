import { useEffect, useRef } from 'react'
import { Container } from '../components/ui'

/**
 * Hero — single statement with ambient video background at full opacity.
 * Original pure SVG version is preserved in Hero.original.tsx for instant revert.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.defaultMuted = true
      video.muted = true
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry on next user interaction or document visibility change
        })
      }
    }
  }, [])

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#000000] text-mist">
      {/* Background ambient video with seamless fade to black at bottom */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/hero-bg-2.mp4"
          className="h-full w-full object-cover"
          style={{
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0) 100%)',
          }}
        >
          <source src="/hero-bg-2.mp4" type="video/mp4" />
        </video>

        {/* Soft multi-stop gradient overlay to ensure smooth, banding-free transition to #000000 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,0.03) 48%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.52) 82%, rgba(0,0,0,0.78) 91%, rgba(0,0,0,0.94) 97%, #000000 100%)',
          }}
        />
      </div>

      <Container className="relative z-10 flex flex-1 flex-col justify-end pb-14 pt-32 sm:pb-20 lg:pb-24">
        <h1
          className="font-bold uppercase leading-[0.9] tracking-[-0.045em] text-mist"
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
        className="absolute bottom-8 right-5 z-10 text-mist/70 transition-transform duration-500 hover:translate-y-1 sm:right-8 lg:bottom-12 lg:right-12"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M7 1v12M2 8l5 5 5-5" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </a>
    </section>
  )
}
