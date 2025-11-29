import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/hooks/stores/app.store'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { getInitials } from '@/lib/utils'
import { mediaUploadRequest } from '@/services/media'
import { Camera, Upload } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { Label } from '../ui/label'
import { UpdateProfileForm } from './update-profile'

export function ProfileInfo() {
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
  return (
    <div className='space-x-3 flex flex-row w-full'>
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ảnh đại diện</CardTitle>
          <CardDescription>Cập nhật ảnh đại diện của bạn</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Label
            htmlFor='avatar-input'
            className='cursor-pointer w-fit group relative overlow-hidden'
          >
            <input
              onChange={handleFileChange}
              id='avatar-input'
              type='file'
              accept='image/*'
              className='hidden'
            />
            <Avatar className='size-36'>
              <AvatarImage
                src={image ? URL.createObjectURL(image) : profile?.avatarUrl}
                alt={profile?.displayName}
              />
              <AvatarFallback className='text-lg'>
                {getInitials(profile?.displayName ?? 'U')}
              </AvatarFallback>
            </Avatar>
            <div className='absolute z-10 top-0 left-0 w-full h-full overflow-hidden rounded-full flex items-center justify-center'>
              <div className='absolute -z-1 bg-black opacity-0 group-hover:opacity-60 w-full h-full' />
              <Camera className='size-12 text-white hidden group-hover:block' />
            </div>
          </Label>
          <div className='space-y-2'>
            <div className='flex gap-2'>
              <Button disabled={!image} onClick={() => setImage(null)} variant='outline' size='sm'>
                Xóa ảnh
              </Button>
              <Button
                size='sm'
                onClick={handleChangeAvatar}
                disabled={isLoading || !image}
                className='flex isLoading-center gap-2'
              >
                <Upload className='w-4 h-4' />
                {isLoading ? 'Đang tải...' : 'Cập nhật ảnh đại diện'}
              </Button>
            </div>
            <p className='text-sm text-gray-500'>JPG, PNG hoặc WebP. Tối đa 30MB.</p>
          </div>
        </CardContent>
      </Card>
      <UpdateProfileForm />
    </div>
  )
}
