import type z from 'zod'
import { Media } from './media.schema'

export interface IMediaResDto extends z.infer<typeof Media> {}
