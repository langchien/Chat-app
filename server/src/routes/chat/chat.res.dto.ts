import { PaginateCursorResDto } from '@/lib/paginate-cusor.ctrl'
import z from 'zod'
import { UserResDto } from '../user/user.res.dto'
import { Chat } from './chat.schema'

export const ChatResDto = Chat.extend({
  participants: z.array(
    z.object({
      user: UserResDto,
      nickName: z.string().optional(),
    }),
  ),
})

export const ChatPaginateCursorResDto = PaginateCursorResDto.extend({
  data: z.array(ChatResDto),
})

export interface IChatPaginateCursorResDto extends z.infer<typeof ChatPaginateCursorResDto> {}
export interface IChatResDto extends z.infer<typeof ChatResDto> {}
