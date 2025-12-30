import { UserResDto } from '@/features/user/services'
import { PaginateCursorResDto } from '@/lib/paginate-cusor.ctrl'
import z from 'zod'
import { Chat, Participant } from './chat.schema'

export const ParticipantResDto = Participant.extend({
  user: UserResDto,
})

export const ChatResDto = Chat.extend({
  participants: z.array(ParticipantResDto),
})

export const ChatPaginateCursorResDto = PaginateCursorResDto.extend({
  data: z.array(ChatResDto),
})

export interface IParticipantResDto extends z.infer<typeof ParticipantResDto> {}
export interface IChatPaginateCursorResDto extends z.infer<typeof ChatPaginateCursorResDto> {}
export interface IChatResDto extends z.infer<typeof ChatResDto> {}

export interface IChatLink {
  url: string
  messageId: string
  createdAt: string
}
