import { cn } from '@/lib/utils'

export function PageHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('h-14 shrink-0 p-2 flex flex-col w-full border-b', className)}>
      {children}
    </div>
  )
}
