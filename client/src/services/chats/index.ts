import type { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import type { IMessagePaginateCursorRes } from '../messages/message.res.dto'
import { API_ROUTES, ApiRequest } from '../request.interface'
import type { ICreateChatReqDto, IUpdateChatReqDto } from './chat.req.dto'
import type { IChatResDto } from './chat.res.dto'

class ChatRequest extends ApiRequest {
  create = async (body: ICreateChatReqDto) => {
    const response = await this.httpRequest.post<IChatResDto>(this.basePath, body)
    return response.data
  }

  update = async (chatId: string, body: IUpdateChatReqDto) => {
    const response = await this.httpRequest.patch<IChatResDto>(`${this.basePath}/${chatId}`, body)
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
    const response = await this.httpRequest.get<IMessagePaginateCursorRes>(this.basePath, {
      params,
    })
    return response.data
  }
}

export const chatRequest = new ChatRequest(API_ROUTES.CHAT)
