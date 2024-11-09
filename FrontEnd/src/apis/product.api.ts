// Import các kiểu dữ liệu `Product`, `ProductList`, và `ProductListConfig` từ file `product.type` để sử dụng trong các API liên quan đến sản phẩm.
import { Product, ProductList, ProductListConfig } from 'src/types/product.type'

// Import kiểu `SuccessResponse` từ file `utils.type` để định dạng dữ liệu phản hồi thành công từ API.
import { SuccessResponse } from 'src/types/utils.type'

// Import module `http`, một tiện ích để thực hiện các yêu cầu HTTP.
import http from 'src/utils/http'

// Khai báo URL gốc cho các yêu cầu liên quan đến sản phẩm là 'products'.
const URL = 'products'

// Đối tượng `productApi` chứa các phương thức gọi API liên quan đến sản phẩm.
const productApi = {
  // Phương thức `getProducts` dùng để lấy danh sách sản phẩm.
  // Hàm nhận vào `params` với kiểu `ProductListConfig` để cấu hình danh sách sản phẩm trả về (như lọc, phân trang).
  // Thực hiện một yêu cầu GET đến `URL` kèm theo `params` và trả về phản hồi kiểu `SuccessResponse<ProductList>`.
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(URL, {
      params
    })
  },

  // Phương thức `getProductDetail` dùng để lấy chi tiết sản phẩm theo `id`.
  // Thực hiện yêu cầu GET đến đường dẫn `products/{id}` và trả về phản hồi kiểu `SuccessResponse<Product>`.
  getProductDetail(id: string) {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
  },

  // Phương thức `getProduct` dùng để lấy danh sách sản phẩm mà không cần truyền vào tham số cấu hình.
  // Thực hiện yêu cầu GET đến `URL` và trả về phản hồi kiểu `SuccessResponse<ProductList>`.
  getProduct() {
    return http.get<SuccessResponse<ProductList>>(URL)
  },

  // Phương thức `addComment` dùng để thêm bình luận vào một sản phẩm theo `id`.
  // Nhận vào `id` của sản phẩm và một đối tượng `body` chứa thông tin `rating` (đánh giá) và `commentItem` (nội dung bình luận).
  // Thực hiện yêu cầu POST đến `products/{id}` kèm theo dữ liệu `body`, và trả về phản hồi kiểu `SuccessResponse<Product>`.
  addComment(id: string, body: { rating: number; commentItem: string }) {
    return http.post<SuccessResponse<Product>>(`products/${id}`, body)
  }
}

// Xuất đối tượng `productApi` để có thể sử dụng trong các file khác.
export default productApi
