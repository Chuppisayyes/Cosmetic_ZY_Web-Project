// Import các kiểu dữ liệu từ các file khác để sử dụng trong adminApi, như Brand, Category, Order, Product, ProductList, User, SuccessResponse.
import { Brand } from 'src/types/brand.type'
import { Category } from 'src/types/category.type'
import { Order } from 'src/types/order.type'
import { Product, ProductList } from 'src/types/product.type'
import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

// Định nghĩa URL gốc cho các yêu cầu liên quan đến người dùng trong admin.
const URL = '/admin/users'

// Khai báo cấu trúc dữ liệu của một người dùng (UserData) với các thuộc tính như email, tên, số điện thoại, địa chỉ, và các vai trò.
interface UserData {
  email: string
  name: string
  phone: string
  address: string
  roles: string[]
}

// Khai báo cấu trúc dữ liệu của một thương hiệu (BrandData) với các thuộc tính như tên, ảnh, và mô tả.
interface BrandData {
  name: string
  image: string
  description: string
}

// Đối tượng adminApi chứa các phương thức để gọi API cho các chức năng của admin.
const adminApi = {
  // Lấy danh sách tất cả người dùng.
  getAllUser() {
    return http.get<SuccessResponse<User[]>>(URL)
  },
  // Cập nhật thông tin người dùng dựa trên id và dữ liệu mới.
  updateUser(id: string[], userData: UserData) {
    return http.put<SuccessResponse<User[]>>(`/admin/users/${id}`, userData)
  },
  // Lấy thông tin chi tiết của người dùng theo id.
  getUser(id: string[]) {
    return http.get<SuccessResponse<User[]>>(`/admin/users/${id}`)
  },
  // Xóa người dùng theo id.
  deleteUser(id: string[]) {
    return http.delete<SuccessResponse<User[]>>(`/admin/users/delete/${id}`)
  },
  // Lấy danh sách tất cả sản phẩm.
  getAllProducts() {
    return http.get<SuccessResponse<ProductList[]>>('/admin/products/all')
  },
  // Lấy thông tin chi tiết của sản phẩm theo id.
  getProduct(id: string[]) {
    return http.get<SuccessResponse<ProductList[]>>(`/admin/products/${id}`)
  },
  // Cập nhật thông tin sản phẩm theo id và dữ liệu mới.
  updateProduct(id: string[], userData: UserData) {
    return http.put<SuccessResponse<User[]>>(`/admin/products/${id}`, userData)
  },
  // Xóa sản phẩm theo id.
  deleteProduct(id: string[]) {
    return http.delete<SuccessResponse<User[]>>(`/admin/products/delete/${id}`)
  },
  // Khôi phục sản phẩm theo id.
  retoreProduct(id: string[]) {
    return http.patch<SuccessResponse<User[]>>(`/admin/products/${id}`)
  },
  // Lấy danh sách tất cả danh mục.
  getcategories() {
    return http.get<SuccessResponse<Category[]>>(`/admin/categories`)
  },
  // Tạo mới một sản phẩm với dữ liệu đầu vào.
  createProduct(body: any) {
    return http.post<SuccessResponse<Product[]>>('/admin/products', body)
  },
  // Tải lên một hình ảnh cho sản phẩm.
  uploadImage(body: any) {
    return http.post<SuccessResponse<string>>('/admin/products/upload-image', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  // Tải lên nhiều hình ảnh cho sản phẩm.
  uploadImages(body: any) {
    return http.post<SuccessResponse<string>>('/admin/products/upload-images', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  // Lấy danh sách tất cả đơn hàng.
  getAllOrder() {
    return http.get<SuccessResponse<Order[]>>('/admin/orders')
  },
  // Xác nhận đơn hàng đang trong quá trình vận chuyển theo id.
  confirmprogress(id: string[]) {
    return http.put<SuccessResponse<Order[]>>(`/admin/orders/${id}/progress`)
  },
  // Xác nhận đơn hàng đã được giao thành công theo id.
  confirmdelivered(id: string[]) {
    return http.put<SuccessResponse<Order[]>>(`/admin/orders/${id}/delivered`)
  },
  // Xác nhận chấp nhận đơn hàng theo id.
  confirmaccept(id: string[]) {
    return http.put<SuccessResponse<Order[]>>(`/admin/orders/${id}/confirm`)
  },
  // Xác nhận hủy đơn hàng theo id.
  confirmcancel(id: string[]) {
    return http.put<SuccessResponse<Order[]>>(`/admin/orders/${id}/cancel`)
  },
  // Lấy danh sách các sản phẩm đã bị xóa.
  getDeleteProduct() {
    return http.get<SuccessResponse<Product[]>>('/admin/products/deleteProduct')
  },
  // Lấy danh sách tất cả thương hiệu.
  getBrands() {
    return http.get<SuccessResponse<Brand[]>>('/admin/brands')
  },
  // Lấy thông tin chi tiết thương hiệu theo id.
  getBrandsbyID(id: string) {
    return http.get<SuccessResponse<Brand[]>>(`/admin/brands/${id}`)
  },
  // Tải lên ảnh đại diện cho thương hiệu.
  uploadBrandImage(body: any) {
    return http.post<SuccessResponse<string>>('/admin/brands/upload-image', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  // Tạo mới một thương hiệu với dữ liệu đầu vào.
  createBrand(body: any) {
    return http.post<SuccessResponse<Product[]>>('/admin/brands', body)
  },
  // Lấy danh sách sản phẩm của một thương hiệu theo id.
  getProductByBrand(id: string) {
    return http.get<SuccessResponse<Brand[]>>(`/products/brand/${id}`)
  },
  // Cập nhật thông tin thương hiệu theo id và dữ liệu mới.
  updateBrand(id: string[], brandData: BrandData) {
    return http.put<SuccessResponse<User[]>>(`/admin/brands/${id}`, brandData)
  }
}

// Xuất đối tượng adminApi để có thể sử dụng trong các file khác.
export default adminApi
