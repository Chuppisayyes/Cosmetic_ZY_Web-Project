import { Request, Response } from 'express'
import { responseSuccess, ErrorHandler } from '../utils/response'
import { STATUS } from '../constants/status'
import { BrandModel } from '../database/models/brand.model'
import { HOST } from '../utils/helper'
import { ROUTE_IMAGE } from '../constants/config'

// Thêm mới một thương hiệu (Brand)
const addBrand = async (req: Request, res: Response) => {
  const { name, image, description } = req.body // Lấy thông tin tên, hình ảnh và mô tả từ body yêu cầu
  // Tạo mới thương hiệu và lưu vào cơ sở dữ liệu
  const brandAdd = await new BrandModel({ name, image, description }).save()
  
  // Trả về phản hồi thành công với thông tin thương hiệu vừa thêm
  const response = {
    message: 'Tạo Brand thành công',
    data: brandAdd.toObject({
      transform: (doc, ret, option) => {
        delete ret.__v // Xóa trường __v không cần thiết
        return ret
      },
    }),
  }
  return responseSuccess(res, response)
}

// Lấy danh sách các thương hiệu
const getBrands = async (req: Request, res: Response) => {
  const { exclude } = req.query // Lấy tham số exclude từ query
  // Nếu có exclude, sẽ loại trừ thương hiệu có _id bằng giá trị exclude
  let condition = exclude ? { _id: { $ne: exclude } } : {}
  // Lấy tất cả thương hiệu với điều kiện trên, loại bỏ trường __v
  const brands = await BrandModel.find(condition).select({ __v: 0 }).lean()

  // Trả về danh sách các thương hiệu
  const response = {
    message: 'Lấy categories thành công',
    data: brands,
  }
  return responseSuccess(res, response)
}

// Lấy thông tin chi tiết một thương hiệu theo ID
const getBrand = async (req: Request, res: Response) => {
  // Tìm thương hiệu theo ID từ URL params
  const brandDB = await BrandModel.findById(req.params.brand_id)
    .select({ __v: 0 }) // Loại bỏ trường __v
    .lean()

  if (brandDB) {
    // Nếu tìm thấy thương hiệu, trả về thông tin thương hiệu
    const response = {
      message: 'Lấy brand thành công',
      data: brandDB,
    }
    return responseSuccess(res, response)
  } else {
    // Nếu không tìm thấy thương hiệu, trả về lỗi
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy Brand')
  }
}

// Cập nhật thông tin thương hiệu
const updateBrand = async (req: Request, res: Response) => {
  const { name, image, description } = req.body // Lấy thông tin từ body yêu cầu
  console.log(req.body) // In ra thông tin body để kiểm tra
  // Cập nhật thương hiệu theo ID từ URL params
  const brandDB = await BrandModel.findByIdAndUpdate(
    req.params.brand_id,
    { name, image, description },
    { new: true } // Trả về đối tượng thương hiệu mới sau khi cập nhật
  )
    .select({ __v: 0 }) // Loại bỏ trường __v
    .lean()

  if (brandDB) {
    // Nếu cập nhật thành công, trả về thông tin thương hiệu
    const response = {
      message: 'Cập nhật brand thành công',
      data: brandDB,
    }
    return responseSuccess(res, response)
  } else {
    // Nếu không tìm thấy thương hiệu, trả về lỗi
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy brand ')
  }
}

// Xóa một thương hiệu
const deleteBrand = async (req: Request, res: Response) => {
  const brand_id = req.params.category_id // Lấy ID của thương hiệu từ URL params
  // Tìm và xóa thương hiệu theo ID
  const brandDB = await BrandModel.findByIdAndDelete(brand_id).lean()
  if (brandDB) {
    // Nếu xóa thành công, trả về thông báo
    return responseSuccess(res, { message: 'Xóa thành công' })
  } else {
    // Nếu không tìm thấy thương hiệu, trả về lỗi
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy brand ')
  }
}

// Tập hợp các controller cho thương hiệu
const brandController = {
  addBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
}

export default brandController // Xuất các controller liên quan đến thương hiệu
