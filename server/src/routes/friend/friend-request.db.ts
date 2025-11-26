import z from 'zod'
import { FriendRequest } from './friend-request.schema'

export interface IFriendRequest extends z.infer<typeof FriendRequest> {}
