import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { IUser } from '@/services/api.types'
import { useAuthStore } from '@/stores/auth.store'
import { LogOut, Settings } from 'lucide-react'
import { UserAvatar } from '../avatar'
import { ProfileTabs } from '../profile/profile-tabs'
import { Button } from '../ui/button'

export function UserInfo({ user }: { user: IUser }) {
  return (
    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
      <UserAvatar user={user} size={'md'} />
      <div className='grid flex-1 text-left text-sm leading-tight'>
        <span className='truncate font-semibold capitalize'>{user.displayName}</span>
        <span className='truncate text-xs'>{user.email}</span>
      </div>
    </div>
  )
}

export function AccountSetting() {
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  if (!user) return null
  return (
    <div className='flex items-center justify-between w-full h-full group/settings'>
      <UserInfo user={user} />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={'ghost'} size={'icon-lg'}>
            <Settings className='size-6 group-hover/settings:animate-spin' />
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-xl md:max-w-3xl lg:max-w-4xl min-h-[400px]'>
          <ProfileTabs />
        </DialogContent>
      </Dialog>
      <Button
        className='hover:bg-red-500/90 hover:text-white'
        variant={'ghost'}
        size={'icon-lg'}
        onClick={signOut}
      >
        <LogOut className='size-6' />
      </Button>
    </div>
  )
}
