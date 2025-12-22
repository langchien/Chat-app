import { Tabs } from '@/components/ui/tabs'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { FRIEND_TABS, FriendHeader } from '../components/friend-header'

export default function FriendLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const getTabFromPath = (pathname: string) => {
    if (pathname.includes('/add')) return FRIEND_TABS.addFriend
    if (pathname.includes('/request')) return FRIEND_TABS.request
    if (pathname.includes('/receive')) return FRIEND_TABS.receiveRequest
    return FRIEND_TABS.listFriend
  }

  const currentTab = getTabFromPath(location.pathname)

  const handleTabChange = (value: string) => {
    switch (value) {
      case FRIEND_TABS.listFriend:
        navigate('.')
        break
      case FRIEND_TABS.addFriend:
        navigate('add')
        break
      case FRIEND_TABS.request:
        navigate('request')
        break
      case FRIEND_TABS.receiveRequest:
        navigate('receive')
        break
    }
  }

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <FriendHeader />
      <div className='px-3'>
        <Outlet />
      </div>
    </Tabs>
  )
}
