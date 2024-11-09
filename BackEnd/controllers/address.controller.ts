// address.controller.ts
import { Request, Response } from 'express' // Nhập các loại yêu cầu và phản hồi từ express
import { STATUS } from '../constants/status' // Nhập mã trạng thái từ các hằng số trạng thái
import { PurchaseModel } from '../database/models/purchase.model' // Nhập mô hình dữ liệu mua hàng
import { ErrorHandler, responseSuccess } from '../utils/response' // Nhập các hàm xử lý lỗi và trả về phản hồi thành công

// Hàm thêm địa chỉ giao hàng mới vào đơn mua
const addShippingAddress = async (req: Request, res: Response) => {
  const purchaseId = req.params.id as string // Lấy ID đơn hàng từ tham số URL
  const { street, city, postalCode, phone, paymentMethod } = req.body // Lấy các thông tin địa chỉ từ body yêu cầu

  try {
    // Tìm kiếm đơn mua theo ID
    const purchase: any = await PurchaseModel.findById(purchaseId)
    if (!purchase) { // Nếu không tìm thấy đơn mua, trả về lỗi
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Purchase not found')
    }

    // Tạo một đối tượng địa chỉ mới với các thông tin đã nhận
    const newAddress = {
      street,
      city,
      postalCode,
      phone,
      paymentMethod,
    }

    // Thêm địa chỉ vào mảng địa chỉ giao hàng của đơn mua
    purchase.shippingAddress.push(newAddress)

    // Lưu lại thay đổi vào cơ sở dữ liệu
    await purchase.save()

    // Trả về phản hồi thành công với thông tin địa chỉ mới và đơn hàng
    return responseSuccess(res, {
      message: 'Đã thêm địa chỉ giao hàng mới thành công',
      data: purchase,
    })
  } catch (error) { // Nếu có lỗi xảy ra trong quá trình thực hiện
    console.error('Error adding shipping addresses:', error) // In lỗi ra console
    return res.status(500).json({ message: 'Internal server error' }) // Trả về lỗi server nội bộ
  }
}

// Định nghĩa controller với phương thức addShippingAddress
const addressController = { addShippingAddress }

// Xuất controller để sử dụng ở các nơi khác trong ứng dụng
export default addressController
