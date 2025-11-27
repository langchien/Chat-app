import { cn } from '@/lib/utils'

export function OnlineBadge({ isOnline }: { isOnline: boolean }) {
  return (
    <div
      className={cn(
        'absolute -bottom-0.5 -right-0.5 size-4 rounded-full border-2 border-card',
        isOnline ? 'bg-green-500' : 'bg-gray-400',
      )}
    />
  )
}
