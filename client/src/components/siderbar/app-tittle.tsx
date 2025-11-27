import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { Edit, MoreVertical } from 'lucide-react'
import { ModeToggle } from '../theme/mode-toggle'
import { Button } from '../ui/button'

export function AppTittle() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className='flex items-center'>
        <h1 className='text-2xl font-bold text-blue-500'>Message</h1>
        <Button variant='ghost' size='icon-lg' className='ml-auto'>
          <MoreVertical />
        </Button>
        <Button variant='ghost' size='icon-lg'>
          <Edit />
        </Button>
        <ModeToggle />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
