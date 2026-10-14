import { Container } from '../ui'
import { Wordmark, navLinks } from './Nav'

export function Footer() {
  return (
    <footer className="bg-forest-deep text-mist">
      <Container className="grid gap-10 border-t border-line-dark py-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
          <Wordmark tone="light" />
          <p className="mt-4 max-w-xs text-sm text-mist/55">You never build alone.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3 md:col-span-5">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-mist/65 transition-colors hover:text-mist">
              {l.label}
            </a>
          ))}
        </nav>
        <p className="text-sm text-mist/40 md:col-span-2 md:text-right">© {new Date().getFullYear()} Cofoundrrr</p>
      </Container>
    </footer>
  )
}
