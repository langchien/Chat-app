import { createStringId } from '@/lib/schema.common'
import z from 'zod'

export const MediaIdParamDto = z.object({
  mediaId: createStringId('mediaId'),
})
export interface IMediaIdParamDto extends z.infer<typeof MediaIdParamDto> {}
