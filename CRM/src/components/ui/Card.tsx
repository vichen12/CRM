import { cn } from '@/lib/utils/cn'
import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, style, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-xl', className)}
      style={{ background: '#0C1628', border: '1px solid rgba(255,255,255,0.07)', ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-6 py-4', className)}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-6 py-4 rounded-b-xl', className)}
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', ...style }}
      {...props}
    >
      {children}
    </div>
  )
}
