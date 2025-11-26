import { BaseCollection, createStringId } from '@/lib/schema.common'
import z from 'zod'

export const MediaType = {
  Image: 'image',
  Video: 'video',
  HLS: 'video_hls',
  File: 'file',
} as const

export const MediaStatus = {
  Pending: 'pending',
  Processing: 'processing',
  Compileted: 'completed',
  Failed: 'failed',
} as const

export const Media = BaseCollection.extend({
  type: z.enum(MediaType),
  url: z.url(),
  status: z.enum(MediaStatus),
  messageId: createStringId('messageId').nullish(),
})
