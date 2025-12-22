import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import {
  protectedRequest,
  UpdateProfileBodyDto,
  type IUpdateProfileBodyDto,
} from '@/features/user/services/protected'
import { useRequest } from '@/hooks/use-request'
import { useAuthStore } from '@/stores/auth.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info } from 'lucide-react'
import { useForm } from 'react-hook-form'

export function UpdateProfileForm() {
  const profile = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const form = useForm<IUpdateProfileBodyDto>({
    resolver: zodResolver(UpdateProfileBodyDto),
    defaultValues: profile ? profile : undefined,
  })

  const onSubmit = useRequest(protectedRequest.updateProfile, {
    setError: form.setError,
    onSuccess: (data) => {
      setUser(data)
    },
  })
  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput placeholder='Nhập username' value={profile?.username} disabled />
                  <InputGroupAddon align={'inline-end'}>
                    <Info className='w-4 h-4 text-gray-500' />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    type='email'
                    placeholder='Nhập email'
                    value={profile?.email}
                    disabled
                  />
                  <InputGroupAddon align={'inline-end'}>
                    <Info className='w-4 h-4 text-gray-500' />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name='displayName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên hiển thị</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập tên hiển thị' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='avatarUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avartar</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        placeholder='http://your-avatar-link.com'
                        {...field}
                        value={field.value ?? ''}
                      />
                      <InputGroupAddon>
                        <InputGroupText>https://</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        placeholder='Nhập số điện thoại'
                        {...field}
                        value={field.value ?? ''}
                      />
                      <InputGroupAddon>
                        <InputGroupText>84+</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiểu sử</FormLabel>
                  <FormControl>
                    <Textarea
                      // cols={4}
                      placeholder='Nhập tiểu sử'
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex w-full'>
              <Button type='submit' className='w-full md:w-auto ml-auto'>
                Cập nhật thông tin
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
