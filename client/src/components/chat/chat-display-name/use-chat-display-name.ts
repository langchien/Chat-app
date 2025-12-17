import { useChatName } from '@/hooks/use-chat-name'
import { useRequest } from '@/hooks/use-request'
import type { IChat } from '@/services/api.types'
import {
  chatRequest,
  UpdateChatDisplayNameReqBodyDto,
  type IUpdateChatDisplayNameReqBodyDto,
} from '@/services/chat'
import { useAppStore } from '@/stores/app.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function useChatDisplayName(chat: IChat) {
  const [open, onOpenChange] = useState(false)
  const groupInfo = chat.groupInfo
  const { chatDisplayName, directChatMember } = useChatName(chat)
  const form = useForm<IUpdateChatDisplayNameReqBodyDto>({
    resolver: zodResolver(UpdateChatDisplayNameReqBodyDto),
    defaultValues: {
      displayName: chatDisplayName,
    },
  })

  const { isLoading } = useAppStore()
  const onSubmit = useRequest(
    (body: IUpdateChatDisplayNameReqBodyDto) => chatRequest.updateChatDisplayName(chat.id, body),
    {
      setError: form.setError,
      messageSuccess: 'Đổi tên thành công!',
      onSuccess: () => {
        onOpenChange(false)
      },
    },
  )

  return {
    open,
    onOpenChange,
    groupInfo,
    chatDisplayName,
    directChatMember,
    form,
    isLoading,
    onSubmit,
  }
}
