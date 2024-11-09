export const sortBy = {
  createdAt: 'createdAt', // Sắp xếp theo thời gian tạo sản phẩm (ngày đăng)
  view: 'view',           // Sắp xếp theo số lượt xem của sản phẩm
  sold: 'sold',           // Sắp xếp theo số lượng sản phẩm đã bán
  price: 'price'          // Sắp xếp theo giá sản phẩm
} as const

export const order = {
  asc: 'asc',  // Thứ tự tăng dần (ascending)
  desc: 'desc' // Thứ tự giảm dần (descending)
} as const
