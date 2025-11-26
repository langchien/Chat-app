import { NotFoundException, UnprocessableEntityException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { BaseController, isUniqueConstraintError } from '@/lib/database'
import { hashingService } from '@/lib/hashing.service'
import { RequestHandler } from 'express'
import { userRepo } from './user.repo'
import {
  ICreateUserReqBodyDto,
  IUpdateUserReqBodyDto,
  IUserIdReqParamsDto,
  IUserSearchReqQueryDto,
} from './user.req.dto'
import { IUserResDto, UserResDto } from './user.res.dto'

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
    const user = await userRepo.findOneById(userId)
    if (!user) throw new NotFoundException()
    res.json(UserResDto.parse(user))
  }

  search: RequestHandler<any, IUserResDto[], any, IUserSearchReqQueryDto> = async (req, res) => {
    const { q } = req.query
    let results: IUserResDto[] = []
    if (q) results = await userRepo.searchByText(q)
    else results = await userRepo.findAll()
    res.json(results.map((user) => UserResDto.parse(user)))
  }

  delete: RequestHandler = async (req, res) => {
    const { userId } = req.params
    await userRepo.delete(userId).catch(this.handleNotFoundError)
    res.status(HttpStatusCode.NoContent).send()
  }

  create: RequestHandler<any, IUserResDto, ICreateUserReqBodyDto> = async (req, res) => {
    try {
      const { password, ...rest } = req.body
      const hashedPassword = await hashingService.hash(password)
      const newUser = await userRepo.create({
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
      const updatedUser = await userRepo.update(userId, req.body)
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
