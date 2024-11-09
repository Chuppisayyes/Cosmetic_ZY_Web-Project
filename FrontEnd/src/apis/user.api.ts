// Import kiểu dữ liệu `SkincareForm` từ file `health.type` để sử dụng cho các API liên quan đến biểu mẫu chăm sóc da.
import { SkincareForm } from 'src/types/health.type'

// Import kiểu dữ liệu `User` từ file `user.type` để sử dụng trong các API liên quan đến người dùng.
import { User } from 'src/types/user.type'

// Import kiểu `SuccessResponse` từ file `utils.type` để định dạng dữ liệu phản hồi thành công từ API.
import { SuccessResponse } from 'src/types/utils.type'

// Import module `http`, một tiện ích để thực hiện các yêu cầu HTTP.
import http from 'src/utils/http'

// Khai báo interface `BodyUpdateProfile` mô tả cấu trúc dữ liệu để cập nhật thông tin người dùng.
// Loại bỏ các trường không cần thiết như `_id`, `roles`, `createdAt`, `updatedAt`, và `email`.
// Trường `password` và `newPassword` có thể có nhưng không bắt buộc.
interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  newPassword?: string
}

// Khai báo interface `BodyForgetPassword` mô tả cấu trúc dữ liệu để quên mật khẩu và cập nhật lại mật khẩu.
// Loại bỏ các trường không cần thiết như `_id`, `roles`, `createdAt`, `updatedAt`, `name`, `date_of_birth`, `address`, và `phone`.
// Trường `password` và `newPassword` có thể có nhưng không bắt buộc.
interface BodyForgetPassword
  extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'name' | 'date_of_birth' | 'address' | 'phone'> {
  password?: string
  newPassword?: string
}

// Đối tượng `userApi` chứa các phương thức gọi API liên quan đến người dùng và chăm sóc da.
const userApi = {
  // Phương thức `getProfile` dùng để lấy thông tin người dùng hiện tại.
  // Thực hiện yêu cầu GET đến đường dẫn `me` và trả về phản hồi kiểu `SuccessResponse<User>`.
  getProfile() {
    return http.get<SuccessResponse<User>>('me')
  },

  // Phương thức `updateProfile` dùng để cập nhật thông tin người dùng.
  // Nhận vào đối tượng `body` với kiểu `BodyUpdateProfile`, và thực hiện yêu cầu PUT đến đường dẫn `user` để cập nhật.
  // Trả về phản hồi kiểu `SuccessResponse<User>`.
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponse<User>>('user', body)
  },

  // Phương thức `uploadAvatar` dùng để tải lên ảnh đại diện cho người dùng.
  // Nhận vào `body` kiểu `FormData`, với header `Content-Type` là `multipart/form-data` để hỗ trợ upload tệp.
  // Thực hiện yêu cầu POST đến đường dẫn `user/upload-avatar` và trả về phản hồi kiểu `SuccessResponse<string>`.
  uploadAvatar(body: FormData) {
    return http.post<SuccessResponse<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Phương thức `forgetPassword` dùng để xử lý yêu cầu quên mật khẩu và cập nhật mật khẩu mới.
  // Nhận vào đối tượng `body` kiểu `BodyForgetPassword` và thực hiện yêu cầu POST đến đường dẫn `/forgotten`.
  // Trả về phản hồi kiểu `SuccessResponse<User>`.
  forgetPassword(body: BodyForgetPassword) {
    return http.post<SuccessResponse<User>>('/forgotten', body)
  },

  // Phương thức `getSkincareForm` dùng để lấy biểu mẫu chăm sóc da của người dùng.
  // Thực hiện yêu cầu GET đến đường dẫn `skincare` và trả về phản hồi kiểu `SuccessResponse<SkincareForm>`.
  getSkincareForm() {
    return http.get<SuccessResponse<SkincareForm>>('skincare')
  },

  // Phương thức `createSkincareForm` dùng để tạo mới biểu mẫu chăm sóc da cho người dùng.
  // Nhận vào đối tượng `body` chứa thông tin về người dùng, giới tính, loại da, tình trạng da, và mong muốn cải thiện.
  // Thực hiện yêu cầu POST đến đường dẫn `skincare/add-form` để tạo biểu mẫu chăm sóc da.
  // Trả về phản hồi kiểu `SuccessResponse<SkincareForm>`.
  createSkincareForm(body: {
    user: string
    sex: string
    desired_routine: string
    skin_type: string
    skin_condition: string[]
    desired_improv: string[]
  }) {
    console.log(body) // In ra dữ liệu body để kiểm tra
    return http.post<SuccessResponse<SkincareForm>>('skincare/add-form', body)
  },

  // Phương thức `getSkincareFormDetail` dùng để lấy chi tiết biểu mẫu chăm sóc da theo `id`.
  // Thực hiện yêu cầu GET đến đường dẫn `skincare/{id}` và trả về phản hồi kiểu `SuccessResponse<SkincareForm>`.
  getSkincareFormDetail(id: string) {
    return http.get<SuccessResponse<SkincareForm>>(`skincare/${id}`)
  }
}

// Xuất đối tượng `userApi` để có thể sử dụng trong các file khác.
export default userApi
