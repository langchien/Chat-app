import type {
  IChatPaginateCursorResDto,
  IChatResDto,
  IParticipantResDto,
} from '@/features/chat/services'
import type {
  IFriendRequestResDto,
  IFriendResDto,
  IReceivedFriendRequestResDto,
  ISentFriendRequestResDto,
} from '@/features/friend/services'
import type { IMessagePaginateCursorResDto, IMessageResDto } from '@/features/message/services'
import type { IMediaResDto } from '@/features/message/services/media'
import type { IUserResDto } from '@/features/user/services'

// Do copy các file DTO và schema từ backend sang nên tạo file này để đổi tên interface cho ngắn gọn dễ dùng hơn mà không thay đổi gì các file copy từ backend
export interface IUser extends IUserResDto {}
export interface IMessage extends IMessageResDto {}
export interface IChat extends IChatResDto {}
export interface IMedia extends IMediaResDto {}
export interface IChatPaginate extends IChatPaginateCursorResDto {}
export interface IMessagePaginate extends IMessagePaginateCursorResDto {}
export interface IParticipant extends IParticipantResDto {}
export interface IFriend extends IFriendResDto {}
export interface IFriendRequest extends IFriendRequestResDto {}
export interface IReceivedFriendRequest extends IReceivedFriendRequestResDto {}
export interface ISentFriendRequest extends ISentFriendRequestResDto {}
