import { Request, Response } from 'express'
import { responseSuccess, ErrorHandler } from '../utils/response'
import { STATUS } from '../constants/status'
import { CategoryModel } from '../database/models/category.model'

// Thêm mới một danh mục (Category)
const addCategory = async (req: Request, res: Response) => {
  const name: string = req.body.name // Lấy tên danh mục từ body yêu cầu
  // Tạo mới danh mục và lưu vào cơ sở dữ liệu
  const categoryAdd = await new CategoryModel({ name }).save()

  // Trả về phản hồi thành công với thông tin danh mục vừa thêm
  const response = {
    message: 'Tạo Category thành công',
    data: categoryAdd.toObject({
      transform: (doc, ret, option) => {
        delete ret.__v // Xóa trường __v không cần thiết
        return ret
      },
    }),
  }
  return responseSuccess(res, response)
}

// Lấy danh sách các danh mục
const getCategories = async (req: Request, res: Response) => {
  const { exclude } = req.query // Lấy tham số exclude từ query
  // Nếu có exclude, sẽ loại trừ danh mục có _id bằng giá trị exclude
  let condition = exclude ? { _id: { $ne: exclude } } : {}
  // Lấy tất cả danh mục với điều kiện trên, loại bỏ trường __v
  const categories = await CategoryModel.find(condition)
    .select({ __v: 0 })
    .lean()

  // Trả về danh sách các danh mục
  const response = {
    message: 'Lấy categories thành công',
    data: categories,
  }
  return responseSuccess(res, response)
}

// Lấy thông tin chi tiết một danh mục theo ID
const getCategory = async (req: Request, res: Response) => {
  // Tìm danh mục theo ID từ URL params
  const categoryDB = await CategoryModel.findById(req.params.category_id)
    .select({ __v: 0 }) // Loại bỏ trường __v
    .lean()

  if (categoryDB) {
    // Nếu tìm thấy danh mục, trả về thông tin danh mục
    const response = {
      message: 'Lấy category thành công',
      data: categoryDB,
    }
    return responseSuccess(res, response)
  } else {
    // Nếu không tìm thấy danh mục, trả về lỗi
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy Category')
  }
}

// Cập nhật thông tin danh mục
const updateCategory = async (req: Request, res: Response) => {
  const { name } = req.body // Lấy tên danh mục mới từ body yêu cầu
  // Cập nhật danh mục theo ID từ URL params
  const categoryDB = await CategoryModel.findByIdAndUpdate(
    req.params.category_id,
    { name },
    { new: true } // Trả về đối tượng danh mục mới sau khi cập nhật
  )
    .select({ __v: 0 }) // Loại bỏ trường __v
    .lean()

  if (categoryDB) {
    // Nếu cập nhật thành công, trả về thông tin danh mục
    const response = {
      message: 'Cập nhật category thành công',
      data: categoryDB,
    }
    return responseSuccess(res, response)
  } else {
    // Nếu không tìm thấy danh mục, trả về lỗi
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy Category')
  }
}

// Xóa một danh mục
const deleteCategory = async (req: Request, res: Response) => {
  const category_id = req.params.category_id // Lấy ID của danh mục từ URL params
  // Tìm và xóa danh mục theo ID
  const categoryDB = await CategoryModel.findByIdAndDelete(category_id).lean()
  if (categoryDB) {
    // Nếu xóa thành công, trả về thông báo
    return responseSuccess(res, { message: 'Xóa thành công' })
  } else {
    // Nếu không tìm thấy danh mục, trả về lỗi
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy Category')
  }
}

// Tập hợp các controller cho danh mục
const categoryController = {
  addCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
}

export default categoryController // Xuất các controller liên quan đến danh mục
