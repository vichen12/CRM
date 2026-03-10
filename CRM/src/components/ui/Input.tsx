import { cn } from '@/lib/utils/cn'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-zinc-800 bg-zinc-50',
            'placeholder:text-zinc-400',
            'focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            error
              ? 'border-red-400 focus:ring-red-500/20'
              : 'border-zinc-200 focus:ring-[#2A79C2]/15 focus:border-[#2A79C2]',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-zinc-400">{hint}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
