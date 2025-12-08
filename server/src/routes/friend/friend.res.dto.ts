import z from 'zod'
import { Friend, FriendRequest } from './friend.schema'

export interface IFriendResDto extends z.infer<typeof Friend> {}
export interface IFriendRequestResDto extends z.infer<typeof FriendRequest> {}
