import { createString, createStringId } from '@/lib/schema.common'
import z from 'zod'
import { FriendRequest } from './friend.schema'

export const SearchFriendReqQueryDto = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number(),
})

export const CreateFriendRequestBodyDto = z.object({
  toId: createStringId('Id người nhận'),
  message: createString('Lời nhắn'),
})

export const UpdateFriendRequestBodyDto = FriendRequest.pick({
  status: true,
})

export interface ISearchFriendReqQueryDto extends z.infer<typeof SearchFriendReqQueryDto> {}

export interface ICreateFriendRequestBodyDto extends z.infer<typeof CreateFriendRequestBodyDto> {}

export interface IUpdateFriendRequestBodyDto extends z.infer<typeof UpdateFriendRequestBodyDto> {}
