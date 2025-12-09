import { createStringId } from '@/lib/schema.common'
import z from 'zod'
import { User } from '../user/user.schema'
import { Chat, GroupInfo, Participant } from './chat.schema'

export const CreateChatInp = Chat.pick({
  type: true,
  groupInfo: true,
  lastMessage: true,
}).extend({
  receiverIds: z.array(createStringId('ReceiverIds')),
})

export const UpdateChatInp = Chat.pick({
  groupInfo: true,
  lastMessage: true,
}).partial()

export const UpdatePaticipantsInp = Participant.pick({
  nickname: true,
})

const ParticipantIncludeUser = Participant.extend({
  user: User,
})

export const ChatIncludeParticipants = Chat.extend({
  participants: z.array(ParticipantIncludeUser),
})

export interface IChat extends z.infer<typeof Chat> {}
export interface ICreateChatInp extends z.input<typeof CreateChatInp> {}
export interface IUpdateChatInp extends z.input<typeof UpdateChatInp> {}
export interface IUpdateParticipantsInp extends z.input<typeof UpdatePaticipantsInp> {}
export interface IParticipant extends z.infer<typeof Participant> {}
export interface IChatGroupInfo extends z.infer<typeof GroupInfo> {}
export interface IChatIncludeParticipants extends z.infer<typeof ChatIncludeParticipants> {}
