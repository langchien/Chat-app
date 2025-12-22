import { API_ROUTES, ApiRequest } from '@/constants/api-routes'
import type { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import type {
  ICreateChatReqDto,
  IUpdateChatDisplayNameReqBodyDto,
  IUpdateChatReqDto,
} from './chat.req.dto'
import type { IChatPaginateCursorResDto, IChatResDto } from './chat.res.dto'

class ChatRequest extends ApiRequest {
  create = async (body: ICreateChatReqDto) => {
    const response = await this.httpRequest.post<IChatResDto>(this.basePath, body)
    return response.data
  }

  update = async (chatId: string, body: IUpdateChatReqDto) => {
    const response = await this.httpRequest.patch<IChatResDto>(`${this.basePath}/${chatId}`, body)
    return response.data
  }

  updateChatDisplayName = async (chatId: string, body: IUpdateChatDisplayNameReqBodyDto) => {
    const response = await this.httpRequest.patch<IChatResDto>(
      `${this.basePath}/${chatId}/display-name`,
      body,
    )
    return response.data
  }
  getById = async (chatId: string) => {
    const response = await this.httpRequest.get<IChatResDto>(`${this.basePath}/${chatId}`)
    return response.data
  }

  delete = async (chatId: string) => {
    const response = await this.httpRequest.delete<null>(`${this.basePath}/${chatId}`)
    return response.data
  }

  paginate = async (params: IPaginateCursorQuery) => {
    const response = await this.httpRequest.get<IChatPaginateCursorResDto>(this.basePath, {
      params,
    })
    return response.data
  }

  paginateWithAuth = async (params: IPaginateCursorQuery, accessToken: string) => {
    const response = await this.httpRequest.get<IChatPaginateCursorResDto>(this.basePath, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  }

  getOrCreateChatByUserId = async (userId: string) => {
    const response = await this.httpRequest.get<IChatResDto>(`${this.basePath}/user/${userId}`)
    return response.data
  }
}

export const chatRequest = new ChatRequest(API_ROUTES.CHAT)
