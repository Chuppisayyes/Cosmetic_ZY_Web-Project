// Import kiểu dữ liệu AuthResponse từ file auth.type để sử dụng cho phản hồi từ các API liên quan đến xác thực.
import { AuthResponse } from 'src/types/auth.type'

// Import module http, một tiện ích dùng để thực hiện các yêu cầu HTTP.
import http from 'src/utils/http'

// Đối tượng authApi chứa các phương thức gọi API liên quan đến xác thực.
const authApi = {
  // Phương thức `registerAccount` dùng để đăng ký tài khoản mới. 
  // Hàm nhận vào một đối tượng `body` chứa email và mật khẩu, và thực hiện một yêu cầu POST tới đường dẫn '/register'.
  // Phản hồi trả về có kiểu `AuthResponse`, đại diện cho dữ liệu phản hồi từ server khi đăng ký thành công.
  registerAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>('/register', body)
  },

  // Phương thức `login` dùng để đăng nhập tài khoản.
  // Hàm nhận vào một đối tượng `body` chứa email và mật khẩu, và thực hiện một yêu cầu POST tới đường dẫn '/login'.
  // Phản hồi trả về có kiểu `AuthResponse`, chứa thông tin phản hồi khi đăng nhập thành công.
  login(body: { email: string; password: string }) {
    return http.post<AuthResponse>('/login', body)
  },

  // Phương thức `loginGoogle` dùng để đăng nhập bằng tài khoản Google.
  // Hàm nhận vào một đối tượng `body` chứa email và tên người dùng, và thực hiện một yêu cầu POST tới đường dẫn '/login/google'.
  // Phản hồi trả về có kiểu `AuthResponse`, bao gồm thông tin xác thực khi đăng nhập thành công qua Google.
  loginGoogle(body: { email: string; name: string }) {
    return http.post<AuthResponse>('/login/google', body)
  },

  // Phương thức `logout` dùng để đăng xuất tài khoản hiện tại.
  // Hàm thực hiện một yêu cầu POST tới đường dẫn '/logout'.
  // Phản hồi không cần kiểu cụ thể, vì logout thường không trả về dữ liệu chi tiết.
  logout() {
    return http.post('/logout')
  }
}

// Xuất đối tượng `authApi` để có thể sử dụng trong các file khác trong dự án.
export default authApi
