// Định nghĩa một đối tượng config chứa các cấu hình cho ứng dụng
const config = {
  // Đường dẫn cơ bản của API, sử dụng cho các yêu cầu HTTP tới server
  baseUrl: 'http://localhost:4000/',

  // Kích thước tối đa của avatar người dùng được phép tải lên, tính bằng byte
  maxSizeUploadAvatar: 2048576 // 2MB (2048KB = 2048576 bytes)
}

// Xuất đối tượng config để có thể sử dụng ở các module khác
export default config
