import { accessTokenValidate } from '@/core/access-token.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { mediaCtrl } from './media.ctrl'
import { MediaIdParamDto } from './media.req'

export const mediaRouter = Router()

mediaRouter.get('/images/:imageName', mediaCtrl.serveImage)
mediaRouter.get('/files/:fileName', mediaCtrl.serveFile)
mediaRouter.get('/videos/:videoName', mediaCtrl.serveVideoStream)

mediaRouter.get('/videos-hls/:id/master.m3u8', mediaCtrl.serveVideoM3u8)
mediaRouter.get('/videos-hls/:id/:v/:segment', mediaCtrl.serveVideoHlsPlaylist)

mediaRouter.post('/files', accessTokenValidate, mediaCtrl.uploadFile)
mediaRouter.post('/images', accessTokenValidate, mediaCtrl.uploadImages)
mediaRouter.post('/videos', accessTokenValidate, mediaCtrl.uploadVideo)
mediaRouter.post('/videos-hls', accessTokenValidate, mediaCtrl.uploadVideoHls)

mediaRouter.get(
  '/:mediaId',
  accessTokenValidate,
  zodValidate(MediaIdParamDto, 'params'),
  mediaCtrl.getOneById,
)
