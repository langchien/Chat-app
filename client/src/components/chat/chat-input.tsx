import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { messageRequest } from '@/services/messages'
import { Film, Image, Paperclip, Send, Video } from 'lucide-react'
import { useState } from 'react'
import { Card } from '../ui/card'
import { InputEmoji } from './input-imoji'

export function ChatInput({ chatId }: { chatId: string }) {
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const handleSendMessage = async () => {
    if (isSending) return
    if (newMessage.trim() === '') return
    setIsSending(true)
    await messageRequest.create({
      chatId,
      content: newMessage.trim(),
    })
    setIsSending(false)
    setNewMessage('')
  }
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <Film className='h-5 w-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tải video dài(stream hls)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <Video className='h-5 w-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tải video </p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <Image className='h-5 w-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tải ảnh (Tối đa 5 ảnh)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <Paperclip className='h-5 w-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tải tệp tin</p>
          </TooltipContent>
        </Tooltip>

        <Input
          placeholder='Aa'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={onKeyDown}
          className='flex-1'
        />
        <InputEmoji addEmoji={addEmoji} />
        <Button
          onClick={handleSendMessage}
          size='icon'
          className='h-9 w-9 bg-blue-500 hover:bg-blue-600'
          disabled={isSending}
        >
          <Send className='h-5 w-5' />
        </Button>
      </div>
    </Card>
  )
}
