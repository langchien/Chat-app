import { API_ROUTES, ApiRequest } from '../request.interface'
import {
  type IForgotPasswordReqBodyDto,
  type ILoginReqBodyDto,
  type IRegisterReqBodyDto,
  type ISendOtpReqBodyDto,
  type IVerifyOtpDto,
} from './auth.req.dto'
import type { LoginResponseDto } from './auth.res.dto'

class AuthRequest extends ApiRequest {
  sendVerifyEmail = async (body: ISendOtpReqBodyDto) => {
    const response = await this.httpRequest.post<null>(`${this.basePath}/send-verify-email`, body)
    return response.data
  }

  verifyEmail = async (body: IVerifyOtpDto) => {
    const response = await this.httpRequest.post<null>(`${this.basePath}/verify-email`, body)
    return response.data
  }

  signup = async (body: IRegisterReqBodyDto) => {
    const response = await this.httpRequest.post<LoginResponseDto>(
      `${this.basePath}/register`,
      body,
    )
    return response.data
  }

  signin = async (body: ILoginReqBodyDto) => {
    const response = await this.httpRequest.post<LoginResponseDto>(`${this.basePath}/login`, body)
    return response.data
  }

  refreshToken = async () => {
    const response = await this.httpRequest.post<LoginResponseDto>(`${this.basePath}/refresh-token`)
    return response.data
  }

  logout = async () => {
    const response = await this.httpRequest.post<null>(`${this.basePath}/logout`)
    return response.data
  }

  logoutAllDevices = async () => {
    const response = await this.httpRequest.post<null>(`${this.basePath}/logout-all-devices`)
    return response.data
  }

  sendResetPasswordEmail = async (body: ISendOtpReqBodyDto) => {
    const response = await this.httpRequest.post<null>(
      `${this.basePath}/password/send-verify-email`,
      body,
    )
    return response.data
  }

  verifyResetPasswordEmail = async (body: IVerifyOtpDto) => {
    const response = await this.httpRequest.post<null>(
      `${this.basePath}/password/verify-email`,
      body,
    )
    return response.data
  }

  resetPassword = async (body: IForgotPasswordReqBodyDto) => {
    const response = await this.httpRequest.post<null>(`${this.basePath}/password/reset`, body)
    return response.data
  }

  getGoogleOAuth2Url = async () => {
    const response = await this.httpRequest.get<{ url: string }>(`/oauth2/google`)
    return response.data
  }
}

export const authRequest = new AuthRequest(API_ROUTES.AUTH)
