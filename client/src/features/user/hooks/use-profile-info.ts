import { mediaUploadRequest } from '@/features/message/services/media'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'

export function useProfileInfo() {
  const profile = useAuthStore((state) => state.user)
  const { isLoading, setLoading } = useAppStore()
  const [image, setImage] = useState<File | null>(null)
  const setUser = useAuthStore((state) => state.setUser)
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files
    if (!newFiles || newFiles.length === 0) return
    setImage(newFiles[0])
    e.target.value = ''
  }
  const handleChangeAvatar = async () => {
    if (!image) return
    setLoading(true)
    try {
      const updatedUser = await mediaUploadRequest.uploadAvatar(image)
      setUser(updatedUser)
      setImage(null)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error('Đã có lỗi xảy ra khi tải ảnh đại diện')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    isLoading,
    image,
    setImage,
    handleFileChange,
    handleChangeAvatar,
  }
}
