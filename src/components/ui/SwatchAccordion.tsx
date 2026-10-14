import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import '../../styles/swatch-accordion.css'

export interface SwatchItem {
  title: string
  description?: string
  tags?: string
  color?: string
  image?: {
    src: string
    srcSet?: string
    alt?: string
  }
  focus?: number
  button?: string
  link?: string
  newTab?: boolean
}

interface BorderConfig {
  borderWidth?: number | string
  borderTopWidth?: number | string
  borderRightWidth?: number | string
  borderBottomWidth?: number | string
  borderLeftWidth?: number | string
  borderStyle?: string
  borderColor?: string
}

export interface SwatchAccordionProps {
  items?: SwatchItem[]
  openItem?: number
  trigger?: 'hover' | 'click'
  stripLink?: boolean
  autoplay?: boolean
  interval?: number
  direction?: 'auto' | 'row' | 'column'
  stripWidth?: number
  barHeight?: number
  narrowLayout?: 'image' | 'full'
  numbers?: boolean
  scrim?: boolean
  stripBorder?: BorderConfig
  titleTag?: 'h2' | 'h3' | 'h4'
  textColor?: string
  buttonColor?: string
  buttonTextColor?: string
  buttonRadius?: string
  radius?: string
  padding?: string
  gap?: string
  className?: string
  style?: React.CSSProperties
}

const STRIP_BORDER: BorderConfig = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'rgba(255, 255, 255, 0.28)',
}
const PLUS_BORDER: BorderConfig = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'rgba(255, 255, 255, 0.72)',
}
const TAG_BORDER: BorderConfig = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'rgba(255, 255, 255, 0.66)',
}
const BUTTON_BORDER: BorderConfig = {
  borderWidth: 0,
  borderStyle: 'solid',
  borderColor: 'rgb(20, 20, 20)',
}

const DEFAULT_IMAGES: Array<{ src: string; alt: string; srcSet?: string }> = [
  {
    src: 'https://framerusercontent.com/images/W1vHh9m78CQqEck7nFU4aEdqsWw.jpg',
    alt: 'Pistachio green paper sculpture of layered curved sheets with deep green shadows',
  },
  {
    src: 'https://framerusercontent.com/images/55pg3RZwwb6bZpDnzTRmAEHvhPA.jpg',
    alt: 'Stacked aqua paper layers rippling with deep teal shadows',
  },
  {
    src: 'https://framerusercontent.com/images/UOfiwX1MqEHC0FC9UNmOF30LY.jpg',
    alt: 'Periwinkle paper sheets flowing in waves with deep cobalt shadows',
  },
  {
    src: 'https://framerusercontent.com/images/d5EaywqblJ9eH7URTE5IBMBX73g.jpg',
    alt: 'Apricot paper fan sculpture of layered sheets with burnt orange shadows',
  },
]

function hasLink(link?: string): boolean {
  return typeof link === 'string' && link.trim().length > 0
}

function borderPx(v?: number | string): string | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return `${Math.max(0, v)}px`
  if (typeof v === 'string' && v.trim()) return /^\d*\.?\d+$/.test(v.trim()) ? `${v.trim()}px` : v.trim()
  return undefined
}

function colorKey(c?: string): string {
  const s = String(c || '').trim().toLowerCase()
  let m = s.match(/^#([0-9a-f]{3,8})$/)
  if (m) {
    let h = m[1]
    if (h.length === 3 || h.length === 4) h = h.split('').map((x) => x + x).join('')
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16)
    return [n(0), n(2), n(4), h.length === 8 ? Math.round((n(6) / 255) * 100) / 100 : 1].join(',')
  }
  m = s.match(/^rgba?\(([^)]+)\)$/)
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number)
    return [p[0], p[1], p[2], p.length > 3 ? Math.round(p[3] * 100) / 100 : 1].join(',')
  }
  return s.replace(/\s+/g, '')
}

function readBorder(value: BorderConfig | undefined, fallback: BorderConfig) {
  const v = value && typeof value === 'object' ? value : fallback
  const all = borderPx(v.borderWidth)
  const sides = [v.borderTopWidth, v.borderRightWidth, v.borderBottomWidth, v.borderLeftWidth].map(
    (side) => borderPx(side) ?? all ?? '0px',
  )
  const style = v.borderStyle || 'solid'
  const color = v.borderColor || fallback.borderColor || 'transparent'
  const base = borderPx(fallback.borderWidth) || '0px'
  const isDefault =
    sides.every((side) => side === base) &&
    style === (fallback.borderStyle || 'solid') &&
    colorKey(color) === colorKey(fallback.borderColor)

  return { isDefault, sides, width: sides.join(' '), style, color }
}

function pad2(n: number) {
  return n < 9 ? `0${n + 1}` : `${n + 1}`
}

function parseBox(value: string | undefined, fallback: string) {
  const parts = String(value || fallback).trim().split(/\s+/).filter(Boolean)
  const [t, r = t, b = t, l = r] = parts.length ? parts : [fallback]
  return { t, r, b, l }
}

const FALLBACK_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function toCssTransition() {
  const d = 0.75
  const zeta = 0.88
  const omega = 6.64 / d
  const x = (time: number) => {
    const wd = omega * Math.sqrt(1 - zeta * zeta)
    return 1 - Math.exp(-zeta * omega * time) * (Math.cos(wd * time) + ((zeta * omega) / wd) * Math.sin(wd * time))
  }
  let total = 0.05
  while (total < 4) {
    let settled = true
    for (let k = 0; k <= 10; k++) {
      if (Math.abs(1 - x(total + k * 0.02)) > 0.001) {
        settled = false
        break
      }
    }
    if (settled) break
    total += 0.02
  }
  const steps = 40
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const v = i === steps ? 1 : x((total * i) / steps)
    pts.push(String(Math.round(v * 1e4) / 1e4))
  }
  return { ease: `linear(${pts.join(', ')})`, fallback: FALLBACK_EASE, duration: total, delay: 0 }
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2.5V11.5M2.5 7H11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function graphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const Seg = (Intl as any).Segmenter
    return Array.from(new Seg(undefined, { granularity: 'grapheme' }).segment(text), (s: any) => s.segment)
  }
  return Array.from(text)
}

function SplitTitle({ text }: { text: string }) {
  const words = String(text || '').split(/\s+/).filter(Boolean)
  let c = 0
  return (
    <span aria-hidden="true">
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          <span className="swa-w" style={{ '--wi': String(wi) } as React.CSSProperties}>
            {graphemes(word).map((ch, k) => (
              <span key={k} className="swa-c" style={{ '--c': String(c++) } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </span>
  )
}

function countChars(text?: string) {
  return Math.max(1, String(text || '').replace(/\s+/g, '').length)
}

export function SwatchAccordion({
  items: itemsProp,
  openItem = 1,
  trigger = 'hover',
  stripLink = true,
  autoplay = false,
  interval = 5,
  direction = 'auto',
  stripWidth = 84,
  barHeight = 64,
  narrowLayout = 'image',
  numbers = true,
  scrim = true,
  stripBorder = STRIP_BORDER,
  titleTag: Heading = 'h3',
  textColor = '#F0F7F4',
  buttonColor = '#12261C',
  buttonTextColor = '#F0F7F4',
  buttonRadius = '999px',
  radius = '24px',
  padding = '28px',
  gap = '10px',
  className = '',
  style,
}: SwatchAccordionProps) {
  const items = itemsProp && itemsProp.length > 0 ? itemsProp : []
  const count = items.length
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])
  const hoverTimer = useRef<number | null>(null)
  const initial = Math.min(Math.max(Math.round(openItem) - 1, 0), Math.max(0, count - 1))

  const [{ active, prev }, setOpenState] = useState({ active: initial, prev: initial })
  const setActive = useCallback((next: number | ((curr: number) => number)) => {
    setOpenState((s) => {
      const value = typeof next === 'function' ? next(s.active) : next
      return value === s.active ? s : { active: value, prev: s.active }
    })
  }, [])

  const [hoverPause, setHoverPause] = useState(false)
  const [focusPause, setFocusPause] = useState(false)
  const paused = hoverPause || focusPause
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    setOpenState({ active: initial, prev: initial })
  }, [initial])

  useEffect(() => {
    return () => {
      if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current)
    }
  }, [])

  const autoplayOn = autoplay && count > 1

  const open = useCallback(
    (index: number) => {
      setCycle((c) => c + 1)
      setActive(index)
    },
    [setActive],
  )

  const advance = useCallback(() => {
    setCycle((c) => c + 1)
    setActive((a) => (a + 1) % count)
  }, [count, setActive])

  const onStripEnter = (e: React.PointerEvent, index: number) => {
    if (trigger !== 'hover' || e.pointerType !== 'mouse') return
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => {
      hoverTimer.current = null
      open(index)
    }, 110)
  }

  const onStripLeave = () => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
  }

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % count
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + count) % count
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = count - 1
    if (next >= 0) {
      e.preventDefault()
      triggerRefs.current[next]?.focus()
    }
  }

  const t = toCssTransition()
  const autoHeight = !(style && (style.height === '100%' || typeof style.height === 'number'))
  const pad = parseBox(padding, '28px')
  const gapParts = String(gap || '8px').trim().split(/\s+/).filter(Boolean)
  const rowGap = gapParts[0] || '8px'
  const colGap = gapParts[1] || rowGap

  const many = count > 8
  const stripPx = Math.max(40, stripWidth)
  const barPx = Math.max(40, barHeight)
  const closedSize = many
    ? `min(${stripPx}px, max(48px, calc((100cqw * 0.6 - ${count - 1} * ${colGap}) / ${count - 1})))`
    : `${stripPx}px`
  const barSize = many && !autoHeight
    ? `min(${barPx}px, max(44px, calc((100cqh * 0.6 - ${count - 1} * ${rowGap}) / ${count - 1})))`
    : `${barPx}px`

  const toRadius = (v: any) => (typeof v === 'number' ? `${Number.isFinite(v) && v < 100 ? Math.max(0, v) : 999}px` : String(v || '').trim() || '999px')
  const sb = readBorder(stripBorder, STRIP_BORDER)
  const pb = readBorder(PLUS_BORDER, PLUS_BORDER)
  const tb = readBorder(TAG_BORDER, TAG_BORDER)
  const bb = readBorder(BUTTON_BORDER, BUTTON_BORDER)

  const borderVars: Record<string, string> = {}
  if (!sb.isDefault) Object.assign(borderVars, { '--swa-sb-w': sb.width, '--swa-sb-s': sb.style, '--swa-sb-c': sb.color })
  if (!pb.isDefault) Object.assign(borderVars, { '--swa-pb-w': pb.width, '--swa-pb-s': pb.style, '--swa-pb-c': pb.color })
  if (!tb.isDefault) Object.assign(borderVars, { '--swa-tb-w': tb.width, '--swa-tb-s': tb.style, '--swa-tb-c': tb.color })
  if (!bb.isDefault) Object.assign(borderVars, { '--swa-bb-w': bb.width, '--swa-bb-s': bb.style, '--swa-bb-c': bb.color })

  const rootStyle: React.CSSProperties = {
    ...style,
    position: 'relative',
    color: textColor,
    ...({
      '--swa-n': String(count),
      '--swa-closed': closedSize,
      '--swa-bar': barSize,
      '--swa-gap': colGap,
      '--swa-gap-row': rowGap,
      '--swa-radius': radius,
      '--swa-pt': pad.t,
      '--swa-pr': pad.r,
      '--swa-pb': pad.b,
      '--swa-pl': pad.l,
      '--swa-text': textColor,
      '--swa-btn': buttonColor,
      '--swa-btn-text': buttonTextColor,
      '--swa-btn-r': toRadius(buttonRadius),
      '--swa-plus-r': toRadius('999px'),
      '--swa-tag-r': toRadius('999px'),
      ...borderVars,
      '--swa-title-size': 'clamp(2rem, 3.8vw, 3.5rem)',
      '--swa-strip-size': '20px',
      '--swa-body-size': '15px',
      '--swa-label-size': '12px',
      '--swa-dur': `${t.duration}s`,
      '--swa-delay': `${t.delay}s`,
      '--swa-ease': t.ease,
      '--swa-ease-fallback': t.fallback,
    } as any),
  }

  return (
    <div
      ref={rootRef}
      className={`swa ${className}`}
      data-dir={direction}
      data-auto-height={autoHeight ? '' : undefined}
      data-scrim={scrim ? '' : undefined}
      data-narrow={narrowLayout === 'full' ? 'full' : undefined}
      data-strip-border={sb.isDefault ? undefined : 'custom'}
      data-plus-border={pb.isDefault ? undefined : 'custom'}
      data-tag-border={tb.isDefault ? undefined : 'custom'}
      data-btn-border={bb.isDefault ? undefined : 'custom'}
      data-many={many ? '' : undefined}
      style={rootStyle}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHoverPause(true)}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setHoverPause(false)
        onStripLeave()
      }}
      onFocus={(e) => {
        let keyboard = true
        try {
          keyboard = (e.target as HTMLElement).matches(':focus-visible')
        } catch {}
        setFocusPause(keyboard)
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusPause(false)
      }}
    >
      <div className="swa-track">
        {items.map((item, index) => {
          const isOpen = index === active
          const pinEnd = (isOpen && index > prev) || (index === prev && !isOpen && index > active)
          const fallbackImg = DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]
          const image = item.image?.src ? item.image : fallbackImg
          const focus = Math.min(100, Math.max(0, Number.isFinite(item.focus) ? (item.focus as number) : 50)) / 100
          const tags = String(item.tags || '').split(',').map((s) => s.trim()).filter(Boolean)
          const linked = hasLink(item.link)
          const triggerId = `swa-${uid}-t${index}`
          const panelId = `swa-${uid}-p${index}`
          const headingId = `swa-${uid}-h${index}`
          const stripStyle = {
            '--swa-color': item.color || '#1A3828',
            '--swa-focus': String(focus),
          } as React.CSSProperties

          return (
            <div
              key={index}
              className="swa-strip"
              data-open={isOpen ? '' : undefined}
              data-pin={pinEnd ? 'end' : undefined}
              style={stripStyle}
              onPointerEnter={(e) => onStripEnter(e, index)}
              onPointerLeave={onStripLeave}
            >
              <div className="swa-media" aria-hidden="true">
                <img
                  className="swa-img"
                  src={image.src}
                  srcSet={image.srcSet}
                  sizes="(max-width: 640px) 100vw, 1100px"
                  alt={image.alt || ''}
                  draggable={false}
                  loading="eager"
                  decoding="async"
                />
                <div className="swa-scrim" />
              </div>

              <button
                ref={(el) => {
                  triggerRefs.current[index] = el
                }}
                id={triggerId}
                type="button"
                className="swa-trigger"
                aria-label={item.title || `Item ${index + 1}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => open(index)}
                onKeyDown={(e) => onKeyDown(e, index)}
              />

              {isOpen && stripLink && linked ? (
                <a
                  className="swa-strip-link"
                  href={item.link}
                  target={item.newTab ? '_blank' : undefined}
                  rel={item.newTab ? 'noopener noreferrer' : undefined}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              ) : null}

              <div className="swa-closed" aria-hidden="true">
                {numbers ? <span className="swa-num">{pad2(index)}</span> : <span />}
                <span className="swa-vt">
                  <span className="swa-vtitle">{item.title}</span>
                </span>
                <span className="swa-plw">
                  <span className="swa-plus">
                    <PlusIcon className="swa-pi" />
                    <span className="swa-pf">
                      <PlusIcon className="swa-pi" />
                    </span>
                  </span>
                </span>
              </div>

              <div
                id={panelId}
                role="region"
                aria-labelledby={headingId}
                className="swa-open"
                style={{ '--cn': String(countChars(item.title)) } as React.CSSProperties}
                {...(isOpen ? {} : ({ inert: '', 'aria-hidden': true } as any))}
              >
                <div className="swa-top">
                  {numbers ? (
                    <span className="swa-rv swa-rv-num" aria-hidden="true">
                      <span className="swa-num">{pad2(index)}</span>
                    </span>
                  ) : (
                    <span />
                  )}
                  {tags.length ? (
                    <ul className="swa-tags" aria-label="Tags">
                      {tags.map((tag, i) => (
                        <li key={i} className="swa-tag" style={{ '--i': String(i) } as React.CSSProperties}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="swa-content">
                  <Heading id={headingId} className="swa-title" aria-label={item.title || undefined}>
                    <SplitTitle text={item.title} />
                  </Heading>
                  {item.description ? (
                    <div className="swa-rv swa-rv-desc">
                      <p className="swa-desc">{item.description}</p>
                    </div>
                  ) : null}
                  {item.button && item.button.trim() ? (
                    <div className="swa-rc">
                      {linked ? (
                        <a
                          className="swa-cta"
                          href={item.link}
                          target={item.newTab ? '_blank' : undefined}
                          rel={item.newTab ? 'noopener noreferrer' : undefined}
                        >
                          <span>{item.button}</span>
                          <ArrowIcon />
                        </a>
                      ) : (
                        <span className="swa-cta swa-cta-static">
                          <span>{item.button}</span>
                          <ArrowIcon />
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>

                {autoplayOn && isOpen ? (
                  <div className="swa-progress" aria-hidden="true">
                    <i
                      style={{
                        animationDuration: `${Math.max(1, interval)}s`,
                        animationPlayState: paused ? 'paused' : 'running',
                      }}
                      onAnimationEnd={advance}
                      key={`${index}-${cycle}`}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default SwatchAccordion
