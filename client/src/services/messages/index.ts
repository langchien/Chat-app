import type { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import { API_ROUTES, ApiRequest } from '../request.interface'
import type { ICreateMessageBodyDto, IUpdateMessageBodyDto } from './message.req.dto'
import type {
  ICreateMessageResDto,
  IGetMessageResDto,
  IMessagePaginateCursorRes,
} from './message.res.dto'

class MessageRequest extends ApiRequest {
  create = async (body: ICreateMessageBodyDto) => {
    const response = await this.httpRequest.post<ICreateMessageResDto>(`${this.basePath}`, body)
    return response.data
  }

  update = async (messageId: string, body: IUpdateMessageBodyDto) => {
    const response = await this.httpRequest.patch<ICreateMessageResDto>(
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
    const response = await this.httpRequest.get<IGetMessageResDto>(`${this.basePath}/${messageId}`)
    return response.data
  }

  paginateMessagesByChatId = async (chatId: string, query: IPaginateCursorQuery) => {
    const response = await this.httpRequest.get<IMessagePaginateCursorRes>(
      `${this.basePath}/chat/${chatId}`,
      {
        params: query,
      },
    )
    return response.data
  }
}

export const messageRequest = new MessageRequest(API_ROUTES.MESSAGE)
