import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCall } from '@/features/call/context/call.context'
import { Phone, PhoneOff, Video } from 'lucide-react'

export function IncomingCall() {
  const { incomingCall, answerCall, rejectCall } = useCall()

  if (!incomingCall) return null

  // User info might be incomplete if just socket.data.user
  const displayName = incomingCall.user?.displayName || 'Người dùng ẩn danh'
  const avatarUrl = incomingCall.user?.avatarUrl

  return (
    <Dialog open={!!incomingCall} onOpenChange={() => rejectCall()}>
      <DialogContent showCloseButton={false} className='sm:max-w-md p-6 flex flex-col items-center'>
        <div className='flex flex-col items-center gap-4 mb-8'>
          <div className='relative'>
            <Avatar className='h-24 w-24 border-4 border-background shadow-xl'>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className='text-2xl'>{displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full animate-bounce'>
              {incomingCall.isVideo ? (
                <Video className='w-4 h-4 text-white' />
              ) : (
                <Phone className='w-4 h-4 text-white' />
              )}
            </div>
          </div>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>{displayName}</h2>
            <p className='text-muted-foreground'>đang gọi cho bạn...</p>
          </div>
        </div>

        <div className='flex items-center gap-8 w-full justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <Button
              variant='destructive'
              size='icon'
              className='h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform'
              onClick={rejectCall}
            >
              <PhoneOff className='h-6 w-6' />
            </Button>
            <span className='text-xs text-muted-foreground'>Từ chối</span>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <Button
              variant='default' // or success color if available
              size='icon'
              className='h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:scale-110 transition-transform animate-pulse'
              onClick={answerCall}
            >
              {incomingCall.isVideo ? <Video className='h-6 w-6' /> : <Phone className='h-6 w-6' />}
            </Button>
            <span className='text-xs text-muted-foreground'>Trả lời</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
