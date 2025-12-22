import { API_ROUTES, ApiRequest } from '@/constants/api-routes'
import type { IChatResDto } from '@/features/chat/services'
import type { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import type { ICreateMessageBodyDto, IUpdateMessageBodyDto } from './message.req.dto'
import type { IMessagePaginateCursorResDto, IMessageResDto } from './message.res.dto'

class MessageRequest extends ApiRequest {
  create = async (body: ICreateMessageBodyDto) => {
    const response = await this.httpRequest.post<{
      message: IMessageResDto
      chat: IChatResDto
    }>(`${this.basePath}`, body)
    return response.data
  }

  update = async (messageId: string, body: IUpdateMessageBodyDto) => {
    const response = await this.httpRequest.patch<IMessageResDto>(
      `${this.basePath}/${messageId}`,
      body,
    )
    return response.data
  }

  delete = async (messageId: string) => {
    const response = await this.httpRequest.delete<null>(`${this.basePath}/${messageId}`)
    return response.data
  }

  getById = async (messageId: string) => {
    const response = await this.httpRequest.get<IMessageResDto>(`${this.basePath}/${messageId}`)
    return response.data
  }

  paginateMessagesByChatId = async (chatId: string, query: IPaginateCursorQuery) => {
    const response = await this.httpRequest.get<IMessagePaginateCursorResDto>(
      `${this.basePath}/chat/${chatId}`,
      {
        params: query,
      },
    )
    return response.data
  }
}

export const messageRequest = new MessageRequest(API_ROUTES.MESSAGE)
