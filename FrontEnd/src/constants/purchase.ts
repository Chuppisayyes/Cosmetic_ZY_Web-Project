export const purchasesStatus = {
  inCart: 1,  // Trạng thái sản phẩm có trong giỏ hàng
  outCart: 0  // Trạng thái sản phẩm đã bị xóa khỏi giỏ hàng
} as const

export const orderStatus = {
  all: 0,                    // Tất cả các trạng thái đơn hàng
  waitForConfirmation: 1,    // Đơn hàng đang chờ xác nhận
  waitForGetting: 2,         // Đơn hàng đang chờ lấy hàng
  inProgress: 3,             // Đơn hàng đang trong quá trình xử lý
  delivered: 4,              // Đơn hàng đã được giao
  cancelled: 5               // Đơn hàng đã bị hủy
} as const

