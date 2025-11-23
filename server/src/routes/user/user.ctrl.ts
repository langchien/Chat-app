import { NotFoundException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
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

class UserController {
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
    const deleted = await userRepo.delete(userId)
    if (!deleted) throw new NotFoundException()
    res.status(HttpStatusCode.NoContent).send()
  }

  create: RequestHandler<any, IUserResDto, ICreateUserReqBodyDto> = async (req, res) => {
    const { password, ...rest } = req.body
    const hashedPassword = await hashingService.hash(password)
    const newUser = await userRepo.create({
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
    const updatedUser = await userRepo.update(userId, req.body)
    if (!updatedUser) throw new NotFoundException()
    res.json(UserResDto.parse(updatedUser))
  }
}

export const userController = new UserController()
