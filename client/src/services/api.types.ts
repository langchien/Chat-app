import type { IChatPaginateCursorResDto, IChatResDto } from './chats/chat.res.dto'
import type { IMediaResDto } from './media/media.res'
import type { IMessagePaginateCursorResDto, IMessageResDto } from './messages/message.res.dto'
import type { IUserResDto } from './user/user.res.dto'

// Do copy các file DTO và schema từ backend sang nên tạo file này để đổi tên interface cho ngắn gọn dễ dùng hơn mà không thay đổi gì các file copy từ backend
export interface IUser extends IUserResDto {}
export interface IMessage extends IMessageResDto {}
export interface IChat extends IChatResDto {}
export interface IMedia extends IMediaResDto {}
export interface IChatPaginate extends IChatPaginateCursorResDto {}
export interface IMessagePaginate extends IMessagePaginateCursorResDto {}
