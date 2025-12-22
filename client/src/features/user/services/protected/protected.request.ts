import { API_ROUTES, ApiRequest } from '@/constants/api-routes'
import type { IUserResDto } from '../'
import type { IChangePassworBodyDto, IUpdateProfileBodyDto } from './protected.req.dto'

class ProtectedRequest extends ApiRequest {
  getProfileWithAuth = async (accessToken: string) => {
    const response = await this.httpRequest.get<IUserResDto>(`${this.basePath}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  }
  getProfile = async () => {
    const response = await this.httpRequest.get<IUserResDto>(`${this.basePath}/profile`)
    return response.data
  }

  updateProfile = async (body: IUpdateProfileBodyDto) => {
    const response = await this.httpRequest.patch<IUserResDto>(`${this.basePath}/profile`, body)
    return response.data
  }

  changePassword = async (body: IChangePassworBodyDto) => {
    const response = await this.httpRequest.post<null>(`${this.basePath}/change-password`, body)
    return response.data
  }
}

export const protectedRequest = new ProtectedRequest(API_ROUTES.PROTECTED)
