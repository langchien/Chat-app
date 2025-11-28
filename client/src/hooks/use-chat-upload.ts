import { type ChangeEvent, useState } from 'react'
import { toast } from 'sonner'

import { AppException } from '@/lib/request/request.type'
import { generateVideoThumbnail } from '@/lib/utils'
import { mediaUploadRequest } from '@/services/media'
import { messageRequest } from '@/services/messages'

export type TFile = { file: File; thumbnailUrl?: string; fileName: string }

export const useChatUpload = ({ chatId }: { chatId: string }) => {
  const [newMessage, setNewMessage] = useState('')

  const [files, setFiles] = useState<TFile[]>([])
  const [isSending, setIsSending] = useState(false)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files
    if (!newFiles || newFiles.length === 0) return

    await Promise.all(
      Array.from(newFiles).map(async (file) => {
        let thumbnailUrl: string | undefined
        if (file.type.startsWith('video/')) {
          thumbnailUrl = await generateVideoThumbnail(file)
        } else if (file.type.startsWith('image/')) {
          thumbnailUrl = URL.createObjectURL(file)
        }
        setFiles((prevFiles) => [...prevFiles, { file, thumbnailUrl, fileName: file.name }])
      }),
    )
    e.target.value = ''
  }

  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleSendMessage = async () => {
    if (isSending || (files.length === 0 && newMessage.trim() === '')) return
    const content = newMessage.trim()
    setIsSending(true)
    try {
      if (files.length > 0) {
        await mediaUploadRequest.multipartFormUpload(
          chatId,
          content,
          files.map((item) => item.file),
        )
      } else {
        await messageRequest.create({ chatId, content })
      }
      setFiles([])
      setNewMessage('')
    } catch (error) {
      if (error instanceof AppException) toast.error(`Gửi tin nhắn thất bại: ${error.message}`)
      else toast.error('Gửi tin nhắn thất bại. Vui lòng thử lại sau.')
      throw error // Re-throw the error to be caught in the component
    } finally {
      setIsSending(false)
    }
  }

  return {
    files,
    isSending,
    handleFileChange,
    handleDeleteFile,
    newMessage,
    setNewMessage,
    handleSendMessage,
  }
}
