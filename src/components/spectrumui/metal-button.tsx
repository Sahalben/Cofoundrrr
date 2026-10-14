'use client'

import * as React from 'react'
import { MetalFx } from 'metal-fx'
import { cn } from '../../lib/utils'
import { useSurfaceTheme, type SurfaceTheme } from './use-surface-theme'

export type MetalPreset = 'chromatic' | 'silver' | 'gold'

export interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  preset?: MetalPreset
  theme?: SurfaceTheme
  strength?: number
  size?: 'sm' | 'md' | 'lg'
  paused?: boolean
  className?: string
  wrapperClassName?: string
  href?: string
}

const SIZE = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-10 px-5 text-[14px]',
  lg: 'h-12 px-7 text-[15px]',
} as const

export function MetalButton({
  preset = 'silver',
  theme = 'auto',
  strength = 1,
  size = 'sm',
  paused = false,
  className,
  wrapperClassName,
  children,
  href,
  type = 'button',
  ...props
}: MetalButtonProps) {
  const resolved = useSurfaceTheme(theme)

  const contentClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-[transform,opacity] duration-200 ease-out cursor-pointer',
    'text-inherit hover:opacity-85 active:scale-[0.97]',
    'focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-60',
    SIZE[size],
    className,
  )

  return (
    <MetalFx
      variant="button"
      preset={preset}
      theme={resolved}
      strength={strength}
      paused={paused}
      className={cn('inline-flex items-center justify-center', wrapperClassName)}
    >
      {href ? (
        <a href={href} className={contentClasses}>
          {children}
        </a>
      ) : (
        <button type={type} className={contentClasses} {...props}>
          {children}
        </button>
      )}
    </MetalFx>
  )
}
