import z from 'node_modules/zod/v4/classic/external.cjs'
import { Media } from './media.schema'

const CreateMedia = Media.pick({
  id: true,
  type: true,
  url: true,
  status: true,
  messageId: true,
  originalName: true,
}).partial({
  id: true,
})

export const UpdateMedia = Media.pick({
  status: true,
  messageId: true,
  originalName: true,
}).partial()

export interface IMedia extends z.infer<typeof Media> {}
export interface IUpdateMediaInput extends z.input<typeof UpdateMedia> {}
export interface ICreateMediaInput extends z.input<typeof CreateMedia> {}
