import type { CSSProperties, ElementType, ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(' ')
export { cx }
export { ErrorBoundary } from './ErrorBoundary'

/* ---------- Container: the 12-col editorial frame ---------- */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12', className)}>{children}</div>
}

/* ---------- Eyebrow: numbered section label ---------- */
export function Eyebrow({
  index,
  children,
  tone = 'light',
}: {
  index?: string
  children: ReactNode
  tone?: 'light' | 'dark'
}) {
  return (
    <div
      className={cx(
        'flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.16em]',
        tone === 'light' ? 'text-ink/60' : 'text-mist/60',
      )}
    >
      {index && <span className={cx('tabular-nums', tone === 'light' ? 'text-forest' : 'text-mint')}>{index}</span>}
      <span className={cx('h-px w-8', tone === 'light' ? 'bg-ink/25' : 'bg-mist/25')} />
      <span>{children}</span>
    </div>
  )
}

/* ---------- Button (Link or Form Action) ---------- */
type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'light' | 'ghost-dark'
  size?: 'md' | 'lg'
  arrow?: boolean
  className?: string
  children?: ReactNode
}

type ButtonProps = ButtonBaseProps & (
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
)

export function Button({
  variant = 'primary',
  size = 'md',
  arrow,
  className,
  children,
  ...rest
}: ButtonProps) {
  const variants = {
    primary: 'bg-forest text-mist hover:bg-forest-deep',
    secondary: 'bg-transparent text-ink ring-1 ring-inset ring-ink/20 hover:ring-ink/50',
    light: 'bg-mint text-forest hover:bg-mist',
    'ghost-dark': 'bg-transparent text-mist ring-1 ring-inset ring-mist/25 hover:ring-mist/60',
  }
  const sizes = { md: 'h-11 px-5 text-[0.9375rem]', lg: 'h-14 px-7 text-base' }
  const classes = cx(
    'group inline-flex items-center justify-center gap-2.5 rounded-[6px] font-medium tracking-[-0.01em] transition-colors duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    className,
  )

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
        {arrow && <Arrow className="transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:translate-x-1" />}
      </a>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
      {arrow && <Arrow className="transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:translate-x-1" />}
    </button>
  )
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

/* ---------- Reveal wrapper ---------- */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className,
  children,
}: {
  as?: ElementType
  delay?: number
  className?: string
  children: ReactNode
}) {
  return (
    <Tag className={cx('reveal', className)} style={{ '--delay': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  )
}

/* ---------- Avatar: initials monogram, no stock photos ---------- */
export function Avatar({
  initials,
  tone = 'forest',
  size = 48,
}: {
  initials: string
  tone?: 'forest' | 'mist' | 'mint' | 'ink'
  size?: number
}) {
  const tones = {
    forest: 'bg-forest text-mist',
    mist: 'bg-mist text-forest ring-1 ring-inset ring-forest/25',
    mint: 'bg-mint text-forest',
    ink: 'bg-ink text-mint',
  }
  return (
    <span
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-[-0.02em]', tones[tone])}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials}
    </span>
  )
}

/* ---------- Tag: squared, understated ---------- */
export function Tag({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  const tones = {
    light: 'bg-mint/70 text-ink',
    dark: 'bg-mist/10 text-mist/85',
  }
  return <span className={cx('inline-flex h-6 items-center rounded-[4px] px-2 text-[0.75rem] font-medium', tones[tone])}>{children}</span>
}
