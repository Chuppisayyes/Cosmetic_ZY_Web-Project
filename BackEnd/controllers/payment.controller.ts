import { Request, Response } from 'express'
import { PaymentModel } from '../database/models/payment.model'
import { ErrorHandler, responseSuccess } from '../utils/response'
import { STATUS } from '../constants/status'
import { STATUS_ORDER } from '../constants/purchase'
import { Payment } from '../@types/order.type'

import { cloneDeep } from 'lodash'
import moment from 'moment'

// **User** - Lấy danh sách các khoản thanh toán của người dùng
const getPayments = async (req: Request, res: Response) => {
  const user_id = req.jwtDecoded.id // Lấy ID người dùng từ token đã giải mã

  try {
    // Tìm các khoản thanh toán của người dùng theo user_id và sắp xếp theo thời gian giảm dần
    let payments: any = await PaymentModel.find({ user: user_id })
      .sort({
        createdAt: -1, // Sắp xếp theo ngày tạo (mới nhất ở trên)
      })
      .lean()

    // Lọc ra các đơn thanh toán có danh sách mua hàng
    payments = payments.filter((payment) => payment.purchases.length > 0)

    // Phản hồi thành công với danh sách các khoản thanh toán
    const response = {
      message: 'Lấy đơn mua thành công',
      data: payments,
    }
    return responseSuccess(res, response)
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về lỗi với thông báo chi tiết
    return res
      .status(500)
      .json({ message: 'Đã xảy ra lỗi khi lấy đơn mua', error: error.message })
  }
}

// **Admin** - Lấy tất cả các đơn hàng
const getAllOrders = async (req: Request, res: Response) => {
  try {
    // Lấy tất cả các khoản thanh toán và thông tin liên quan đến các đơn hàng (product, purchase)
    let payments: any = await PaymentModel.find()
      .populate({
        path: 'purchase', // Populating thông tin của purchase
        populate: {
          path: 'product', // Populating thông tin của product trong purchase
        },
      })
      .sort({
        createdAt: -1, // Sắp xếp theo ngày tạo (mới nhất ở trên)
      })
      .lean()

    // Lọc ra các đơn thanh toán có danh sách mua hàng
    payments = payments.filter((payment) => payment.purchases.length > 0)

    // Phản hồi thành công với danh sách các đơn hàng
    const response = {
      message: 'Lấy đơn mua thành công',
      data: payments,
    }
    return responseSuccess(res, response)
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về lỗi với thông báo chi tiết
    return res
      .status(500)
      .json({ message: 'Đã xảy ra lỗi khi lấy đơn mua', error: error.message })
  }
}

// **Admin** - Cập nhật trạng thái của đơn hàng sang "Đang chờ lấy hàng"
const updateOrderConfirm = async (req: Request, res: Response) => {
  try {
    // Tìm và cập nhật đơn hàng theo ID từ URL params
    const orderDB = await PaymentModel.findByIdAndUpdate(
      req.params.order_id,
      {
        status: STATUS_ORDER.WAIT_FOR_GETTING, // Cập nhật trạng thái đơn hàng
      },
      { new: true } // Trả về đơn hàng đã được cập nhật
    )

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!orderDB) {
      return res.status(404).json({
        message: 'Không tìm thấy đơn hàng',
      })
    }

    // Lưu lại thay đổi vào cơ sở dữ liệu
    await orderDB.save()

    // Trả về thông báo thành công
    return res.status(200).json({
      message: 'Cập nhật đơn hàng thành công',
      data: orderDB,
    })
  } catch (error) {
    // Nếu có lỗi xảy ra khi cập nhật đơn hàng
    return res.status(500).json({
      message: 'Đã xảy ra lỗi khi cập nhật đơn hàng',
      error: error.message,
    })
  }
}

// **Admin** - Cập nhật trạng thái đơn hàng sang "Đang xử lý"
const updateOrderProgress = async (req: Request, res: Response) => {
  try {
    // Tìm và cập nhật đơn hàng theo ID từ URL params
    const orderDB = await PaymentModel.findByIdAndUpdate(
      req.params.order_id,
      {
        status: STATUS_ORDER.IN_PROGRESS, // Cập nhật trạng thái đơn hàng
      },
      { new: true } // Trả về đơn hàng đã được cập nhật
    )

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!orderDB) {
      return res.status(404).json({
        message: 'Không tìm thấy đơn hàng',
      })
    }

    // Lưu lại thay đổi vào cơ sở dữ liệu
    await orderDB.save()

    // Trả về thông báo thành công
    return res.status(200).json({
      message: 'Cập nhật đơn hàng thành công',
      data: orderDB,
    })
  } catch (error) {
    // Nếu có lỗi xảy ra khi cập nhật đơn hàng
    return res.status(500).json({
      message: 'Đã xảy ra lỗi khi cập nhật đơn hàng',
      error: error.message,
    })
  }
}
// **Admin** - Cập nhật trạng thái đơn hàng sang "Đã giao"
const updateOrderDelivered = async (req: Request, res: Response) => {
  try {
    // Tìm và cập nhật đơn hàng theo ID từ URL params, thay đổi trạng thái đơn hàng sang "Đã giao"
    const orderDB = await PaymentModel.findByIdAndUpdate(
      req.params.order_id,
      {
        status: STATUS_ORDER.DELIVERED, // Cập nhật trạng thái đơn hàng
      },
      { new: true } // Trả về đơn hàng đã được cập nhật
    )

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!orderDB) {
      return res.status(404).json({
        message: 'Không tìm thấy đơn hàng',
      })
    }

    // Lưu lại thay đổi vào cơ sở dữ liệu
    await orderDB.save()

    // Trả về thông báo thành công
    return res.status(200).json({
      message: 'Cập nhật đơn hàng thành công',
      data: orderDB,
    })
  } catch (error) {
    // Nếu có lỗi xảy ra khi cập nhật đơn hàng
    return res.status(500).json({
      message: 'Đã xảy ra lỗi khi cập nhật đơn hàng',
      error: error.message,
    })
  }
}

// **Admin** - Cập nhật trạng thái đơn hàng sang "Đã hủy"
const updateOrderCancel = async (req: Request, res: Response) => {
  try {
    // Tìm và cập nhật đơn hàng theo ID từ URL params, thay đổi trạng thái đơn hàng sang "Đã hủy"
    const orderDB = await PaymentModel.findByIdAndUpdate(
      req.params.order_id,
      {
        status: STATUS_ORDER.CANCELLED, // Cập nhật trạng thái đơn hàng
      },
      { new: true } // Trả về đơn hàng đã được cập nhật
    )

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!orderDB) {
      return res.status(404).json({
        message: 'Không tìm thấy đơn hàng',
      })
    }

    // Lưu lại thay đổi vào cơ sở dữ liệu
    await orderDB.save()

    // Trả về thông báo thành công
    return res.status(200).json({
      message: 'Cập nhật đơn hàng thành công',
      data: orderDB,
    })
  } catch (error) {
    // Nếu có lỗi xảy ra khi cập nhật đơn hàng
    return res.status(500).json({
      message: 'Đã xảy ra lỗi khi cập nhật đơn hàng',
      error: error.message,
    })
  }
}

// **Admin** - Lấy sản phẩm bán chạy nhất trong tuần
const getTopSellingProductWeekly = async (req: Request, res: Response) => {
  try {
    // Lấy ngày bắt đầu và kết thúc của tuần hiện tại
    const startOfWeek = moment().startOf('isoWeek').toDate()
    const endOfWeek = moment().endOf('isoWeek').toDate()

    // Sử dụng aggregation để tìm sản phẩm bán chạy nhất trong tuần
    const products = await PaymentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lte: endOfWeek }, // Lọc theo khoảng thời gian trong tuần
          status: { $eq: STATUS_ORDER.DELIVERED }, // Chỉ lấy đơn hàng đã giao
        },
      },
      { $unwind: '$purchases' }, // Mở rộng mảng purchases để xử lý
      {
        $group: {
          _id: '$purchases.product.name', // Nhóm theo tên sản phẩm
          totalSold: { $sum: '$purchases.buy_count' }, // Tính tổng số lượng bán ra
        },
      },
      { $sort: { totalSold: -1 } }, // Sắp xếp theo tổng số lượng bán giảm dần
      { $limit: 1 }, // Lấy sản phẩm bán chạy nhất
    ])

    return res.status(200).json({
      message: 'Sản phẩm được bán chạy nhất trong tuần',
      data: products,
      period: 'weekly', // Thông tin về khoảng thời gian (tuần)
      startOfPeriod: startOfWeek,
      endOfPeriod: endOfWeek,
    })
  } catch (error) {
    // Nếu có lỗi xảy ra khi lấy sản phẩm bán chạy nhất trong tuần
    return res.status(500).json({
      message: 'Đã xảy ra lỗi khi lấy sản phẩm được bán chạy nhất trong tuần',
      error: error.message,
    })
  }
}

// **Admin** - Lấy sản phẩm bán chạy nhất trong tháng
const getTopSellingProductMonthly = async (req: Request, res: Response) => {
  try {
    let { month, year } = req.query

    // Chuyển đổi kiểu của month và year từ number sang string
    month = month.toString()
    year = year.toString()

    // Tạo ngày đầu và cuối tháng từ tháng và năm đã chọn
    const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate()
    const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate()

    // Sử dụng aggregation để tìm sản phẩm bán chạy nhất trong tháng
    const products = await PaymentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }, // Lọc theo khoảng thời gian trong tháng
          status: { $eq: STATUS_ORDER.DELIVERED }, // Chỉ lấy đơn hàng đã giao
        },
      },
      { $unwind: '$purchases' }, // Mở rộng mảng purchases để xử lý
      {
        $group: {
          _id: '$purchases.product.name', // Nhóm theo tên sản phẩm
          totalSold: { $sum: '$purchases.buy_count' }, // Tính tổng số lượng bán ra
        },
      },
      { $sort: { totalSold: -1 } }, // Sắp xếp theo tổng số lượng bán giảm dần
      { $limit: 1 }, // Lấy sản phẩm bán chạy nhất
    ])

    return res.status(200).json({
      message: 'Sản phẩm được bán chạy nhất trong tháng',
      data: products,
      period: 'monthly', // Thông tin về khoảng thời gian (tháng)
      startOfPeriod: startOfMonth,
      endOfPeriod: endOfMonth,
    })
  } catch (error) {
    // Nếu có lỗi xảy ra khi lấy sản phẩm bán chạy nhất trong tháng
    return res.status(500).json({
      message: 'Đã xảy ra lỗi khi lấy sản phẩm được bán chạy nhất trong tháng',
      error: error.message,
    })
  }
}
const getMonthlyRevenue = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query // Lấy giá trị tháng và năm từ query parameters

    // Kiểm tra xem tháng và năm có được truyền vào không
    if (!month || !year) {
      return res.status(400).json({
        message: 'Thiếu thông tin tháng và năm', // Trả về lỗi nếu thiếu tháng hoặc năm
      })
    }

    // Chuyển đổi tháng và năm sang kiểu số nguyên
    const monthNumber = parseInt(month as string, 10) // Chuyển tháng sang số nguyên
    const yearNumber = parseInt(year as string, 10) // Chuyển năm sang số nguyên

    // Kiểm tra xem tháng và năm có hợp lệ không
    if (
      isNaN(monthNumber) ||
      isNaN(yearNumber) ||
      monthNumber < 1 ||
      monthNumber > 12 ||
      yearNumber < 1970
    ) {
      return res.status(400).json({
        message: 'Tháng hoặc năm không hợp lệ', // Trả về lỗi nếu tháng hoặc năm không hợp lệ
      })
    }

    // Tính toán khoảng thời gian từ đầu đến cuối của tháng được chọn
    const startOfPeriod = moment(`${yearNumber}-${monthNumber}-01`) // Lấy ngày bắt đầu của tháng
      .startOf('month')
      .toDate() // Chuyển đổi thành ngày đầu tiên của tháng
    const endOfPeriod = moment(`${yearNumber}-${monthNumber}-01`) // Lấy ngày cuối của tháng
      .endOf('month')
      .toDate() // Chuyển đổi thành ngày cuối cùng của tháng

    // Tính tổng doanh thu trong khoảng thời gian từ đầu đến cuối tháng
    const payments = await PaymentModel.aggregate([ 
      {
        $match: {
          createdAt: { $gte: startOfPeriod, $lte: endOfPeriod }, // Lọc các đơn hàng trong tháng
          status: { $eq: STATUS_ORDER.DELIVERED }, // Lọc các đơn hàng đã giao
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalMoney' }, // Tính tổng doanh thu từ trường totalMoney
        },
      },
    ])

    // Trả về kết quả doanh thu tháng đó
    return res.status(200).json({
      message: `Doanh thu trong tháng ${monthNumber} năm ${yearNumber}`, // Thông báo kết quả
      data: payments, // Dữ liệu doanh thu
      period: 'monthly', // Loại khoảng thời gian là theo tháng
      startOfPeriod: startOfPeriod, // Ngày bắt đầu của tháng
      endOfPeriod: endOfPeriod, // Ngày kết thúc của tháng
    })
  } catch (error) {
    // Xử lý lỗi và trả về thông báo
    return res.status(500).json({
      message: 'Đã xảy ra lỗi khi lấy doanh thu trong tháng', // Thông báo lỗi khi có sự cố
      error: error.message, // Thông báo chi tiết lỗi
    })
  }
}

const getDailyRevenue = async (req: Request, res: Response) => {
  try {
    // Lấy ngày bắt đầu và kết thúc của 30 ngày gần nhất
    const startDate = moment().subtract(30, 'days').startOf('day') // 30 ngày trước từ hôm nay
    const endDate = moment().endOf('day') // Ngày hôm nay, hết ngày

    const dailyRevenues = [] // Mảng lưu trữ doanh thu từng ngày

    // Duyệt qua từng ngày từ startDate đến endDate (30 ngày gần nhất)
    for (
      let date = startDate.clone(); // Tạo một bản sao của startDate để không thay đổi giá trị gốc
      date.isSameOrBefore(endDate, 'day'); // Kiểm tra điều kiện: ngày hiện tại có nhỏ hơn hoặc bằng endDate
      date.add(1, 'day') // Thêm 1 ngày vào date mỗi lần lặp
    ) {
      const startOfDay = date.startOf('day').toDate() // Ngày bắt đầu (00:00) của ngày hiện tại
      const endOfDay = date.endOf('day').toDate() // Ngày kết thúc (23:59) của ngày hiện tại

      // Truy vấn cơ sở dữ liệu để tính tổng doanh thu trong ngày
      const payment = await PaymentModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay }, // Lọc các đơn hàng trong ngày
            status: { $eq: STATUS_ORDER.DELIVERED }, // Lọc các đơn hàng đã giao
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalMoney' }, // Tính tổng doanh thu trong ngày
          },
        },
      ])

      // Tạo đối tượng doanh thu trong ngày
      const dailyRevenue = {
        date: startOfDay, // Ngày
        totalRevenue: payment.length > 0 ? payment[0].totalRevenue : 0, // Nếu có dữ liệu, lấy tổng doanh thu; nếu không, gán 0
      }

      // Thêm doanh thu vào mảng dailyRevenues
      dailyRevenues.push(dailyRevenue)
    }

    // Trả về kết quả doanh thu trong 30 ngày gần nhất
    return res.status(200).json({
      message: 'Doanh thu từng ngày trong 30 ngày gần nhất', // Thông báo kết quả
      data: dailyRevenues, // Dữ liệu doanh thu theo từng ngày
      period: '30_days', // Loại khoảng thời gian là 30 ngày
      startOfPeriod: startDate.toDate(), // Ngày bắt đầu của khoảng thời gian
      endOfPeriod: endDate.toDate(), // Ngày kết thúc của khoảng thời gian
    })
  } catch (error) {
    // Xử lý lỗi và trả về thông báo
    return res.status(500).json({
      message:
        'Đã xảy ra lỗi khi lấy doanh thu từng ngày trong 30 ngày gần nhất', // Thông báo lỗi khi có sự cố
      error: error.message, // Thông báo chi tiết lỗi
    })
  }
}

// Các phương thức khác của controller
const paymentController = {
  getPayments,
  getAllOrders,
  updateOrderConfirm,
  updateOrderProgress,
  updateOrderDelivered,
  updateOrderCancel,
  getTopSellingProductWeekly,
  getTopSellingProductMonthly,
  getMonthlyRevenue,
  getDailyRevenue, // Thêm phương thức getDailyRevenue vào controller
}

export default paymentController
