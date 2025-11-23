import z from 'zod'
import { FriendRequest } from './friend-request.schema'

export const FriendRequestColection = FriendRequest.partial({ _id: true })

export interface IFriendRequest extends z.infer<typeof FriendRequest> {}
export interface IFriendRequestColection extends z.infer<typeof FriendRequestColection> {}
