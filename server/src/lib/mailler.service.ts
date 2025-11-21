import { envConfig } from '@/config/env-config'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { logger } from './logger.service'

/**
 * @documentation https://nodemailer.com/
 */
class MaillerService {
  private static instance: MaillerService
  private transporter: nodemailer.Transporter

  private constructor() {
    const { mailPass, mailUser, mailService, awsAccessKeyId, awsRegion, awsSecretAccessKey } =
      envConfig.mail

    if (mailService === 'gmail')
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: mailUser,
          pass: mailPass,
        },
      })
    else {
      const sesClient = new SESv2Client({
        region: awsRegion,
        credentials: {
          secretAccessKey: awsSecretAccessKey,
          accessKeyId: awsAccessKeyId,
        },
      })
      this.transporter = nodemailer.createTransport({
        SES: { sesClient, SendEmailCommand },
      })
    }
  }

  /**
   * @description Lấy instance duy nhất của Mailler
   */
  public static getInstance(): MaillerService {
    if (!MaillerService.instance) {
      MaillerService.instance = new MaillerService()
    }
    return MaillerService.instance
  }

  /**
   * @description Gửi email
   * @param options - Các tùy chọn để gửi email
   * @param text Phiên bản dự phòng, đảm bảo email luôn đọc được
   * @param html Phiên bản HTML, cung cấp trải nghiệm phong phú hơn
   * @returns Promise với thông tin email đã gửi
   */
  public async sendMail(options: {
    to: string | Mail.Address | (string | Mail.Address)[]
    subject: string
    text?: string
    html: string
    from?: string | Mail.Address
  }) {
    const info = await this.transporter.sendMail({
      from: options.from ?? envConfig.mail.mailFromAddress,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    })
    return info
  }

  /**
   * @description Xác minh kết nối SMTP
   * @returns Promise<boolean> - true nếu kết nối thành công
   */
  public async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      logger.success('Đã xác minh kết nối đến SMTP mailer thành công')
      return true
    } catch (error) {
      logger.warn('Đã xảy ra lỗi khi xác nhận kết nối đến SMTP mailer', error)
      return false
    }
  }
}

export const maillerService = MaillerService.getInstance()
