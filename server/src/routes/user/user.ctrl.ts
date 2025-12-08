import { NotFoundException, UnprocessableEntityException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { BaseController, isUniqueConstraintError } from '@/lib/database'
import { hashingService } from '@/lib/hashing.service'
import { RequestHandler } from 'express'
import {
  ICreateUserReqBodyDto,
  IUpdateUserReqBodyDto,
  IUserIdReqParamsDto,
  IUserSearchReqQueryDto,
} from './user.req.dto'
import { IUserResDto, UserResDto } from './user.res.dto'
import { userService } from './user.service'

class UserController extends BaseController {
  private handleUniqueConstraintError(error: any) {
    if (isUniqueConstraintError(error)) {
      if ((error.meta as any).target == 'User_email_key')
        throw new UnprocessableEntityException([
          {
            message: 'Email đã được sử dụng',
            path: ['email'],
          },
        ])
      if ((error.meta as any).target == 'User_username_key')
        throw new UnprocessableEntityException([
          {
            message: 'Username đã được sử dụng',
            path: ['username'],
          },
        ])
    }
    throw error
  }
  findOne: RequestHandler<IUserIdReqParamsDto, IUserResDto> = async (req, res) => {
    const { userId } = req.params
    const user = await userService.findOneById(userId)
    if (!user) throw new NotFoundException()
    res.json(UserResDto.parse(user))
  }

  search: RequestHandler<any, IUserResDto[], any, IUserSearchReqQueryDto> = async (req, res) => {
    const { q } = req.query
    const LIMIT = 20
    let results: IUserResDto[] = []
    if (q) results = await userService.searchByText(q, LIMIT)
    else results = await userService.findAll()
    res.json(results.map((user) => UserResDto.parse(user)))
  }

  delete: RequestHandler = async (req, res) => {
    const { userId } = req.params
    await userService.delete(userId).catch(this.handleNotFoundError)
    res.status(HttpStatusCode.NoContent).send()
  }

  create: RequestHandler<any, IUserResDto, ICreateUserReqBodyDto> = async (req, res) => {
    try {
      const { password, ...rest } = req.body
      const hashedPassword = await hashingService.hash(password)
      const newUser = await userService.create({
        hashedPassword,
        ...rest,
      })
      res.status(HttpStatusCode.Created).json(UserResDto.parse(newUser))
    } catch (error) {
      this.handleUniqueConstraintError(error)
    }
  }

  update: RequestHandler<IUserIdReqParamsDto, IUserResDto, IUpdateUserReqBodyDto> = async (
    req,
    res,
  ) => {
    try {
      const { userId } = req.params
      const updatedUser = await userService.update(userId, req.body)
      if (!updatedUser) throw new NotFoundException()
      res.json(UserResDto.parse(updatedUser))
    } catch (error) {
      try {
        this.handleNotFoundError(error)
      } catch (error) {
        this.handleUniqueConstraintError(error)
      }
    }
  }
}

export const userController = new UserController()
