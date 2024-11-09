// Import kiểu dữ liệu `Payment` từ file `payment.type` để mô tả thông tin thanh toán.
import { Payment } from 'src/types/payment.type'

// Import kiểu `SuccessResponse` từ file `utils.type` để định dạng dữ liệu phản hồi thành công từ API.
import { SuccessResponse } from 'src/types/utils.type'

// Import module `http`, một tiện ích để thực hiện các yêu cầu HTTP.
import http from 'src/utils/http'

// Khai báo URL gốc cho các yêu cầu liên quan đến thanh toán là 'payment'.
const URL = 'payment'

// Đối tượng `paymentApi` chứa các phương thức gọi API liên quan đến thanh toán.
const paymentApi = {
  // Phương thức `getPayment` dùng để lấy thông tin thanh toán.
  // Hàm này thực hiện một yêu cầu GET đến URL đã khai báo và trả về phản hồi có kiểu `SuccessResponse<Payment>`,
  // tức là một phản hồi thành công chứa đối tượng `Payment` với thông tin chi tiết về thanh toán.
  getPayment() {
    return http.get<SuccessResponse<Payment>>(`${URL}`)
  }
}

// Xuất đối tượng `paymentApi` để có thể sử dụng trong các file khác.
export default paymentApi
