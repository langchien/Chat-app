import z from 'node_modules/zod/v4/classic/external.cjs'
import { Chat } from './chat.schema'

export const ChatCollection = Chat.partial({ _id: true })
export const UpdateChat = Chat.partial().omit({
  _id: true,
  createdAt: true,
})

export interface IChat extends z.infer<typeof Chat> {}
export interface IChatCollection extends z.infer<typeof ChatCollection> {}
export interface ICreateChatInp extends z.input<typeof ChatCollection> {}
export interface IUpdateChatInp extends z.input<typeof UpdateChat> {}
