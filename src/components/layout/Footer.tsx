import { Button, Container } from '../ui'

const navGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'People', href: '#profiles' },
      { label: 'Startups', href: '#profiles' },
      { label: 'Problem Box', href: '#/problems' },
      { label: 'Projects', href: '#journey' },
    ],
  },
  {
    title: 'Build',
    links: [
      { label: 'Programs', href: '#programs' },
      { label: 'Community', href: '#discovery' },
      { label: 'Our mission', href: '#problem' },
      { label: 'Contact', href: 'mailto:hello@cofoundrrr.com' },
    ],
  },
  {
    title: 'Information',
    links: [
      { label: 'Privacy', href: '#privacy' },
      { label: 'Terms', href: '#terms' },
      { label: 'Help', href: 'mailto:support@cofoundrrr.com' },
    ],
  },
]

function GithubIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function InstagramIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer
      id="join"
      className="relative flex min-h-[920px] flex-col justify-between overflow-hidden bg-[#080A09] text-mist"
    >
      {/* Full-bleed background mountain photograph */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <img
          src="/footer-mountain.jpg"
          alt="Mountaineers approaching summit together"
          className="h-full w-full object-cover object-[center_80%] sm:object-[center_66%] grayscale"
          loading="eager"
          decoding="async"
        />
        {/* Soft multi-stop gradient scrim to guarantee flawless text contrast while keeping photo texture and grain visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(8,10,9,0.96) 0%, rgba(8,10,9,0.90) 38%, rgba(8,10,9,0.76) 58%, rgba(8,10,9,0.30) 76%, rgba(8,10,9,0.94) 100%)',
          }}
        />
      </div>

      {/* Main Content Container */}
      <Container className="relative z-10 flex flex-1 flex-col justify-between pb-8 pt-24 sm:pt-32 lg:pt-36">
        {/* Upper Grid: Brand + Early Access + Navigation Columns */}
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Left Column: Early access, Headline, Description, CTAs, Social */}
          <div className="max-w-xl lg:col-span-6">
            <span className="inline-block text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-mint">
              Early access
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-mist sm:text-4xl lg:text-5xl">
              Find your people.
            </h2>
            <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-mist/85 sm:text-base">
              Cofoundrrr is opening to its first members and founders. Join early to find your people, build meaningful projects, and turn ambitious ideas into reality.
            </p>

            {/* Early Access Action CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
              <Button href="#join" id="cta-builder" size="lg" variant="light" arrow className="w-full sm:w-auto justify-center">
                Join as a builder
              </Button>
              <Button href="#join" id="cta-founder" size="lg" variant="ghost-dark" className="w-full sm:w-auto justify-center">
                Join as a founder
              </Button>
            </div>

            {/* Social icons row — verified active repository & Instagram */}
            <div className="mt-8 flex items-center gap-3">
              <a
                href="https://github.com/Sahalben/Cofoundrrr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cofoundrrr GitHub repository"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/10 text-mist/90 transition-colors hover:bg-mint hover:text-forest-deep"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/cofoundrrr?utm_source=ig_web_button_share_sheet&mdxt=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cofoundrrr Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/10 text-mist/90 transition-colors hover:bg-mint hover:text-forest-deep"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Three evenly spaced navigation columns */}
          <div className="grid grid-cols-3 gap-4 sm:gap-10 lg:col-span-6 lg:gap-14 lg:justify-end">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-[0.875rem] sm:text-[0.9375rem] font-semibold tracking-[-0.01em] text-mist">
                  {group.title}
                </h3>
                <ul className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[0.8125rem] sm:text-[0.875rem] text-mist/75 transition-colors hover:text-mint"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Space in middle allows the mountaineers approaching the summit to be prominently visible */}
        <div className="min-h-[140px] sm:min-h-[220px] lg:min-h-[280px]" aria-hidden="true" />

        {/* Bottom Legal Row with Thin Divider */}
        <div className="w-full">
          <div className="h-px w-full bg-white/15" aria-hidden="true" />
          <div className="flex flex-col gap-3 pt-6 text-[0.8125rem] text-mist/75 sm:flex-row sm:items-center sm:justify-between">
            <p>© Cofoundrrr 2026. All rights reserved.</p>
            <p className="sm:text-right font-medium text-mist/90">You never build alone.</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
export default Footer
