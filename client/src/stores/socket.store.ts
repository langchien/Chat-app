import { envConfig } from '@/config/envConfig'
import { SOCKET_EVENTS } from '@/constants/event.const'
import { io, type Socket } from 'socket.io-client'
import { create } from 'zustand'
import { useAuthStore } from './auth.store'

interface ISocketState {
  socket: Socket | null
  isConnected: boolean
  onlineUsers: string[]
}
interface ISocketActions {
  connect: () => void
  disconnect: () => void
  setOnlineUsers: (users: string[]) => void
}

export const useSocketStore = create<ISocketState & ISocketActions>((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  connect: () => {
    if (get().socket?.active) return // Chỉ kết nối nếu chưa có kết nối hiện tại
    const isExistingSocket = get().socket
    if (isExistingSocket) return
    const socket: Socket = io(envConfig.apiBaseUrl, {
      transports: ['websocket'],
      // dùng cb để lấy token mới nhất từ auth store
      auth: (cb) => {
        const accessToken = useAuthStore.getState().accessToken
        // Gửi token theo định dạng mà server `authenticateSocket` mong đợi
        cb({ Authorization: `Bearer ${accessToken}` })
      },
    })
    set({ socket, isConnected: true })
    socket.on('connect', () => {})
    socket.on('disconnect', (reason) => {
      set({ socket: null, isConnected: false, onlineUsers: [] })
    })
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      // todo: handle errors
    })
    // Lắng nghe sự kiện online users từ server
    socket.on(SOCKET_EVENTS.ONLINE_USERS, (userIds: string[]) => {
      set({ onlineUsers: userIds })
    })
  },
  disconnect: () => {
    const socket = get().socket
    if (socket) {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off(SOCKET_EVENTS.ONLINE_USERS)
      socket.disconnect()
      set({ socket: null, isConnected: false, onlineUsers: [] })
    }
  },
  setOnlineUsers: (users: string[]) => {
    set({ onlineUsers: users })
  },
}))
