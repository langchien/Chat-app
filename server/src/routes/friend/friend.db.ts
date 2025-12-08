import z from 'zod'
import { Friend, FriendRequest } from './friend.schema'

const CreateFriendRequestInput = FriendRequest.pick({
  fromId: true,
  toId: true,
  message: true,
})

const UpdateFriendRequestStatusInput = FriendRequest.pick({
  status: true,
})

export interface IFriendRequest extends z.infer<typeof FriendRequest> {}
export interface IFriend extends z.infer<typeof Friend> {}
export interface ICreateFriendRequestInput extends z.infer<typeof CreateFriendRequestInput> {}
export interface IUpdateFriendRequestStatusInput
  extends z.infer<typeof UpdateFriendRequestStatusInput> {}
