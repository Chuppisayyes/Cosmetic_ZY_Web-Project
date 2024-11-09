import { config } from '../constants/config'
import { verifyToken } from '../utils/jwt'
import { NextFunction, Request, Response } from 'express'
import { ROLE } from '../constants/role.enum'
import { responseError, ErrorHandler } from '../utils/response'
import { STATUS } from '../constants/status'
import { AccessTokenModel } from '../database/models/access-token.model'
import { RefreshTokenModel } from '../database/models/refresh-token.model'
import { body } from 'express-validator'
import { UserModel } from '../database/models/user.model'
import jwt from 'jsonwebtoken'

const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const access_token = req.headers.authorization?.replace('Bearer ', '')
  if (access_token) {
    try {
      const decoded = (await verifyToken(
        access_token,
        config.SECRET_KEY
      )) as PayloadToken
      req.jwtDecoded = decoded
      const accessTokenDB = await AccessTokenModel.findOne({
        token: access_token,
      }).exec()

      if (accessTokenDB) {
        return next()
      }
      return responseError(
        res,
        new ErrorHandler(STATUS.UNAUTHORIZED, 'Không tồn tại token')
      )
    } catch (error) {
      return responseError(res, error)
    }
  }
  return responseError(
    res,
    new ErrorHandler(STATUS.UNAUTHORIZED, 'Bạn vui lòng đăng nhập !')
  )
}

const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refresh_token = req.body.refresh_token
  if (refresh_token) {
    try {
      const decoded = (await verifyToken(
        refresh_token,
        config.SECRET_KEY
      )) as PayloadToken
      req.jwtDecoded = decoded
      const refreshTokenDB = await RefreshTokenModel.findOne({
        token: refresh_token,
      }).exec()

      if (refreshTokenDB) {
        return next()
      }
      return responseError(
        res,
        new ErrorHandler(STATUS.UNAUTHORIZED, 'Không tồn tại token')
      )
    } catch (error) {
      return responseError(res, error)
    }
  }
  return responseError(
    res,
    new ErrorHandler(STATUS.UNAUTHORIZED, 'Bạn vui lòng đăng nhập !')
  )
}

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userDB: User = await UserModel.findById(req.jwtDecoded.id).lean()
  if (userDB.roles.includes(ROLE.ADMIN)) {
    return next()
  }
  return responseError(
    res,
    new ErrorHandler(STATUS.FORBIDDEN, 'Không có quyền truy cập')
  )
}

const registerRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Email không đúng định dạng')
      .isLength({ min: 5, max: 160 })
      .withMessage('Email phải từ 5-160 kí tự'),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('Mật khẩu không được để trống')
      .isLength({ min: 6, max: 160 })
      .withMessage('Mật khẩu phải từ 6-160 kí tự'),
  ]
}

const loginRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Email không đúng định dạng')
      .isLength({ min: 5, max: 160 })
      .withMessage('Email phải từ 5-160 kí tự'),
    body('password')
      .isLength({ min: 6, max: 160 })
      .withMessage('Mật khẩu phải từ 6-160 kí tự'),
  ]
}
const getTokenFrom = (request: Request): string | null => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const middleWare = (req: Request, res: Response, next: NextFunction): void => {
  const token = getTokenFrom(req)

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    function (err, User) {
      if (err) {
        return res.status(404).json({
          message: 'The user is not authenticated',
        })
      }
      ;(req as any).User = User // Type casting because User might not be defined in Request interface
      next()
    }
  )
}

const tokenToUser = (req: Request, res: Response, next: NextFunction): void => {
  const token = getTokenFrom(req)
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      function (err, User) {
        if (!err) {
          ;(req as any).User = User // Type casting because User might not be defined in Request interface
        }
      }
    )
  }
  next()
}

const authMiddleware = {
  verifyAccessToken,
  verifyAdmin,
  registerRules,
  loginRules,
  verifyRefreshToken,
  middleWare,
}

export default authMiddleware
