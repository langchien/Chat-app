import { useChatInput } from '@/components/chat/chat-input/use-chat-input'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { File, Film, Paperclip, Send, X } from 'lucide-react'
import { InputEmoji } from './input-imoji'

export function ChatInput({ chatId }: { chatId: string }) {
  const {
    inputRef,
    files,
    isSending,
    handleFileChange,
    handleDeleteFile,
    newMessage,
    setNewMessage,
    handleSetBigVideo,
    onKeyDown,
    sendMessage,
    addEmoji,
  } = useChatInput({ chatId })

  return (
    <Card className='sticky bottom-0 z-10 rounded-none p-4 mt-auto'>
      <div className='flex gap-2'>
        <Input type='file' accept='video/*' id='big-video' hidden onChange={handleSetBigVideo} />
        <Input type='file' multiple id='file-input' hidden onChange={handleFileChange} />

        <div className='flex-1 relative'>
          <InputGroup>
            <InputGroupAddon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label
                    htmlFor='big-video'
                    className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
                  >
                    <Film className='size-5' />
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tải 1 video tối đa 500MB</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label
                    htmlFor='file-input'
                    className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
                  >
                    <Paperclip className='size-5' />
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Tải lên tối đa 10 file, <br /> mỗi file tối đa 30MB
                  </p>
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
            <InputGroupInput
              ref={inputRef}
              placeholder='Aa'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={onKeyDown}
              className='w-full'
              disabled={isSending}
            />
            <InputGroupAddon align='inline-end'>
              <InputEmoji addEmoji={addEmoji} />
            </InputGroupAddon>
          </InputGroup>
          <Card
            className={cn(
              'absolute w-full -top-1 left-0 right-0 -translate-y-full p-2 pt-3 bg-card rounded-2xl overflow-auto flex flex-row flex-nowrap gap-2',
              files.length === 0 && 'hidden',
            )}
          >
            {files.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'relative shrink-0 flex items-center',
                  item.thumbnailUrl ? 'size-12' : 'h-12 w-48 bg-muted rounded-md p-2',
                )}
              >
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.fileName}
                    className='size-full object-cover rounded-md'
                  />
                ) : (
                  <div className='flex items-center space-x-2 w-full overflow-hidden'>
                    <File className='size-5 shrink-0' />
                    <span className='flex-1 min-w-0 text-sm truncate'>{item.fileName}</span>
                  </div>
                )}
                <Button
                  className='size-6 rounded-full border absolute top-0 right-0 aspect-square -translate-y-1/2 translate-x-1/2 bg-white dark:bg-black'
                  size='icon-sm'
                  variant={'ghost'}
                  onClick={() => handleDeleteFile(index)}
                >
                  <X className='size-3' />
                </Button>
              </div>
            ))}
          </Card>
        </div>
        <Button
          onClick={sendMessage}
          size='icon'
          className='h-9 w-9 bg-blue-500 hover:bg-blue-600'
          disabled={isSending}
        >
          <Send className='size-5' />
        </Button>
      </div>
    </Card>
  )
}
