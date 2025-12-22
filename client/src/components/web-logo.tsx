import { Zap } from 'lucide-react'

export function WebLogo() {
  return (
    <div className='flex items-center gap-2'>
      <Zap className='size-6 font-bold text-primary/90' />
      <h1 className='text-2xl font-bold text-primary/90'>Flash Message</h1>
    </div>
  )
}
