import { useChatUpload } from '@/hooks/use-chat-upload'
import { useEffect, useRef } from 'react'

export function useChatInput({ chatId }: { chatId: string }) {
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    files,
    isSending,
    handleFileChange,
    handleDeleteFile,
    onSubmmit,
    newMessage,
    setNewMessage,
    handleSetBigVideo,
  } = useChatUpload({
    chatId,
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isSending) {
      inputRef.current?.focus()
    }
  }, [isSending])

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await onSubmmit()
    }
  }

  const handleOnSubmmit = async () => {
    await onSubmmit()
  }
  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }

  return {
    inputRef,
    files,
    isSending,
    handleFileChange,
    handleDeleteFile,
    onSubmmit,
    newMessage,
    setNewMessage,
    handleSetBigVideo,
    onKeyDown,
    handleOnSubmmit,
    addEmoji,
  }
}
