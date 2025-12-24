import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { getInitials } from '@/lib/utils'
import type { IUser } from '@/services/api.types'
import { friendRequest } from '@/services/friend'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { FriendStatusButton } from './friend-status-btn'

export function AddFriend({ defaultSearch }: { defaultSearch?: string }) {
  const [result, setResult] = useState<IUser[]>([])
  const deouncedSearch = useDebouncedCallback(async (value: string) => {
    if (!value) return setResult([])
    const result = await friendRequest.searchUser({
      limit: 20,
      q: value,
    })
    setResult(result)
  }, 500)

  return (
    <div className='flex flex-col space-y-3'>
      <h2 className='text-lg font-semibold'>Thêm bạn bè</h2>
      <p>Bạn có thể thêm bạn bè bằng username hoặc email của họ</p>
      <InputGroup>
        <InputGroupInput
          defaultValue={defaultSearch}
          onChange={(e) => deouncedSearch(e.target.value)}
          placeholder='Nhập username hoặc email'
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align='inline-end'>{result.length} Kết quả</InputGroupAddon>
      </InputGroup>
      <Separator />
      <div className='flex flex-col space-y-2 py-3'>
        {result.map((user) => (
          <div key={user.id} className='flex items-center space-x-2'>
            <Avatar>
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <div className='flex flex-row items-center space-x-2'>
                <div className='font-semibold'>{user.displayName}</div>
              </div>
              <div className='text-xs text-muted-foreground'>{user.email}</div>
            </div>
            <div className='ms-auto'></div>
            <FriendStatusButton userId={user.id} userDisplayName={user.displayName} />
          </div>
        ))}
      </div>
    </div>
  )
}
