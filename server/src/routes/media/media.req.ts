import { createString, createStringId } from '@/lib/schema.common'
import z from 'zod'
import { Media, MediaType } from './media.schema'

export const MediaIdParamDto = z.object({
  mediaId: createStringId('mediaId'),
})
export interface IMediaIdParamDto extends z.infer<typeof MediaIdParamDto> {}

export const UpdateMediaDto = Media.pick({
  url: true,
  status: true,
  type: true,
  messageId: true,
  originalName: true,
}).partial()

export interface IUpdateMediaDto extends z.infer<typeof UpdateMediaDto> {}

export const GetFileReqParamsDto = z.object({
  fileName: createString('fileName'),
  mediaType: z.enum(MediaType),
})
export interface IGetFileReqParamsDto extends z.infer<typeof GetFileReqParamsDto> {}
