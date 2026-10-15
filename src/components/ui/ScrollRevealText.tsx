import React, { useEffect, useMemo, useRef, useState } from 'react'

export interface ScrollRevealTextProps {
  text?: string
  primaryText?: string
  secondaryText?: string
  secondaryFrom?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div' | 'span'
  className?: string
  style?: React.CSSProperties
  splitMode?: 'Lines' | 'Words' | 'Characters'
  preset?: 'Masked Lines' | 'Default' | 'Fade In Up' | 'Blur Reveal' | 'Cinematic'
  stagger?: number
  xOffset?: number
  yOffset?: number
  blur?: number
  rotateX?: number
  perspective?: number
  scale?: number
  offsetStart?: number
  offsetEnd?: number
  trigger?: 'Scroll' | 'On Load'
  onLoadDuration?: number
}

const PRESETS = {
  'Masked Lines': {
    splitMode: 'Lines' as const,
    stagger: 0.15,
    xOffset: 0,
    yOffset: 0,
    blur: 0,
    rotateX: 0,
    perspective: 800,
    scale: 1,
  },
  Default: {
    splitMode: 'Characters' as const,
    stagger: 0.2,
    xOffset: 7,
    yOffset: 0,
    blur: 0,
    rotateX: 0,
    perspective: 800,
    scale: 1,
  },
  'Fade In Up': {
    splitMode: 'Characters' as const,
    stagger: 0.15,
    xOffset: 0,
    yOffset: 25,
    blur: 0,
    rotateX: 0,
    perspective: 800,
    scale: 1,
  },
  'Blur Reveal': {
    splitMode: 'Characters' as const,
    stagger: 0.2,
    xOffset: 0,
    yOffset: 0,
    blur: 8,
    rotateX: 0,
    perspective: 800,
    scale: 1,
  },
  Cinematic: {
    splitMode: 'Characters' as const,
    stagger: 0.12,
    xOffset: 10,
    yOffset: 20,
    blur: 4,
    rotateX: 0,
    perspective: 800,
    scale: 1,
  },
}

export function ScrollRevealText({
  text: rawText,
  primaryText,
  secondaryText,
  secondaryFrom,
  as: Tag = 'h2',
  className = '',
  style,
  preset = 'Masked Lines',
  splitMode: splitModeProp,
  stagger: staggerProp,
  xOffset: xOffsetProp,
  yOffset: yOffsetProp,
  blur: blurProp,
  rotateX: rotateXProp,
  perspective: perspectiveProp,
  scale: scaleProp,
  offsetStart = 85,
  offsetEnd = 25,
  trigger = 'Scroll',
  onLoadDuration = 1.2,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const lineRefs = useRef<(HTMLElement | null)[]>([])
  const isVisible = useRef(false)
  const rafId = useRef(0)
  const scheduled = useRef(false)
  const [lineGroups, setLineGroups] = useState<number[][] | null>(null)

  // Assemble full text
  const fullText = useMemo(() => {
    if (primaryText && secondaryText) {
      return `${primaryText.trim()} ${secondaryText.trim()}`
    }
    return rawText || ''
  }, [rawText, primaryText, secondaryText])

  const presetConfig = PRESETS[preset] || PRESETS['Masked Lines']
  const splitMode = splitModeProp ?? presetConfig.splitMode
  const stagger = staggerProp ?? presetConfig.stagger
  const xOffset = xOffsetProp ?? presetConfig.xOffset
  const yOffset = yOffsetProp ?? presetConfig.yOffset
  const blur = blurProp ?? presetConfig.blur
  const rotateX = rotateXProp ?? presetConfig.rotateX
  const perspective = perspectiveProp ?? presetConfig.perspective
  const scale = scaleProp ?? presetConfig.scale
  const isLinesMode = splitMode === 'Lines'

  // Word groups with secondary/muted classification
  const { wordGroups } = useMemo(() => {
    const tokens = fullText.split(/(\s+)/)
    const groups: Array<{ type: 'word' | 'space'; text: string; isSecondary: boolean }> = []
    let charOffset = 0

    const secondaryBoundary = secondaryText
      ? fullText.indexOf(secondaryText.trim())
      : secondaryFrom
        ? fullText.indexOf(secondaryFrom.trim())
        : -1

    tokens.forEach((token) => {
      const isSpace = /^\s+$/.test(token)
      const tokenStart = charOffset
      charOffset += token.length
      const isSecondary = secondaryBoundary !== -1 && tokenStart >= secondaryBoundary

      if (isSpace) {
        groups.push({ type: 'space', text: token, isSecondary })
      } else {
        groups.push({ type: 'word', text: token, isSecondary })
      }
    })

    return { wordGroups: groups }
  }, [fullText, secondaryText, secondaryFrom])

  // Detect line breaks by DOM top position of rendered words
  useEffect(() => {
    if (!isLinesMode) return

    const detect = () => {
      const container = containerRef.current
      if (!container) return
      const wordEls = container.querySelectorAll<HTMLElement>('[data-wg]')
      if (wordEls.length === 0) return

      const positions: { gi: number; top: number }[] = []
      wordEls.forEach((el) => {
        positions.push({
          gi: parseInt(el.dataset.wg || '0', 10),
          top: Math.round(el.getBoundingClientRect().top),
        })
      })

      const lineWordGis: number[][] = []
      let currentLine: number[] = []
      let lastTop = -Infinity

      positions.forEach(({ gi, top }) => {
        if (currentLine.length > 0 && Math.abs(top - lastTop) > 3) {
          lineWordGis.push([...currentLine])
          currentLine = []
        }
        currentLine.push(gi)
        lastTop = top
      })
      if (currentLine.length > 0) lineWordGis.push([...currentLine])

      const lines = lineWordGis.map((wGis, li) => {
        const start = wGis[0]
        const end = li < lineWordGis.length - 1 ? lineWordGis[li + 1][0] : wordGroups.length
        return Array.from({ length: end - start }, (_, k) => start + k)
      })

      setLineGroups(lines)
    }

    requestAnimationFrame(() => requestAnimationFrame(detect))

    const handleResize = () => {
      requestAnimationFrame(detect)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [fullText, isLinesMode, wordGroups.length])

  // Scroll / In-view animation engine
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (isLinesMode && !lineGroups) return

    const totalUnits = isLinesMode && lineGroups ? lineGroups.length : 1
    if (totalUnits === 0) return

    const dur = 0.65
    const totalTime = dur + (totalUnits - 1) * stagger

    const applyProgress = (scrollP: number) => {
      const time = scrollP * totalTime
      if (isLinesMode) {
        lineRefs.current.forEach((el, lineIdx) => {
          if (!el) return
          const p = totalUnits <= 1 ? scrollP : Math.max(0, Math.min(1, (time - lineIdx * stagger) / dur))
          // Smooth easeOutQuint curve: 1 - (1 - p)^4
          const easedP = 1 - Math.pow(1 - p, 4)
          const ty = ((1 - easedP) * 110).toFixed(1)
          let tf = `translateY(${ty}%)`
          if (rotateX !== 0) {
            tf = `perspective(${perspective}px) rotateX(${(rotateX * (1 - easedP)).toFixed(1)}deg) ${tf}`
          }
          if (scale < 1) {
            tf += ` scale(${(scale + (1 - scale) * easedP).toFixed(3)})`
          }
          el.style.transform = tf
          el.style.opacity = `${0.1 + easedP * 0.9}`
          if (blur > 0) {
            el.style.filter = blur > 0 && easedP < 1 ? `blur(${(blur * (1 - easedP)).toFixed(1)}px)` : 'none'
          }
        })
      }
    }

    // Reduced motion support: immediately show in resting state
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyProgress(1)
      return
    }

    if (trigger === 'On Load') {
      let started = false
      applyProgress(0)
      const startAnimation = () => {
        if (started) return
        started = true
        const startTime = performance.now()
        const animate = (now: number) => {
          const elapsed = (now - startTime) / 1000
          const rawP = Math.min(1, elapsed / onLoadDuration)
          applyProgress(1 - Math.pow(1 - rawP, 3))
          if (rawP < 1) rafId.current = requestAnimationFrame(animate)
        }
        rafId.current = requestAnimationFrame(animate)
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            startAnimation()
          }
        },
        { threshold: 0.1 },
      )
      observer.observe(container)
      return () => {
        observer.disconnect()
        cancelAnimationFrame(rafId.current)
      }
    }

    // Scroll-based animation
    const startFrac = offsetStart / 100
    const endFrac = offsetEnd / 100

    const update = () => {
      const vh = window.innerHeight
      const rect = container.getBoundingClientRect()
      const range = (startFrac - endFrac) * vh
      let scrollP = 1
      if (range > 0) {
        scrollP = Math.max(0, Math.min(1, (startFrac * vh - rect.top) / range))
      }
      applyProgress(scrollP)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting
        if (entry.isIntersecting) update()
      },
      { rootMargin: '200px' },
    )
    observer.observe(container)

    const onScroll = () => {
      if (!isVisible.current || scheduled.current) return
      scheduled.current = true
      rafId.current = requestAnimationFrame(() => {
        update()
        scheduled.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [lineGroups, isLinesMode, stagger, xOffset, yOffset, blur, rotateX, perspective, scale, trigger, onLoadDuration, offsetStart, offsetEnd])

  const renderWordGroup = (group: { type: 'word' | 'space'; text: string; isSecondary: boolean }, gi: number) => {
    if (group.type === 'word') {
      return (
        <span
          key={`w-${gi}`}
          data-wg={gi}
          className={group.isSecondary ? 'text-mist/60 transition-colors' : 'text-mist transition-colors'}
          style={{ whiteSpace: 'nowrap', display: 'inline' }}
        >
          {group.text}
        </span>
      )
    }
    return (
      <span key={`s-${gi}`} style={{ display: 'inline' }}>
        {group.text}
      </span>
    )
  }

  // Lines mode with detected lines → render with overflow-hidden wrappers
  if (isLinesMode && lineGroups && lineGroups.length > 0) {
    return (
      <Tag ref={containerRef as any} className={className} style={{ display: 'block', ...style }}>
        {lineGroups.map((groupIndices, lineIdx) => (
          <span
            key={lineIdx}
            style={{
              overflow: 'hidden',
              display: 'block',
              paddingBottom: '0.08em',
              marginBottom: '-0.08em',
            }}
          >
            <span
              ref={(el) => {
                lineRefs.current[lineIdx] = el
              }}
              style={{
                display: 'block',
                willChange: 'transform, opacity',
              }}
            >
              {groupIndices.map((gi) => renderWordGroup(wordGroups[gi], gi))}
            </span>
          </span>
        ))}
      </Tag>
    )
  }

  // Fallback / initial measurement phase before line wrap calculation
  return (
    <Tag ref={containerRef as any} className={className} style={{ display: 'block', ...style }}>
      {wordGroups.map((group, gi) => renderWordGroup(group, gi))}
    </Tag>
  )
}
export default ScrollRevealText
