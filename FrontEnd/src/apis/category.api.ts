// Import module `http`, một tiện ích để thực hiện các yêu cầu HTTP.
import http from 'src/utils/http'

// Import kiểu `SuccessResponse` từ file `utils.type` để định dạng dữ liệu phản hồi thành công từ API.
import { SuccessResponse } from 'src/types/utils.type'

// Import kiểu dữ liệu `Category` từ file `category.type` để mô tả các thông tin về danh mục.
import { Category } from 'src/types/category.type'

// Khai báo URL gốc cho các yêu cầu liên quan đến danh mục là 'categories'.
const URL = 'categories'

// Đối tượng `categoryApi` chứa các phương thức gọi API liên quan đến danh mục.
const categoryApi = {
  // Phương thức `getCategories` dùng để lấy danh sách các danh mục.
  // Hàm này thực hiện một yêu cầu GET đến URL đã khai báo và trả về phản hồi có kiểu `SuccessResponse<Category[]>`,
  // tức là một phản hồi thành công chứa danh sách các đối tượng `Category`.
  getCategories() {
    return http.get<SuccessResponse<Category[]>>(URL)
  }
}

// Xuất đối tượng `categoryApi` để có thể sử dụng trong các file khác.
export default categoryApi
