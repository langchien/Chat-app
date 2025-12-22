import type { IChat } from '@/types/api.types'
import { useAuthStore } from '../stores/auth.store'

export const useChatName = (chat: IChat) => {
  const user = useAuthStore((state) => state.user)
  const groupInfo = chat.groupInfo
  const members = chat.participants.filter((p) => p.user.id !== user?.id)
  const firstMember = members[0]
  const displayName = groupInfo
    ? groupInfo.name
    : firstMember.nickname || firstMember.user.displayName
  return {
    chatDisplayName: displayName,
    directChatMember: firstMember,
  }
}
