import { BaseCollection } from '@/lib/schema.common'
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

export const Media = BaseCollection.extend({
  type: z.enum(MediaType),
  url: z.url(),
  status: z.enum(MediaStatus),
})

export const MediaCollection = Media.partial({
  _id: true,
})

export const UpdateMedia = Media.partial().omit({
  _id: true,
  createdAt: true,
  type: true,
})
