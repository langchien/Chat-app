import { NotFoundException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { BaseController } from '@/lib/database'
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
    await userService.delete(userId)
    res.status(HttpStatusCode.NoContent).send()
  }

  create: RequestHandler<any, IUserResDto, ICreateUserReqBodyDto> = async (req, res) => {
    const { password, ...rest } = req.body
    const hashedPassword = await hashingService.hash(password)
    const newUser = await userService.create({
      hashedPassword,
      ...rest,
    })
    res.status(HttpStatusCode.Created).json(UserResDto.parse(newUser))
  }

  update: RequestHandler<IUserIdReqParamsDto, IUserResDto, IUpdateUserReqBodyDto> = async (
    req,
    res,
  ) => {
    const { userId } = req.params
    const updatedUser = await userService.update(userId, req.body)
    res.json(UserResDto.parse(updatedUser))
  }
}

export const userController = new UserController()
