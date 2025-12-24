import { accessTokenValidate } from '@/core/access-token.middleware'
import { formDataParser } from '@/core/form-data.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { ChatIdParam } from '../chat/chat.req.dto'
import { mediaCtrl } from './media.ctrl'
import { GetFileReqParamsDto, MediaIdParamDto, UpdateMediaDto } from './media.req'

export const mediaRouter = Router()

mediaRouter.get('/videos/:videoName', mediaCtrl.serveVideoStream)

// HLS video routes
mediaRouter.post('/videos-hls', accessTokenValidate, mediaCtrl.uploadVideoHls)
mediaRouter.get('/videos-hls/:id/master.m3u8', mediaCtrl.serveVideoM3u8)
mediaRouter.get('/videos-hls/:id/:v/:segment', mediaCtrl.serveVideoHlsPlaylist)

mediaRouter.get(
  '/:mediaId',
  accessTokenValidate,
  zodValidate(MediaIdParamDto, 'params'),
  mediaCtrl.getOneById,
)
mediaRouter.patch(
  '/:mediaId',
  accessTokenValidate,
  zodValidate(MediaIdParamDto, 'params'),
  zodValidate(UpdateMediaDto),
  mediaCtrl.updateMedia,
)

mediaRouter.post(
  '/chats/:chatId',
  accessTokenValidate,
  zodValidate(ChatIdParam, 'params'),
  formDataParser(),
  mediaCtrl.muiltiUploadMedia,
)
mediaRouter.get(
  '/:mediaDirectory/:fileName',
  zodValidate(GetFileReqParamsDto, 'params'),
  mediaCtrl.serveFile,
) // Phải để cuối cùng vì có thể trùng với các route khác
