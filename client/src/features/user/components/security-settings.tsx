import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputPassword } from '@/components/ui/custom-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  ChangePassworBodyDto,
  protectedRequest,
  type IChangePassworBodyDto,
} from '@/features/user/services/protected'
import { useRequest } from '@/hooks/use-request'
import { useAuthStore } from '@/stores/auth.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogOut, Shield } from 'lucide-react'
import { useForm } from 'react-hook-form'

export function SecuritySettings() {
  const form = useForm<IChangePassworBodyDto>({
    resolver: zodResolver(ChangePassworBodyDto),
  })

  const onSubmit = useRequest(protectedRequest.changePassword, {
    setError: form.setError,
  })

  const signOutAllDevices = useAuthStore((state) => state.signOutAllDevices)
  return (
    <div className='space-y-6'>
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='w-5 h-5' />
            Đổi mật khẩu
          </CardTitle>
          <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='oldPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                    <FormControl>
                      <InputPassword placeholder='Nhập mật khẩu hiện tại' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <InputPassword placeholder='Nhập mật khẩu mới' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                    <FormControl>
                      <InputPassword placeholder='Nhập lại mật khẩu mới' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full md:w-auto'>
                Đổi mật khẩu
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động bảo mật</CardTitle>
          <CardDescription>Các tùy chọn bảo mật nâng cao</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between p-4 border rounded-lg'>
            <div>
              <h4 className='font-medium'>Đăng xuất khỏi tất cả thiết bị</h4>
              <p className='text-sm text-gray-500'>
                Đăng xuất khỏi tất cả thiết bị đã đăng nhập vào tài khoản của bạn.
              </p>
            </div>
            <Button
              variant='outline'
              onClick={signOutAllDevices}
              className='flex items-center gap-2'
            >
              <LogOut className='w-4 h-4' />
              Đăng xuất tất cả
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
