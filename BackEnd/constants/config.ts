// Nạp các biến môi trường từ file .env
require('dotenv').config()

// Cấu hình thông tin liên quan đến JWT (JSON Web Token)
export const config = {
  SECRET_KEY: process.env.SECRET_KEY_JWT || '',  // Khóa bí mật cho JWT, lấy từ biến môi trường SECRET_KEY_JWT
  EXPIRE_ACCESS_TOKEN: 7 * 24 * 60 * 60, // Thời gian hết hạn của access token là 7 ngày (tính bằng giây)
  EXPIRE_REFRESH_TOKEN: 100 * 24 * 60 * 60, // Thời gian hết hạn của refresh token là 100 ngày (tính bằng giây)
}

// Định nghĩa thư mục tải lên hình ảnh
export const FOLDER_UPLOAD = 'upload'

// Định nghĩa các thư mục con cho sản phẩm, avatar và thương hiệu
export const FOLDERS = {
  PRODUCT: 'product',  // Thư mục chứa sản phẩm
  AVATAR: 'avatar',    // Thư mục chứa ảnh đại diện
  BRAND: 'brand',      // Thư mục chứa thương hiệu
}

// Định nghĩa đường dẫn cho hình ảnh
export const ROUTE_IMAGE = 'images'

// Cấu hình thông tin email để gửi email
const MailConfig = {
  MAILER: process.env.MAIL_MAILER,       // Nhà cung cấp dịch vụ email (ví dụ: 'smtp')
  HOST: process.env.MAIL_HOST,           // Địa chỉ máy chủ email
  PORT: process.env.MAIL_PORT,           // Cổng máy chủ email
  USERNAME: process.env.MAIL_USERNAME,   // Tên đăng nhập email
  PASSWORD: process.env.MAIL_PASSWORD,   // Mật khẩu email
  ENCRYPTION: process.env.MAIL_ENCRYPTION, // Mã hóa email (ví dụ: 'ssl', 'tls')
  FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS, // Địa chỉ email người gửi
  FROM_NAME: process.env.MAIL_FROM_NAME,     // Tên người gửi
}

// Xuất cấu hình email để sử dụng ở nơi khác trong ứng dụng
export default MailConfig
