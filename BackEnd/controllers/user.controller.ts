import { hashValue } from '../utils/crypt'
import { Request, Response, NextFunction } from 'express'
import { responseSuccess, ErrorHandler } from '../utils/response'
import { UserModel } from '../database/models/user.model'
import { STATUS } from '../constants/status'
import { omitBy } from 'lodash'
import { uploadFile } from '../utils/upload'
import { FOLDERS, ROUTE_IMAGE } from '../constants/config'
import { ParamsDictionary } from 'express-serve-static-core'
import forgottenPassword from '../services/userServices'
import { ROLE } from '../constants/role.enum'

// const generateRandomCode = (length: number) => {
//   const characters =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
//   let result = ''
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length))
//   }
//   return result
// }

const addUser = async (req: Request, res: Response) => {
  const form: User = req.body
  const {
    email,
    password,
    addresseses,
    date_of_birth,
    name,
    phone,
    roles,
    avatar,
  } = form
  const userInDB = await UserModel.findOne({ email: email }).exec()
  if (!userInDB) {
    const hashedPassword = hashValue(password)
    const user = {
      email,
      password: hashedPassword,
      roles,
      addresseses,
      date_of_birth,
      name,
      phone,
      avatar,
    }
    Object.keys(user).forEach(
      (key) =>
        user[key as keyof typeof user] === undefined &&
        delete user[key as keyof typeof user]
    )
    const userAdd = await new UserModel(user).save()
    const response = {
      message: 'Tạo người dùng thành công',
      data: userAdd.toObject({
        transform: (doc, ret, option) => {
          delete ret.password
          delete ret.__v
          return ret
        },
      }),
    }
    return responseSuccess(res, response)
  }
  throw new ErrorHandler(422, { email: 'Email đã tồn tại' })
}

const getUsers = async (req: Request, res: Response) => {
  const usersDB = await UserModel.find({ roles: ROLE.USER })
    .select({ password: 0, __v: 0 })
    .lean()
  const response = {
    message: 'Lấy người dùng thành công',
    data: usersDB,
  }

  return responseSuccess(res, response)
}

const getDetailMySelf = async (req: Request, res: Response) => {
  const userDB = await UserModel.findById(req.jwtDecoded.id)
    .select({ password: 0, __v: 0 })
    .lean()
  if (userDB) {
    const response = {
      message: 'Lấy người dùng thành công',
      data: userDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Không tìm thấy người dùng')
  }
}

const getUser = async (req: Request, res: Response) => {
  const userDB = await UserModel.findById(req.params.user_id)
    .select({ password: 0, __v: 0 })
    .lean()
  if (userDB) {
    const response = {
      message: 'Lấy người dùng thành công',
      data: userDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng')
  }
}
const getAdmin = async (req: Request, res: Response) => {
  const userDB = await UserModel.findById(req.params.user_id)
    .select({ password: 0, __v: 0 })
    .lean()
  if (userDB) {
    const response = {
      message: 'Lấy người dùng thành công',
      data: userDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng')
  }
}

const updateUser = async (req: Request, res: Response) => {
  const form: User = req.body
  const { password, address, date_of_birth, name, phone, roles, avatar } = form
  const user = omitBy(
    {
      password,
      address,
      date_of_birth,
      name,
      phone,
      roles,
      avatar,
    },
    (value) => value === undefined || value === ''
  )
  const userDB = await UserModel.findByIdAndUpdate(req.params.user_id, user, {
    new: true,
  })
    .select({ password: 0, __v: 0 })
    .lean()
  if (userDB) {
    const response = {
      message: 'Cập nhật người dùng thành công',
      data: userDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng')
  }
}

const uploadAvatar = async (req: Request, res: Response) => {
  const path = await uploadFile(req, FOLDERS.AVATAR)
  const response = {
    message: 'Upload ảnh đại diện thành công',
    data: path,
  }
  return responseSuccess(res, response)
}

const updateMe = async (req: Request, res: Response) => {
  const form: User = req.body
  const {
    email,
    password,
    new_password,
    address,
    date_of_birth,
    name,
    phone,
    avatar,
  } = form
  const user = omitBy(
    {
      email,
      password,
      address,
      date_of_birth,
      name,
      phone,
      avatar,
    },
    (value) => value === undefined || value === ''
  )
  const userDB: any = await UserModel.findById(req.jwtDecoded.id).lean()
  if (user.password) {
    const hash_password = hashValue(password)
    if (hash_password === userDB.password) {
      Object.assign(user, { password: hashValue(new_password) })
    } else {
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
        password: 'Password không đúng',
      })
    }
  }
  const updatedUserDB = await UserModel.findByIdAndUpdate(
    req.jwtDecoded.id,
    user,
    { new: true }
  )
    .select({ password: 0, __v: 0 })
    .lean()
  const response = {
    message: 'Cập nhật thông tin thành công',
    data: updatedUserDB,
  }
  return responseSuccess(res, response)
}

const deleteUser = async (req: Request, res: Response) => {
  const user_id = req.params.user_id
  const userDB = await UserModel.findByIdAndDelete(user_id).lean()
  if (userDB) {
    return responseSuccess(res, { message: 'Xóa thành công' })
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng')
  }
}

interface ForgottenPasswordResponse {
  status: number
  message: string
}

const handleForgottenPassword = async (req: Request, res: Response) => {
  const email = req.body.email?.trim() // Optional chaining and trimming

  if (!email) {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy email')
  }

  try {
    const data: ForgottenPasswordResponse = await forgottenPassword(email)

    if (!data) {
      throw new ErrorHandler(
        STATUS.INTERNAL_SERVER_ERROR,
        'An error occurred while processing the request.'
      )
    }

    return res.status(data.status || STATUS.INTERNAL_SERVER_ERROR).json(data)
  } catch (error) {
    console.error('Error handling forgotten password request:', error)

    throw new ErrorHandler(
      STATUS.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred.'
    )
  }
}

const userController = {
  addUser,
  getAdmin,
  getUsers,
  getDetailMySelf,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  uploadAvatar,
  handleForgottenPassword,
}

export default userController
