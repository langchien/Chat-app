import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Smartphone, User } from 'lucide-react'
import { ProfileInfo } from './profile-info'
import { SecuritySettings } from './security-settings'

const PAGE_TABS = [
  {
    title: 'Thông tin cá nhân',
    value: 'profile',
    icon: User,
  },
  {
    title: 'Bảo mật',
    value: 'security',
    icon: Shield,
  },
  {
    title: 'Thiết bị',
    value: 'devices',
    icon: Smartphone,
  },
]

export const ProfileTabs = () => {
  return (
    <Tabs defaultValue='profile' className='w-full'>
      <TabsList className='grid w-full grid-cols-3'>
        {PAGE_TABS.map((tab) => (
          <TabsTrigger
            asChild
            key={tab.value}
            value={tab.value}
            className='w-full flex items-center gap-2'
          >
            <div className='flex items-center gap-2'>
              <tab.icon className='w-4 h-4' />
              {tab.title}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value='profile' className='mt-6'>
        <ProfileInfo />
      </TabsContent>

      <TabsContent value='security' className='mt-6'>
        <SecuritySettings />
      </TabsContent>

      <TabsContent value='device' className='mt-6'>
        <div>Device Settings Coming Soon...</div>
      </TabsContent>
    </Tabs>
  )
}
