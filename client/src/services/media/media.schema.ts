import { BaseCollection, createStringId } from '@/lib/schema.common'
import z from 'zod'

export const MediaType = {
  image: 'image',
  video: 'video',
  video_hls: 'video_hls',
  file: 'file',
} as const

export const MediaStatus = {
  pending: 'pending',
  processing: 'processing',
  compileted: 'compileted',
  failed: 'failed',
} as const

export const Media = BaseCollection.extend({
  type: z.enum(MediaType),
  url: z.url(),
  originalName: z.string(),
  status: z.enum(MediaStatus),
  messageId: createStringId('messageId').nullish(),
})
