'use client'

import { cn } from '@/lib/utils/cn'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[#2A79C2] text-white hover:bg-[#1f6aad] focus:ring-[#2A79C2]/40 shadow-sm shadow-[#2A79C2]/20',
  secondary: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 focus:ring-zinc-400',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/40',
  ghost: 'bg-transparent text-zinc-600 hover:bg-zinc-100 focus:ring-zinc-400',
  outline: 'bg-transparent border border-zinc-300 text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-400',
  success: 'bg-[#8BC440] text-white hover:bg-[#7ab038] focus:ring-[#8BC440]/40 shadow-sm shadow-[#8BC440]/20',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-sm font-semibold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
