import { API_ROUTES, ApiRequest } from '@/constants/api-routes'
import type { IUserResDto } from '@/features/user/services'
import type {
  ICreateFriendRequestBodyDto,
  ISearchFriendReqQueryDto,
  IUpdateFriendRequestBodyDto,
} from './friend.req.dto'
import type {
  IFriendRequestResDto,
  IFriendStatusResDto,
  IReceivedFriendRequestResDto,
  ISentFriendRequestResDto,
} from './friend.res.dto'

class FriendRequest extends ApiRequest {
  checkFriendStatus = async (userId: string) => {
    const response = await this.httpRequest.get<IFriendStatusResDto>(
      `${this.basePath}/status/${userId}`,
    )
    return response.data.status
  }

  searchUser = async (params: ISearchFriendReqQueryDto) => {
    const response = await this.httpRequest.get<IUserResDto[]>(`${this.basePath}/search`, {
      params,
    })
    return response.data
  }

  createFriendRequest = async (body: ICreateFriendRequestBodyDto) => {
    const response = await this.httpRequest.post<IFriendRequestResDto>(
      `${this.basePath}/request`,
      body,
    )
    return response.data
  }

  updateFriendRequestStatus = async (id: string, body: IUpdateFriendRequestBodyDto) => {
    const response = await this.httpRequest.patch<IFriendRequestResDto>(
      `${this.basePath}/${id}`,
      body,
    )
    return response.data
  }

  getReceivedFriendRequests = async () => {
    const response = await this.httpRequest.get<IReceivedFriendRequestResDto[]>(
      `${this.basePath}/requests/received`,
    )
    return response.data
  }

  getSentFriendRequests = async () => {
    const response = await this.httpRequest.get<ISentFriendRequestResDto[]>(
      `${this.basePath}/requests/sent`,
    )
    return response.data
  }

  deleteFriendRequest = async (id: string) => {
    const response = await this.httpRequest.delete(`${this.basePath}/${id}`)
    return response.data
  }

  getListFriend = async () => {
    const response = await this.httpRequest.get<IUserResDto[]>(this.basePath)
    return response.data
  }

  deleteFriendByUserId = async (userId: string) => {
    const response = await this.httpRequest.delete(`${this.basePath}/user/${userId}`)
    return response.data
  }

  acceptByUserId = async (userId: string) => {
    const response = await this.httpRequest.post(`${this.basePath}/accept-by-user/${userId}`)
    return response.data
  }

  rejectByUserId = async (userId: string) => {
    const response = await this.httpRequest.post(`${this.basePath}/reject-by-user/${userId}`)
    return response.data
  }
}

export const friendRequest = new FriendRequest(API_ROUTES.FRIEND)
