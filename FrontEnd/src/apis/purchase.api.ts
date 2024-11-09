// Import các kiểu dữ liệu `Purchase` và `PurchaseListStatus` từ file `purchase.type` để sử dụng cho các API liên quan đến đơn mua hàng.
import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'

// Import kiểu `SuccessResponse` từ file `utils.type` để định dạng dữ liệu phản hồi thành công từ API.
import { SuccessResponse } from 'src/types/utils.type'

// Import module `http`, một tiện ích để thực hiện các yêu cầu HTTP.
import http from 'src/utils/http'

// Khai báo URL gốc cho các yêu cầu liên quan đến đơn mua hàng là 'purchases'.
const URL = 'purchases'

// Đối tượng `purchaseApi` chứa các phương thức gọi API liên quan đến giỏ hàng và đơn mua hàng.
const purchaseApi = {
  // Phương thức `addToCart` dùng để thêm sản phẩm vào giỏ hàng.
  // Hàm nhận vào `body` chứa `product_id` (mã sản phẩm) và `buy_count` (số lượng mua).
  // Thực hiện yêu cầu POST đến `purchases/add-to-cart` với `body` và trả về phản hồi kiểu `SuccessResponse<Purchase>`.
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body)
  },

  // Phương thức `getPurchases` dùng để lấy danh sách các đơn mua hàng dựa trên `status`.
  // Hàm nhận vào `params` chứa `status` với kiểu `PurchaseListStatus`, để lọc danh sách đơn mua hàng theo trạng thái.
  // Thực hiện yêu cầu GET đến `purchases` với `params` và trả về phản hồi kiểu `SuccessResponse<Purchase[]>`.
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponse<Purchase[]>>(`${URL}`, {
      params
    })
  },

  // Phương thức `buyProducts` dùng để hoàn tất mua sản phẩm với thông tin đặt hàng chi tiết.
  // Nhận vào `body` chứa địa chỉ, số tiền, phương thức thanh toán, danh sách sản phẩm (`purchase`) và chi tiết sản phẩm (`order`).
  // Thực hiện yêu cầu POST đến `purchases/buy-products` với `body` và trả về phản hồi kiểu `SuccessResponse<Purchase[]>`.
  buyProducts(body: {
    street: string
    totalMoney: number
    city: string
    name: string
    phone: string
    paymentMethod: number
    purchase: string[]
    order: { product_id: string; buy_count: string }[]
  }) {
    return http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, body)
  },

  // Phương thức `updatePurchase` dùng để cập nhật số lượng mua cho sản phẩm trong giỏ hàng.
  // Nhận vào `body` chứa `product_id` và `buy_count`.
  // Thực hiện yêu cầu PUT đến `purchases/update-purchase` với `body` và trả về phản hồi kiểu `SuccessResponse<Purchase>`.
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body)
  },

  // Phương thức `deletePurchase` dùng để xóa các sản phẩm khỏi giỏ hàng.
  // Nhận vào `purchaseIds` là một mảng chứa các mã đơn mua hàng cần xóa.
  // Thực hiện yêu cầu DELETE đến `purchases` với dữ liệu `purchaseIds` và trả về phản hồi kiểu `SuccessResponse<{ deleted_count: number }>` để biết số lượng sản phẩm đã xóa.
  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${URL}`, {
      data: purchaseIds
    })
  }
}

// Xuất đối tượng `purchaseApi` để có thể sử dụng trong các file khác.
export default purchaseApi
