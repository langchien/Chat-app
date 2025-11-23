import z from 'node_modules/zod/v4/classic/external.cjs'
import { Media } from './media.schema'

export const MediaCollection = Media.partial({
  _id: true,
})

export const UpdateMedia = Media.partial().omit({
  _id: true,
  createdAt: true,
  type: true,
})

export interface IInsertMediaInput extends z.input<typeof MediaCollection> {}
export interface IMedia extends z.infer<typeof Media> {}
export interface IMediaCollection extends z.infer<typeof MediaCollection> {}
export interface IUpdateMediaInput extends z.input<typeof UpdateMedia> {}
