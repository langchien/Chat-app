import { ChatSidebar } from '@/components/siderbar'
import { appSocket } from '@/lib/socket.io'
import { useEffect } from 'react'

export default function ChatLayout() {
  useEffect(() => {
    if (appSocket.disconnected) appSocket.connect()
    return () => {
      appSocket.disconnect()
    }
  }, [])
  return <ChatSidebar />
}
