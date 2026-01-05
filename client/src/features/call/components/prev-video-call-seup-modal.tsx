import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMediaSetup } from '@/features/call/hooks/use-media-setup'
import { cn } from '@/lib/utils'
import { Mic, MicOff, Video, VideoOff, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface PrevVideoCallSetupModalProps {
  onJoin: (stream: MediaStream) => void
  onCancel: () => void
}

export function PrevVideoCallSetupModal({ onJoin, onCancel }: PrevVideoCallSetupModalProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [open, setOpen] = useState(false)

  const { stream, devices, selection, status, errors, setSpeakerHelper } = useMediaSetup({
    enabled: open,
  })

  // Sync Video Source
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream
    }
  }, [stream])

  // Sync Speaker
  useEffect(() => {
    setSpeakerHelper(localVideoRef.current)
  }, [selection.speaker, setSpeakerHelper])

  const handleJoin = () => {
    if (stream && onJoin) {
      onJoin(stream)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='h-9 w-9'>
          <Video className='h-5 w-5' />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className='flex flex-col md:flex-row h-full md:h-[600px] max-h-screen md:max-h-[90vh] w-full md:min-w-[90vw] md:max-w-[90vw] items-center p-0 overflow-hidden'
      >
        {/* Preview Area */}
        <div className='flex-none md:flex-1 w-full md:h-full bg-background relative flex flex-col items-center justify-center p-4 md:p-5'>
          {/* Main Video Container 16:9 */}
          <div
            className={cn(
              'relative aspect-video w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl transition-all duration-300',
              errors.global
                ? 'border-2 border-red-500 shadow-red-500/20'
                : 'border border-border/10',
            )}
          >
            {/* Video Element */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              // muted
              className={cn(
                'h-full w-full object-cover transform scale-x-[-1]',
                !status.isCameraOn && 'hidden',
              )}
            />

            {/* Camera Off Placeholder */}
            {!status.isCameraOn && !errors.global && (
              <div className='absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-muted-foreground'>
                <div className='bg-zinc-800 p-4 rounded-full mb-3'>
                  <VideoOff className='w-8 h-8 opacity-50' />
                </div>
                <p>Camera đang tắt</p>
              </div>
            )}

            {/* Dynamic Audio Level Overlay (Mic Test) - Always visible when mic is on */}
            {status.isMicOn && !errors.global && (
              <div className='absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full z-10 border border-white/10'>
                <div className='flex items-end gap-[2px] h-4'>
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <div
                      key={bar}
                      className='w-1 bg-green-500 rounded-t-sm transition-all duration-75 ease-out'
                      style={{
                        height: status.audioLevel > bar * 15 ? '100%' : '20%',
                        opacity: status.audioLevel > bar * 15 ? 1 : 0.3,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Control Bar Overlay */}
            <div className='absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-4 z-20'>
              <Button
                variant={status.isMicOn ? 'secondary' : 'destructive'}
                size='icon'
                className='h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95'
                onClick={status.toggleMic}
                disabled={!!errors.global}
              >
                {status.isMicOn ? (
                  <Mic className='h-4 w-4 md:h-5 md:w-5' />
                ) : (
                  <MicOff className='h-4 w-4 md:h-5 md:w-5' />
                )}
              </Button>
              <Button
                variant={status.isCameraOn ? 'secondary' : 'destructive'}
                size='icon'
                className='h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95'
                onClick={status.toggleCamera}
                disabled={!!errors.global}
              >
                {status.isCameraOn ? (
                  <Video className='h-4 w-4 md:h-5 md:w-5' />
                ) : (
                  <VideoOff className='h-4 w-4 md:h-5 md:w-5' />
                )}
              </Button>
            </div>
          </div>

          {/* Error Message Below Video */}
          <div className='min-h-[24px] mt-2 md:mt-4 text-center'>
            {errors.global && (
              <p className='flex items-center gap-2 text-red-500 font-medium animate-in fade-in slide-in-from-top-1 text-sm md:text-base'>
                <X className='w-4 h-4' /> {errors.global}
              </p>
            )}
            {!errors.global && (errors.camera || errors.micro) && (
              <p className='flex items-center gap-2 text-amber-500 font-medium animate-in fade-in slide-in-from-top-1 text-sm md:text-base'>
                <X className='w-4 h-4' /> {errors.camera || errors.micro}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className='flex-1 md:flex-none w-full md:w-[400px] h-full flex flex-col border-t md:border-t-0 md:border-l bg-card p-4 md:p-6 overflow-y-auto'>
          <h2 className='text-xl md:text-2xl font-semibold mb-1'>Bạn đã sẵn sàng gọi?</h2>
          <p className='text-xs md:text-sm text-muted-foreground mb-4 md:mb-6'>
            Kiểm tra cài đặt camera và micro trước khi tham gia cuộc gọi
          </p>

          <FieldGroup className='flex-1'>
            <Field>
              <FieldLabel htmlFor='camera'>Camera</FieldLabel>
              <Select value={selection.camera} onValueChange={selection.setCamera}>
                <SelectTrigger id='camera' className={cn({ 'border-red-500': errors.camera })}>
                  <SelectValue placeholder='Chọn camera' />
                </SelectTrigger>
                <SelectContent>
                  {devices.cameras.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 5)}...`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.camera && (
                <FieldDescription className='text-red-500 text-xs mt-1'>
                  {errors.camera}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor='micro'>Microphone</FieldLabel>
              <Select value={selection.micro} onValueChange={selection.setMicro}>
                <SelectTrigger id='micro' className={cn({ 'border-red-500': errors.micro })}>
                  <SelectValue placeholder='Chọn micro' />
                </SelectTrigger>
                <SelectContent>
                  {devices.mics.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${device.deviceId.slice(0, 5)}...`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.micro && (
                <FieldDescription className='text-red-500 text-xs mt-1'>
                  {errors.micro}
                </FieldDescription>
              )}
              {status.isMicOn && !errors.micro && (
                <div className='mt-2 flex items-center gap-2'>
                  <Mic className='w-3 h-3 text-muted-foreground' />
                  <div className='flex-1 h-1.5 bg-secondary rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-green-500 transition-all duration-75'
                      style={{ width: `${status.audioLevel}%` }}
                    />
                  </div>
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor='speaker'>Loa / Headphone</FieldLabel>
              <Select value={selection.speaker} onValueChange={selection.setSpeaker}>
                <SelectTrigger id='speaker' className={cn({ 'border-red-500': errors.speaker })}>
                  <SelectValue placeholder='Chọn loa' />
                </SelectTrigger>
                <SelectContent>
                  {devices.speakers.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label || `Speaker ${device.deviceId.slice(0, 5)}...`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.speaker && (
                <FieldDescription className='text-red-500 text-xs mt-1'>
                  {errors.speaker}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>

          <div className='mt-6 md:mt-auto pt-4 md:pt-6 border-t flex gap-3'>
            <Button
              variant='outline'
              type='button'
              onClick={() => {
                onCancel()
                setOpen(false)
              }}
              className='flex-1 h-10 md:h-11 text-sm md:text-base'
            >
              Hủy bỏ
            </Button>
            <Button
              className='flex-2 h-10 md:h-11 text-sm md:text-base'
              type='button'
              onClick={handleJoin}
              disabled={Boolean(errors.global)}
            >
              Tham gia ngay
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
