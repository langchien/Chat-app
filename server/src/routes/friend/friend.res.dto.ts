import z from 'zod'
import { UserResDto } from '../user/user.res.dto'
import { Friend, FriendRequest } from './friend.schema'

export interface IFriendResDto extends z.infer<typeof Friend> {}
export interface IFriendRequestResDto extends z.infer<typeof FriendRequest> {}

export const ReceivedFriendRequestResDto = FriendRequest.extend({
  from: UserResDto,
})

export interface IReceivedFriendRequestResDto extends z.infer<typeof ReceivedFriendRequestResDto> {}

export const SentFriendRequestResDto = FriendRequest.extend({
  to: UserResDto,
})

export interface ISentFriendRequestResDto extends z.infer<typeof SentFriendRequestResDto> {}

export const FriendStatus = {
  FRIEND: 'FRIEND',
  NOT_FRIEND: 'NOT_FRIEND',
  REQUEST_SENT: 'REQUEST_SENT',
  REQUEST_RECEIVED: 'REQUEST_RECEIVED',
} as const

export type FriendStatus = (typeof FriendStatus)[keyof typeof FriendStatus]

export interface IFriendStatusResDto {
  status: FriendStatus
}
