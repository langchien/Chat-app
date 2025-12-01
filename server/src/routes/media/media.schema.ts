import { BaseCollection, createStringId } from '@/lib/schema.common'
import z from 'zod'

export const MediaType = {
  image: 'image',
  video: 'video',
  video_hls: 'video_hls',
  file: 'file',
  audio: 'audio',
} as const

export type MediaType = (typeof MediaType)[keyof typeof MediaType]

export const MediaStatus = {
  pending: 'pending',
  processing: 'processing',
  completed: 'completed',
  failed: 'failed',
} as const

export type MediaStatus = (typeof MediaStatus)[keyof typeof MediaStatus]

export const Media = BaseCollection.extend({
  type: z.enum(MediaType),
  url: z.url(),
  originalName: z.string(),
  status: z.enum(MediaStatus),
  messageId: createStringId('messageId').nullish(),
})
