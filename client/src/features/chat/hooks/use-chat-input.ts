import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { messageRequest } from '@/features/message/services'
import { mediaUploadRequest } from '@/features/message/services/media'
import { AppException } from '@/lib/request/request.type'
import { useAudioRecorder } from './use-audio-recorder'
import { useChatFiles } from './use-chat-files'

export function useChatInput({ chatId }: { chatId: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const {
    files,
    bigVideo,
    handleFileChange,
    handleSetBigVideo,
    handleDeleteFile,
    clearFiles,
    addFile,
  } = useChatFiles()

  const { isRecording, recordingTime, startRecording, stopRecording, cancelRecording } =
    useAudioRecorder()

  // Focus input on mount and after sending
  useEffect(() => {
    if (!isSending) {
      inputRef.current?.focus()
    }
  }, [isSending])

  const sendMessage = async () => {
    if (isSending) return
    const content = newMessage.trim()

    // Validate: must have content or files.
    // Original logic: if (bigVideo) ... else if (files.length !== 0) ... else if (content !== '')
    if (!content && files.length === 0 && !bigVideo) return

    setIsSending(true)
    try {
      if (bigVideo) {
        await mediaUploadRequest.uploadSingleVideoToHls(bigVideo, chatId, content)
      } else if (files.length > 0) {
        await mediaUploadRequest.multipartFormUpload(
          chatId,
          content,
          files.map((f) => f.file),
        )
      } else {
        await messageRequest.create({ chatId, content })
      }

      setNewMessage('')
      clearFiles()
    } catch (error) {
      if (error instanceof AppException) {
        toast.error(error.message)
      } else {
        toast.error('Gửi tin nhắn thất bại. Vui lòng thử lại sau.')
      }
      throw error
    } finally {
      setIsSending(false)
    }
  }

  const handleStopRecording = async () => {
    try {
      const file = await stopRecording()
      addFile(file)
    } catch (error) {
      toast.error('Không thể lưu file ghi âm')
      console.error(error)
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await sendMessage()
    }
  }

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }

  return {
    inputRef,
    files,
    isSending,
    newMessage,
    setNewMessage,
    handleFileChange,
    handleDeleteFile,
    handleSetBigVideo,
    onKeyDown: handleKeyDown,
    sendMessage,
    addEmoji,
    isRecording,
    recordingTime,
    startRecording,
    stopRecording: handleStopRecording,
    cancelRecording,
  }
}
