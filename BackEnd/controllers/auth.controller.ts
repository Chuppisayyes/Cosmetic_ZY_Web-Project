import { ErrorHandler, responseSuccess } from '../utils/response' // Nhập các hàm xử lý lỗi và phản hồi thành công
import { hashValue, compareValue } from '../utils/crypt' // Nhập các hàm mã hóa và so sánh mật khẩu
import { config } from '../constants/config' // Nhập các cấu hình từ constants
import { signToken } from '../utils/jwt' // Nhập hàm ký token
import { Request, Response } from 'express' // Nhập các loại yêu cầu và phản hồi từ express
import { ROLE } from '../constants/role.enum' // Nhập các vai trò người dùng
import { UserModel } from '../database/models/user.model' // Nhập mô hình người dùng
import { AccessTokenModel } from '../database/models/access-token.model' // Nhập mô hình token truy cập
import { RefreshTokenModel } from '../database/models/refresh-token.model' // Nhập mô hình token làm mới
import { omit } from 'lodash' // Nhập hàm omit để loại bỏ các thuộc tính khỏi đối tượng
import { STATUS } from '../constants/status' // Nhập mã trạng thái từ các hằng số trạng thái

// Hàm lấy thời gian hết hạn của token từ header yêu cầu
const getExpire = (req: Request) => {
  // Lấy giá trị hết hạn của access token từ header yêu cầu
  let expireAccessTokenConfig = Number(req.headers['expire-access-token'])
  expireAccessTokenConfig = Number.isInteger(expireAccessTokenConfig)
    ? expireAccessTokenConfig
    : config.EXPIRE_ACCESS_TOKEN // Nếu không có, sử dụng giá trị mặc định

  // Lấy giá trị hết hạn của refresh token từ header yêu cầu
  let expireRefreshTokenConfig = Number(req.headers['expire-refresh-token'])
  expireRefreshTokenConfig = Number.isInteger(expireRefreshTokenConfig)
    ? expireRefreshTokenConfig
    : config.EXPIRE_REFRESH_TOKEN // Nếu không có, sử dụng giá trị mặc định

  return {
    expireAccessTokenConfig,
    expireRefreshTokenConfig,
  }
}

// Hàm đăng ký người dùng mới
const registerController = async (req: Request, res: Response) => {
  const { expireAccessTokenConfig, expireRefreshTokenConfig } = getExpire(req) // Lấy thời gian hết hạn của token từ header
  const body: Register = req.body // Lấy thông tin đăng ký từ body yêu cầu
  const { email, password } = body // Lấy email và mật khẩu từ body yêu cầu

  // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
  const userInDB = await UserModel.findOne({ email: email, type: 0 }).exec()
  if (!userInDB) { // Nếu người dùng chưa tồn tại
    // Mã hóa mật khẩu
    const hashedPassword = hashValue(password)
    const user = {
      email,
      password: hashedPassword,
    }
    // Lưu người dùng mới vào cơ sở dữ liệu
    const userAdd = await (await new UserModel(user).save()).toObject()

    // Tạo payload cho JWT
    const payloadJWT: PayloadToken = {
      email,
      id: userAdd._id,
      roles: [ROLE.USER],
      created_at: new Date().toISOString(),
    }

    // Ký và tạo access token
    const access_token = await signToken(
      payloadJWT,
      config.SECRET_KEY,
      expireAccessTokenConfig
    )

    // Ký và tạo refresh token
    const refresh_token = await signToken(
      payloadJWT,
      config.SECRET_KEY,
      expireRefreshTokenConfig
    )

    // Lưu access token và refresh token vào cơ sở dữ liệu
    await new AccessTokenModel({
      user_id: userAdd._id,
      token: access_token,
    }).save()
    await new RefreshTokenModel({
      user_id: userAdd._id,
      token: refresh_token,
    }).save()

    // Trả về phản hồi thành công với thông tin người dùng và token
    const response = {
      message: 'Đăng ký thành công',
      data: {
        access_token: 'Bearer ' + access_token, // Trả về token truy cập
        expires: config.EXPIRE_ACCESS_TOKEN, // Thời gian hết hạn của access token
        refresh_token, // Trả về refresh token
        expires_refresh_token: expireRefreshTokenConfig, // Thời gian hết hạn của refresh token
        user: omit(userAdd, ['password']), // Trả về thông tin người dùng, bỏ mật khẩu
      },
    }
    return responseSuccess(res, response)
  }

  // Nếu email đã tồn tại, trả về lỗi
  throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
    email: 'Email đã tồn tại',
  })
}

// Hàm đăng nhập người dùng
const loginController = async (req: Request, res: Response) => {
  const { expireAccessTokenConfig, expireRefreshTokenConfig } = getExpire(req) // Lấy thời gian hết hạn của token từ header
  const body: Login = req.body // Lấy thông tin đăng nhập từ body yêu cầu
  const { email, password } = body // Lấy email và mật khẩu từ body yêu cầu

  // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
  const userInDB: any = await UserModel.findOne({ email: email }).lean()
  if (!userInDB) { // Nếu không tìm thấy người dùng
    throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
      password: 'Email hoặc password không đúng', // Trả về lỗi nếu email không đúng
    })
  } else {
    // Kiểm tra mật khẩu có khớp không
    const match = compareValue(password, userInDB.password)
    if (!match) { // Nếu mật khẩu không khớp
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
        password: 'Email hoặc password không đúng', // Trả về lỗi nếu mật khẩu không đúng
      })
    }

    // Tạo payload cho JWT
    let payloadJWT: PayloadToken = {
      id: userInDB._id,
      email: userInDB.email,
      roles: userInDB.roles,
      created_at: new Date().toISOString(),
    }

    // Ký và tạo access token
    const access_token = await signToken(
      payloadJWT,
      config.SECRET_KEY,
      expireAccessTokenConfig
    )

    // Ký và tạo refresh token
    const refresh_token = await signToken(
      payloadJWT,
      config.SECRET_KEY,
      expireRefreshTokenConfig
    )

    // Lưu access token và refresh token vào cơ sở dữ liệu
    await new AccessTokenModel({
      user_id: userInDB._id,
      token: access_token,
    }).save()
    await new RefreshTokenModel({
      user_id: userInDB._id,
      token: refresh_token,
    }).save()

    // Trả về phản hồi thành công với thông tin người dùng và token
    const response = {
      message: 'Đăng nhập thành công',
      data: {
        access_token: 'Bearer ' + access_token, // Trả về token truy cập
        expires: expireAccessTokenConfig, // Thời gian hết hạn của access token
        refresh_token, // Trả về refresh token
        expires_refresh_token: expireRefreshTokenConfig, // Thời gian hết hạn của refresh token
        user: omit(userInDB, ['password']), // Trả về thông tin người dùng, bỏ mật khẩu
      },
    }
    return responseSuccess(res, response)
  }
}
const loginGoogleController = async (req: Request, res: Response) => {
  const { expireAccessTokenConfig, expireRefreshTokenConfig } = getExpire(req) // Lấy thời gian hết hạn của token từ header yêu cầu
  const body: any = req.body // Lấy dữ liệu từ body yêu cầu

  const { email, name } = body // Lấy email và tên người dùng từ body yêu cầu
  try {
    // Kiểm tra xem người dùng đã đăng ký với email này chưa (type = 1 cho người dùng đăng nhập bằng Google)
    const existUser: any = await UserModel.findOne({
      email: email,
      type: 1,
    }).lean()

    if (!existUser) {
      // Nếu người dùng chưa tồn tại, tạo mới người dùng với thông tin email và tên
      await UserModel.create({
        email: email,
        name: name,
        type: 1,
      })
    }

    // Lấy lại thông tin người dùng từ cơ sở dữ liệu sau khi đã đăng ký
    const userInDB: any = await UserModel.findOne({
      email: email,
      type: 1,
    }).lean()

    // Tạo payload cho JWT
    let payloadJWT: PayloadToken = {
      id: userInDB._id,
      email: userInDB.email,
      roles: userInDB.roles,
      created_at: new Date().toISOString(),
    }

    // Ký và tạo access token
    const access_token = await signToken(
      payloadJWT,
      config.SECRET_KEY,
      expireAccessTokenConfig
    )

    // Ký và tạo refresh token
    const refresh_token = await signToken(
      payloadJWT,
      config.SECRET_KEY,
      expireRefreshTokenConfig
    )

    // Lưu access token và refresh token vào cơ sở dữ liệu
    await new AccessTokenModel({
      user_id: userInDB._id,
      token: access_token,
    }).save()
    await new RefreshTokenModel({
      user_id: userInDB._id,
      token: refresh_token,
    }).save()

    // Trả về phản hồi thành công với thông tin người dùng và token
    const response = {
      message: 'Đăng nhập thành công',
      data: {
        access_token: 'Bearer ' + access_token, // Trả về access token
        expires: expireAccessTokenConfig, // Thời gian hết hạn của access token
        refresh_token, // Trả về refresh token
        expires_refresh_token: expireRefreshTokenConfig, // Thời gian hết hạn của refresh token
        user: omit(userInDB, ['password']), // Trả về thông tin người dùng, bỏ mật khẩu
      },
    }
    return responseSuccess(res, response)
  } catch (error) {
    throw error // Ném lỗi nếu có vấn đề trong quá trình xử lý
  }
}

const refreshTokenController = async (req: Request, res: Response) => {
  const { expireAccessTokenConfig } = getExpire(req) // Lấy thời gian hết hạn của access token từ header yêu cầu
  const userDB: any = await UserModel.findById(req.jwtDecoded.id).lean() // Tìm người dùng từ cơ sở dữ liệu bằng id trong JWT

  if (userDB) {
    // Nếu tìm thấy người dùng, tạo payload cho JWT mới
    const payload: PayloadToken = {
      id: userDB._id,
      email: userDB.email,
      roles: userDB.roles,
      created_at: new Date().toISOString(),
    }

    // Ký và tạo access token mới
    const access_token = await signToken(
      payload,
      config.SECRET_KEY,
      expireAccessTokenConfig
    )

    // Lưu access token mới vào cơ sở dữ liệu
    await new AccessTokenModel({
      user_id: req.jwtDecoded.id,
      token: access_token,
    }).save()

    // Trả về phản hồi thành công với access token mới
    const response = {
      message: 'Refresh Token thành công',
      data: { access_token: 'Bearer ' + access_token },
    }
    return responseSuccess(res, response)
  }
  throw new ErrorHandler(401, 'Refresh Token không tồn tại') // Nếu không tìm thấy người dùng, ném lỗi
}

const logoutController = async (req: Request, res: Response) => {
  // Lấy access token từ header authorization
  const access_token = req.headers.authorization?.replace('Bearer ', '')
  
  // Xóa token khỏi cơ sở dữ liệu
  await AccessTokenModel.findOneAndDelete({
    token: access_token,
  }).exec()

  // Trả về phản hồi thành công khi đăng xuất
  return responseSuccess(res, { message: 'Đăng xuất thành công' })
}

// Tập hợp các controller liên quan đến xác thực
const authController = {
  registerController,
  loginController,
  logoutController,
  loginGoogleController,
  refreshTokenController,
}

export default authController // Xuất các controller xác thực
