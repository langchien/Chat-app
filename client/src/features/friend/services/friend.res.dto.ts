import type { IUserResDto } from '@/features/user/services'
import z from 'zod'
import { Friend, FriendRequest } from './friend.schema'

export interface IFriendResDto extends z.infer<typeof Friend> {}
export interface IFriendRequestResDto extends z.infer<typeof FriendRequest> {}

export interface IReceivedFriendRequestResDto extends IFriendRequestResDto {
  from: IUserResDto
}

export interface ISentFriendRequestResDto extends IFriendRequestResDto {
  to: IUserResDto
}

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
