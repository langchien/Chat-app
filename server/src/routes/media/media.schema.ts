import { BaseCollectionSchema } from '@/lib/schema.common'
import z from 'zod'

export enum MediaType {
  Image = 'image',
  Video = 'video',
  HLS = 'video-hls',
  File = 'file',
}

export enum MediaStatus {
  Pending = 'pending',
  Processing = 'processing',
  Compileted = 'completed',
  Failed = 'failed',
}

export const MediaSchema = BaseCollectionSchema.extend({
  type: z.enum(MediaType),
  url: z.url(),
  status: z.enum(MediaStatus),
})

export const MediaCollectionSchema = MediaSchema.partial({
  _id: true,
})

export const UpdateMediaSchema = MediaSchema.partial().omit({
  _id: true,
  createdAt: true,
  type: true,
})

export interface IInsertMediaInput extends z.input<typeof MediaCollectionSchema> {}
export interface IMedia extends z.infer<typeof MediaSchema> {}
export interface IMediaCollection extends z.infer<typeof MediaCollectionSchema> {}
export interface IUpdateMediaInput extends z.input<typeof UpdateMediaSchema> {}
