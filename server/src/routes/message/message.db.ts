import z from 'node_modules/zod/v4/classic/external.cjs'
import { Message } from './message.schema'

export const MessageCollection = Message.partial({ _id: true })

export const UpdateMessage = Message.partial().omit({
  _id: true,
  createdAt: true,
  senderId: true,
  chatId: true,
})

export interface IMessage extends z.infer<typeof Message> {}
export interface IMessageCollection extends z.infer<typeof MessageCollection> {}
export interface IUpdateMessageInput extends z.input<typeof UpdateMessage> {}
export interface ICreateMessageInput extends z.input<typeof Message> {}
