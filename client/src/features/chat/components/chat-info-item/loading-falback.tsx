import { Loader2 } from 'lucide-react'

export function LoadingFallback() {
  return (
    <div className='flex justify-center p-4'>
      <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
    </div>
  )
}
