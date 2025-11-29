import { accessTokenValidate } from '@/core/access-token.middleware'
import { formDataParser, singleVideoMiddleware } from '@/core/form-data.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { ChatIdParam } from '../chat/chat.req.dto'
import { mediaCtrl } from './media.ctrl'
import { GetFileReqParamsDto, MediaIdParamDto, UpdateMediaDto } from './media.req'

export const mediaRouter = Router()

// upload và serve file media
mediaRouter.post(
  '/chats/:chatId',
  accessTokenValidate,
  zodValidate(ChatIdParam, 'params'),
  formDataParser(),
  mediaCtrl.muiltiUploadMedia,
)
mediaRouter.get('/static/video/:videoName', mediaCtrl.serveVideoStream)
mediaRouter.get(
  '/static/:mediaType/:fileName',
  zodValidate(GetFileReqParamsDto, 'params'),
  mediaCtrl.serveFile,
)

// HLS video routes
// Route này để test
mediaRouter.post('/video_hls', accessTokenValidate, singleVideoMiddleware, mediaCtrl.uploadVideoHls)
// Route này để upload video HLS kèm tin nhắn trong chat
mediaRouter.post(
  '/video_hls/chats/:chatId',
  accessTokenValidate,
  zodValidate(ChatIdParam, 'params'),
  singleVideoMiddleware,
  mediaCtrl.createMessageWithVideoHLS,
)
mediaRouter.get('/stream/video_hls/:id/master.m3u8', mediaCtrl.serveVideoM3u8)
mediaRouter.get('/stream/video_hls/:id/:v/:segment', mediaCtrl.serveVideoHlsPlaylist)

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
  '/avatar',
  accessTokenValidate,
  formDataParser({
    multiples: false,
    maxFiles: 1,
    filter: (part) => Boolean(part.name === 'image' && part.mimetype?.startsWith('image/')),
  }),
  mediaCtrl.uploadAvatar,
)
