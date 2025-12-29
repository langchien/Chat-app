import { chatRequest } from '@/features/chat/services'
import type { IChat } from '@/types/api.types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IChatState {
  data: IChat[]
  hasMore: boolean
  nextCursor: string | null
}

interface IChatActions {
  setChatList: (data: IChat[]) => void
  getMyChatList: () => Promise<void>
  getMore: () => Promise<void>
  clearChatStore: () => void
}
const LOCAL_STORAGE_KEY = 'chat-storage'
const INIT_LIMIT = 20

export const useChatStore = create<IChatState & IChatActions>()(
  persist(
    (set, get, store) => ({
      data: [],
      hasMore: false,
      nextCursor: null,
      setChatList: (data: IChat[]) => {
        set({ data })
      },
      getMyChatList: async () => {
        const response = await chatRequest.paginate({
          limit: INIT_LIMIT,
        })
        set({
          ...response,
        })
      },
      getMore: async () => {
        const nextCursor = get().nextCursor
        if (!nextCursor) return
        const response = await chatRequest.paginate({
          limit: INIT_LIMIT,
          cursor: nextCursor,
        })
        set({
          ...response,
          data: [...get().data, ...response.data],
        })
      },
      clearChatStore: () => {
        set(store.getInitialState())
        localStorage.removeItem(LOCAL_STORAGE_KEY)
      },
    }),
    {
      name: LOCAL_STORAGE_KEY,
      partialize: (state) => ({
        data: state.data,
        hasMore: state.hasMore,
        nextCursor: state.nextCursor,
      }),
    },
  ),
)
