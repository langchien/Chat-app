import z from 'zod'

export const AccessTokenResDto = z.object({
  accessToken: z.string(),
})
export type IAccessTokenResDto = z.infer<typeof AccessTokenResDto>

export const SuccessResDto = z.object({})
export type ISuccessResDto = z.infer<typeof SuccessResDto>
