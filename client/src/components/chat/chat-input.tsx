import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useChatUpload } from '@/hooks/use-chat-upload'
import { cn } from '@/lib/utils'
import { File, Film, Paperclip, Send, X } from 'lucide-react'
import { Card } from '../ui/card'
import { Label } from '../ui/label'
import { InputEmoji } from './input-imoji'

export function ChatInput({ chatId }: { chatId: string }) {
  const {
    files,
    isSending,
    handleFileChange,
    handleDeleteFile,
    handleSendMessage,
    newMessage,
    setNewMessage,
  } = useChatUpload({
    chatId,
  })
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }
  return (
    <Card className='sticky bottom-0 z-10 rounded-none p-4 mt-auto'>
      <div className='flex gap-2'>
        <Input type='file' accept='video/*' id='film-input' hidden onChange={handleFileChange} />
        <Input type='file' multiple id='file-input' hidden onChange={handleFileChange} />
        <Tooltip>
          <TooltipTrigger asChild>
            <Label
              htmlFor='film-input'
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }))}
            >
              <Film className='size-5' />
            </Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tải video dài(stream hls)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Label
              htmlFor='file-input'
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }))}
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
        <div className='flex-1 relative'>
          <Input
            placeholder='Aa'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={onKeyDown}
            className='w-full'
            disabled={isSending}
          />
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
        <InputEmoji addEmoji={addEmoji} />
        <Button
          onClick={handleSendMessage}
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
