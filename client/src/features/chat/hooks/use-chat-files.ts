import { type ChangeEvent, useState } from 'react'
import { toast } from 'sonner'

import { generateVideoThumbnail } from '@/lib/utils'

export type ChatFile = { file: File; thumbnailUrl?: string; fileName: string }

export const useChatFiles = () => {
  const [files, setFiles] = useState<ChatFile[]>([])
  const [bigVideo, setBigVideo] = useState<File>()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files
    if (!newFiles || newFiles.length === 0) return

    if (bigVideo) {
      toast.error('Đã có video lớn, không thể tải thêm file khác.')
      e.target.value = ''
      return
    }

    // Process files sequentially or in parallel - parallel is fine for thumbnails
    const processedFiles = await Promise.all(
      Array.from(newFiles).map(async (file) => {
        let thumbnailUrl: string | undefined
        if (file.type.startsWith('video/')) {
          thumbnailUrl = await generateVideoThumbnail(file)
        } else if (file.type.startsWith('image/')) {
          thumbnailUrl = URL.createObjectURL(file)
        }
        return { file, thumbnailUrl, fileName: file.name }
      }),
    )

    setFiles((prevFiles) => [...prevFiles, ...processedFiles])
    e.target.value = ''
  }

  const handleSetBigVideo = async (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files
    if (!newFiles || newFiles.length === 0) return

    const file = newFiles[0]
    const thumbnailUrl = await generateVideoThumbnail(file)

    // Clear existing files when big video is set
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
    if (bigVideo && files[index].file === bigVideo) {
      setBigVideo(undefined)
    }
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const clearFiles = () => {
    setFiles([])
    setBigVideo(undefined)
  }

  const addFile = (file: File) => {
    if (bigVideo) {
      toast.error('Đã có video lớn, không thể tải thêm file khác.')
      return
    }
    const fileName = file.name
    // For audio files, we can use a generic icon or specific processing if needed.
    // Here we just add it to the list.
    const newFile: ChatFile = {
      file,
      fileName,
    }
    setFiles((prevFiles) => [...prevFiles, newFile])
  }

  return {
    files,
    bigVideo,
    handleFileChange,
    handleSetBigVideo,
    handleDeleteFile,
    clearFiles,
    addFile,
  }
}
