import { logger } from '@/lib/logger.service'
import ffmpegPath from 'ffmpeg-static'
import ffprobePath from 'ffprobe-static'
import path from 'path'
import slash from 'slash'
import { $, quote } from 'zx'

$.quote = quote

const ALL_RESOLUTIONS = [360, 480, 720, 1080]

if (!ffmpegPath) {
  throw new Error('ffmpeg system path not found')
}

if (!ffprobePath.path) {
  throw new Error('ffprobe system path not found')
}

const FFMPEG_PATH = slash(ffmpegPath)
const FFPROBE_PATH = slash(ffprobePath.path)

const MAXIMUM_BITRATE_360P = 1 * 10 ** 6 // 1Mbps
const MAXIMUM_BITRATE_480P = 2.5 * 10 ** 6 // 2.5Mbps
const MAXIMUM_BITRATE_720P = 5 * 10 ** 6 // 5Mbps
const MAXIMUM_BITRATE_1080P = 8 * 10 ** 6 // 8Mbps

interface EncodeByResolution {
  inputPath: string
  isHasAudio: boolean
  outputSegmentPath: string
  outputPath: string
  resolutions: number[] // Danh sách các độ phân giải cần encode
  bitrate: {
    360: number
    480: number
    720: number
    1080: number
    original: number
  }
  originalResolution: {
    width: number
    height: number
  }
}
class FfmpegService {
  verifyFFmpeg = async () => {
    let isPass = true
    try {
      await $`${FFMPEG_PATH} -version`
    } catch (e) {
      logger.error('ffmpeg failed', e)
      isPass = false
    }

    try {
      await $`${FFPROBE_PATH} -version`
    } catch (e) {
      logger.error('ffprobe failed', e)
      isPass = false
    }
    if (!isPass) {
      process.exit(1)
    } else {
      logger.info('Đã xác minh ffmpeg và ffprobe thành công')
    }
  }
  private getBitrate = async (filePath: string) => {
    const { stdout } =
      await $`${FFPROBE_PATH} -v error -select_streams v:0 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${slash(filePath)}`
    return Number(stdout.trim())
  }
  private checkVideoHasAudio = async (filePath: string) => {
    const { stdout } = await $`${FFPROBE_PATH} ${[
      '-v',
      'error',
      '-select_streams',
      'a:0',
      '-show_entries',
      'stream=codec_type',
      '-of',
      'default=nw=1:nk=1',
      slash(filePath),
    ]}`
    return stdout.trim() === 'audio'
  }

  private getResolution = async (filePath: string) => {
    const { stdout } = await $`${FFPROBE_PATH} ${[
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=width,height',
      '-of',
      'csv=s=x:p=0',
      slash(filePath),
    ]}`
    const resolution = stdout.trim().split('x')
    const [width, height] = resolution
    return {
      width: Number(width),
      height: Number(height),
    }
  }
  private getWidth = (height: number, resolution: { width: number; height: number }) => {
    const width = Math.round((height * resolution.width) / resolution.height)
    // Vì ffmpeg yêu cầu width và height phải là số chẵn
    return width % 2 === 0 ? width : width + 1
  }

  private encode = async ({
    bitrate,
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolutions,
    originalResolution,
  }: EncodeByResolution) => {
    const args = [
      '-y',
      '-i',
      slash(inputPath),
      '-preset',
      'veryslow',
      '-g',
      '48',
      '-crf',
      '17',
      '-sc_threshold',
      '0',
    ]

    const mapArgs: string[] = []
    const streamArgs: string[] = []
    const varStreamMapArgs: string[] = []

    resolutions.forEach((res, index) => {
      mapArgs.push('-map', '0:0')
      if (isHasAudio) {
        mapArgs.push('-map', '0:1')
      }

      const isOriginal = res === originalResolution.height
      const width = isOriginal ? originalResolution.width : this.getWidth(res, originalResolution)
      const height = res
      const b_v = isOriginal ? bitrate.original : bitrate[res as keyof typeof bitrate]

      streamArgs.push(
        `-s:v:${index}`,
        `${width}x${height}`,
        `-c:v:${index}`,
        'libx264',
        `-b:v:${index}`,
        `${b_v}`,
      )

      if (isHasAudio) {
        varStreamMapArgs.push(`v:${index},a:${index}`)
      } else {
        varStreamMapArgs.push(`v:${index}`)
      }
    })

    args.push(...mapArgs)
    args.push(...streamArgs)
    args.push('-c:a', 'copy', '-var_stream_map', varStreamMapArgs.join(' '))

    args.push(
      '-master_pl_name',
      'master.m3u8',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_list_size',
      '0',
      '-hls_segment_filename',
      slash(outputSegmentPath),
      slash(outputPath),
    )

    await $`${FFMPEG_PATH} ${args}`
    return true
  }

  /**
   *
   * @param inputPath là đường dẫn của video cần encode
   * @param outputFolder là thư mục chứa các file đã encode
   */
  encodeHLSWithMultipleVideoStreams = async (inputPath: string, outputFolder: string) => {
    const [bitrate, resolution] = await Promise.all([
      this.getBitrate(inputPath),
      this.getResolution(inputPath),
    ])
    const outputSegmentPath = path.join(outputFolder, 'v%v/fileSequence%d.ts')
    const outputPath = path.join(outputFolder, 'v%v/prog_index.m3u8')

    const bitrate360 = bitrate > MAXIMUM_BITRATE_360P ? MAXIMUM_BITRATE_360P : bitrate
    const bitrate480 = bitrate > MAXIMUM_BITRATE_480P ? MAXIMUM_BITRATE_480P : bitrate
    const bitrate720 = bitrate > MAXIMUM_BITRATE_720P ? MAXIMUM_BITRATE_720P : bitrate
    const bitrate1080 = bitrate > MAXIMUM_BITRATE_1080P ? MAXIMUM_BITRATE_1080P : bitrate
    const isHasAudio = await this.checkVideoHasAudio(inputPath)

    const resolutionsToEncode = ALL_RESOLUTIONS.filter((res) => resolution.height >= res)

    // Nếu độ phân giải gốc không nằm trong danh sách, hãy thêm nó vào
    if (!resolutionsToEncode.includes(resolution.height)) {
      resolutionsToEncode.push(resolution.height)
    }

    await this.encode({
      bitrate: {
        360: bitrate360,
        480: bitrate480,
        720: bitrate720,
        1080: bitrate1080,
        original: bitrate,
      },
      inputPath,
      isHasAudio,
      outputPath,
      outputSegmentPath,
      resolutions: resolutionsToEncode,
      originalResolution: resolution,
    })
    return true
  }

  convertToMp4 = async (inputPath: string, outputPath: string) => {
    await $`${FFMPEG_PATH} -i ${slash(inputPath)} -c:v libx264 -c:a aac ${slash(outputPath)}`
    return true
  }

  convertAudio = async (inputPath: string, outputPath: string) => {
    await $`${FFMPEG_PATH} -i ${slash(inputPath)} -vn -ar 44100 -ac 2 -b:a 128k ${slash(outputPath)}`
    return true
  }
}

export const ffmpegService = new FfmpegService()
