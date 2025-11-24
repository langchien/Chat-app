import { PaginateCursorResDto } from '@/lib/paginate-cusor.ctrl'
import z from 'zod'
import { Media } from '../media/media.schema'
import { Message } from './message.schema'

export const MessagePaginateCursorResDto = PaginateCursorResDto.extend({
  data: z.array(Message),
})

export const GetMessageResDto = Message.extend({
  media: Media.omit({
    createdAt: true,
    updatedAt: true,
  }).optional(),
}).omit({
  mediaId: true,
})

export interface IMessagePaginateCursorResDto extends z.infer<typeof MessagePaginateCursorResDto> {}
export interface IGetMessageResDto extends z.infer<typeof GetMessageResDto> {}
export interface ICreateMessageResDto extends z.infer<typeof Message> {}
