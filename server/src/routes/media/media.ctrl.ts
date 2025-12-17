import { envConfig } from '@/config/env-config'
import { BadRequestException, NotFoundException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { socketService } from '@/socket'
import { RequestHandler, Response } from 'express'
import { File } from 'formidable'
import { IChatIdParamDto } from '../chat/chat.req.dto'
import { ChatResDto, IChatResDto } from '../chat/chat.res.dto'
import { IMessageResDto, MessageResDto } from '../message/message.res.dto'
import { UserResDto } from '../user/user.res.dto'
import { IMedia } from './media.db'
import { mediaQueue } from './media.queue'
import { IGetFileReqParamsDto, IMediaIdParamDto, IUpdateMediaDto } from './media.req'
import { IMediaResDto } from './media.res'
import { Media } from './media.schema'
import { mediaService } from './media.service'

const IS_LOCAL = envConfig.upload.provider === 'local'

class MediaCtrl {
  private sendMessageSocket = (
    res: Response,
    payload: { message: IMessageResDto; chat: IChatResDto },
  ) => {
    const { chat, message } = payload
    const messageRes = MessageResDto.parse(message)
    const chatRes = ChatResDto.parse(chat)
    const resultPayload = { message: messageRes, chat: chatRes }
    socketService.sendMessage(chat.id, resultPayload)
    res.status(HttpStatusCode.Created).json(resultPayload)
  }
  // Lấy thông tin media theo id
  getOneById: RequestHandler<IMediaIdParamDto, IMedia> = async (req, res) => {
    const media = await mediaService.findOneById(req.params.mediaId)
    if (!media) throw new NotFoundException('Không tìm thấy media')
    res.json(Media.parse(media))
  }

  updateMedia: RequestHandler<any, IMediaResDto, IUpdateMediaDto> = async (req, res) => {
    const mediaId = req.params.mediaId
    const updateData = req.body
    const updatedMedia = await mediaService.update(mediaId, updateData)
    if (!updatedMedia) throw new NotFoundException('Không tìm thấy media để cập nhật')
    res.json(Media.parse(updatedMedia))
  }

  muiltiUploadMedia: RequestHandler<IChatIdParamDto> = async (req, res) => {
    const user = req.user
    const chatId = req.params.chatId
    const contents: string[] | undefined = req.body?.contents
    const content = contents && contents.length > 0 ? contents[0] : ''

    if (!req.files)
      throw new BadRequestException(undefined, 'Chưa có file để upload, hoặc các file không hợp lệ')
    const allFiles = Object.values(req.files)
      .flat()
      .filter((file) => file instanceof File)
    if (allFiles.length === 0)
      throw new BadRequestException(undefined, 'Chưa có file để upload, hoặc các file không hợp lệ')

    const response = await mediaService.multiUploadAndCreateMessage(
      allFiles,
      chatId,
      user.userId,
      content,
    )
    return this.sendMessageSocket(res, response)
  }

  uploadAvatar: RequestHandler = async (req, res) => {
    const images = req.files?.image
    if (!images || (Array.isArray(images) && images.length === 0))
      throw new BadRequestException(undefined, 'Chưa có ảnh để upload, hoặc các ảnh không hợp lệ')

    const result = await mediaService.handleTransformAvatar(images[0], IS_LOCAL, req.user.userId)
    res.status(HttpStatusCode.Created).json(UserResDto.parse(result))
  }

  // Upload video chuyển sang HLS
  uploadVideoHls: RequestHandler = async (req, res) => {
    const videos = req.files?.video
    if (!videos || (Array.isArray(videos) && videos.length === 0))
      throw new BadRequestException(
        undefined,
        'Chưa có video để upload, hoặc các video không hợp lệ',
      )
    const result = await mediaService.handleVideoToHLS(videos[0])
    mediaQueue.enqueue({ id: result.id, video: videos[0], chatId: req.params.chatId })
    res.status(HttpStatusCode.Created).json(Media.parse(result))
  }

  // Upload video chuyển sang HLS
  createMessageWithVideoHLS: RequestHandler<IChatIdParamDto> = async (req, res) => {
    const videos = req.files?.video
    if (!videos || (Array.isArray(videos) && videos.length === 0))
      throw new BadRequestException(
        undefined,
        'Chưa có video để upload, hoặc các video không hợp lệ',
      )
    const chatId = req.params.chatId
    const senderId = req.user.userId
    const contents = req.body.contents
    const content = contents && contents.length > 0 ? contents[0] : ''

    const response = await mediaService.createMessageWithVideoHLS(
      videos[0],
      chatId,
      senderId,
      content,
    )
    return this.sendMessageSocket(res, response)
  }

  // Phục vụ file đã upload, chỉ tải do không truyền content-type khi upload lên s3
  serveFile: RequestHandler<IGetFileReqParamsDto> = async (req, res, next) => {
    const { mediaType, fileName } = req.params
    await mediaService.serveFile(mediaType, fileName, res, next)
  }

  serveVideoStream: RequestHandler = async (req, res) => {
    const videoName = req.params.videoName
    const range = req.headers.range
    if (!range) throw new BadRequestException()

    const { headers, stream } = await mediaService.getVideoStream(videoName, range)

    res.writeHead(206, headers)
    stream.pipe(res)
  }

  // Phục vụ file m3u8 HLS
  serveVideoM3u8: RequestHandler = async (req, res, next) => {
    const id = req.params.id
    await mediaService.serveVideoM3u8(id, res, next)
  }

  // Phục vụ playlist HLS
  serveVideoHlsPlaylist: RequestHandler = async (req, res, next) => {
    const { id, v, segment } = req.params
    await mediaService.serveVideoHlsPlaylist(id, v, segment, res, next)
  }
}

export const mediaCtrl = new MediaCtrl()
