import { PaginateCursorResSchema } from '@/lib/paginate-cusor.ctrl'
import z from 'zod'
import { UserResSchema } from '../user/user.res.dto'
import { ChatSchemma } from './chat.schema'

export const ChatDetailsResSchema = ChatSchemma.extend({
  participants: z.array(
    z.object({
      user: UserResSchema,
      nickName: z.string().optional(),
    }),
  ),
})

export const ChatPaginateCursorResSchema = PaginateCursorResSchema.extend({
  data: z.array(ChatDetailsResSchema),
})

export interface IChatPaginateCursorRes extends z.infer<typeof ChatPaginateCursorResSchema> {}

export const ChatResSchema = ChatSchemma

export interface IChatResDto extends z.infer<typeof ChatResSchema> {}
export interface IChatDetailsResDto extends z.infer<typeof ChatDetailsResSchema> {}
