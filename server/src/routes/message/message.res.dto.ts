import { PaginateCursorResDto } from '@/lib/paginate-cusor.ctrl'
import z from 'zod'
import { Media } from '../media/media.schema'
import { Message } from './message.schema'

export const MessagePaginateCursorResDto = PaginateCursorResDto.extend({
  data: z.array(Message),
})

export const MessageResDto = Message.extend({
  medias: z.array(Media).nullish(),
})

export interface IMessagePaginateCursorResDto extends z.infer<typeof MessagePaginateCursorResDto> {}
export interface IMessageResDto extends z.infer<typeof MessageResDto> {}
export type IMessageResDto2 = z.infer<typeof MessageResDto>
