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
  const [bigVideo, setBigVideo] = useState<File>()
  const [isSending, setIsSending] = useState(false)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files
    if (!newFiles || newFiles.length === 0) return
    if (bigVideo) {
      toast.error('Đã có video lớn, không thể tải thêm file khác.')
      e.target.value = ''
      return
    }
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

  const handleSetBigVideo = async (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files
    if (!newFiles || newFiles.length === 0) return
    const file = newFiles[0]
    //  Nếu là big video thì xóa files hiện tại và chỉ set big video
    const thumbnailUrl = await generateVideoThumbnail(file)
    setBigVideo(file)
    setFiles([
      {
        file,
        fileName: file.name,
        thumbnailUrl,
      },
    ])
    e.target.value = ''
  }

  const handleDeleteFile = (index: number) => {
    if (bigVideo && files[index].file === bigVideo) setBigVideo(undefined)
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }
  const onSubmmit = async () => {
    if (isSending) return
    const content = newMessage.trim()
    setIsSending(true)
    try {
      // ở đẩy phải để big video trước files vì sẽ set big video vào files để đỡ phải handle hiển thị riêng
      if (bigVideo) {
        await mediaUploadRequest.uploadSingleVideoToHls(bigVideo, chatId, content)
      } else if (files.length !== 0) {
        await mediaUploadRequest.multipartFormUpload(
          chatId,
          content,
          files.map((item) => item.file),
        )
      } else if (content !== '') {
        await messageRequest.create({ chatId, content })
      }
      setNewMessage('')
      setFiles([])
      setBigVideo(undefined)
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

  return {
    files,
    isSending,
    handleFileChange,
    handleDeleteFile,
    newMessage,
    setNewMessage,
    onSubmmit,
    handleSetBigVideo,
  }
}
