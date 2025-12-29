import { Card } from '@/components/ui/card'
import type React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className='min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4'>
      <Card className='w-full max-w-lg p-8 group relative bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl hover:border-blue-500/50 transition-all duration-300 text-white'>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold'>{title}</h1>
          {subtitle && <p className='text-blue-400 text-sm'>{subtitle}</p>}
        </div>
        {children}
      </Card>
    </div>
  )
}
