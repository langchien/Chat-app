import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCall } from '@/features/call/context/call.context'
import { cn } from '@/lib/utils'
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function ActiveCall() {
  const {
    activeCall,
    isCalling,
    hangUp,
    localStream,
    remoteStream,
    toggleMic,
    toggleCamera,
    isMicOn,
    isCameraOn,
    isVideoCall,
    callDuration,
    remoteUser,
  } = useCall()

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Sync streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream, activeCall, isCalling])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream, activeCall])

  if (!activeCall && !isCalling) return null

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const displayName = remoteUser?.displayName || 'Người dùng ẩn danh'
  const avatarUrl = remoteUser?.avatarUrl

  return (
    <div className='fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col'>
      {/* Main Content Area */}
      <div className='flex-1 relative overflow-hidden flex items-center justify-center p-4'>
        {/* If Video Call */}
        {isVideoCall ? (
          <div className='relative w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center bg-black rounded-2xl overflow-hidden shadow-2xl'>
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className='w-full h-full object-contain'
            />

            {/* Local Video Picture-in-Picture */}
            <div className='absolute bottom-4 right-4 w-48 aspect-video bg-zinc-900 rounded-lg overflow-hidden shadow-xl border border-white/10'>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={cn(
                  'w-full h-full object-cover transform scale-x-[-1]',
                  !isCameraOn && 'hidden',
                )}
              />
              {!isCameraOn && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <VideoOff className='w-6 h-6 text-muted-foreground' />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Audio Call UI */
          <div className='flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-300'>
            <div className='relative'>
              {/* Pulse animation */}
              <div className='absolute inset-0 bg-primary/20 rounded-full animate-ping duration-[2s]' />
              <Avatar className='w-32 h-32 border-4 border-background shadow-2xl relative z-10'>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className='text-4xl'>
                  {displayName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className='text-center space-y-2'>
              <h2 className='text-2xl font-semibold'>{displayName}</h2>
              <p
                className={cn(
                  'text-lg font-medium',
                  isCalling ? 'text-yellow-500' : 'text-green-500',
                )}
              >
                {isCalling ? 'Đang gọi...' : formatDuration(callDuration)}
              </p>
            </div>

            {/* Hidden Audio Elements for Voice Call */}
            <audio ref={remoteVideoRef} autoPlay />
            {/* Local stream doesn't need audio element as we don't want to hear ourselves echos */}
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className='h-24 bg-card border-t flex items-center justify-center gap-6 px-4 mb-safe'>
        <Button
          variant={isMicOn ? 'secondary' : 'destructive'}
          size='icon'
          className='h-14 w-14 rounded-full shadow-lg'
          onClick={toggleMic}
        >
          {isMicOn ? <Mic className='h-6 w-6' /> : <MicOff className='h-6 w-6' />}
        </Button>

        <Button
          variant='destructive'
          size='icon'
          className='h-16 w-16 rounded-full shadow-xl hover:scale-105 transition-transform'
          onClick={hangUp}
        >
          <PhoneOff className='h-8 w-8' />
        </Button>

        <Button
          variant={isCameraOn ? 'secondary' : 'destructive'}
          size='icon'
          className='h-14 w-14 rounded-full shadow-lg'
          onClick={toggleCamera}
        >
          {isCameraOn ? <Video className='h-6 w-6' /> : <VideoOff className='h-6 w-6' />}
        </Button>
      </div>
    </div>
  )
}
