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

export const ChatPaginateCursorRes = PaginateCursorResDto.extend({
  data: z.array(ChatResDto),
})

export interface IChatPaginateCursorRes extends z.infer<typeof ChatPaginateCursorRes> {}
export interface IChatResDto extends z.infer<typeof ChatResDto> {}
