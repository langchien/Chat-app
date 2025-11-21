import { createStringIdSchema } from '@/lib/schema.common'
import z from 'zod'

export const GetMediaParamSchema = z.object({
  mediaId: createStringIdSchema('mediaId'),
})
export interface IGetMediaParam extends z.infer<typeof GetMediaParamSchema> {}
