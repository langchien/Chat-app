import { API_ROUTES, ApiRequest } from '@/constants/api-routes'
import type { ICreateUserReqBodyDto, IUpdateUserReqBodyDto } from './user.req.dto'
import type { IUserResDto } from './user.res.dto'

class UserRequest extends ApiRequest {
  search = async (query: string) => {
    const response = await this.httpRequest.get<IUserResDto[]>(`${this.basePath}`, {
      params: { q: query },
    })
    return response.data
  }

  getOneById = async (userId: string) => {
    const response = await this.httpRequest.get<IUserResDto>(`${this.basePath}/${userId}`)
    return response.data
  }

  deleteOneById = async (userId: string) => {
    const response = await this.httpRequest.delete<null>(`${this.basePath}/${userId}`)
    return response.data
  }

  create = async (body: ICreateUserReqBodyDto) => {
    const response = await this.httpRequest.post<IUserResDto>(`${this.basePath}`, body)
    return response.data
  }

  update = async (userId: string, body: IUpdateUserReqBodyDto) => {
    const response = await this.httpRequest.patch<IUserResDto>(`${this.basePath}/${userId}`, body)
    return response.data
  }
}

export const userRequest = new UserRequest(API_ROUTES.USER)
