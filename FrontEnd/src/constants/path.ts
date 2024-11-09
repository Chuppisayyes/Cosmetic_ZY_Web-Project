// Định nghĩa một đối tượng path chứa tất cả các đường dẫn URL cho ứng dụng
const path = {
  // Các đường dẫn cho các trang và tính năng trong ứng dụng
  home: '/', // Trang chủ
  login: '/login', // Trang đăng nhập
  register: '/register', // Trang đăng ký
  logout: '/logout', // Đăng xuất
  filterProduct: '/filterProduct', // Bộ lọc sản phẩm
  filterBrand: '/filterBrand', // Bộ lọc thương hiệu
  productDetail: ':nameId', // Chi tiết sản phẩm (dùng tham số `nameId` để lấy thông tin sản phẩm)
  cart: '/cart', // Giỏ hàng
  user: '/user', // Trang người dùng
  profile: '/user/profile', // Hồ sơ người dùng
  changePassword: '/user/password', // Thay đổi mật khẩu
  hitoryPurchase: '/user/purchase', // Lịch sử mua hàng của người dùng
  AIform: '/user/AIform', // Mẫu hỗ trợ chu trình skincare (AI)
  forgetpassword: '/forgetpassword', // Quên mật khẩu
  admin: '/admin', // Trang quản trị
  adminProfile: '/admin/profile', // Hồ sơ quản trị viên
  dashboard: '/admin/dashboard', // Bảng điều khiển (dashboard) quản trị
  brands: '/admin/brands', // Quản lý thương hiệu
  accounts: '/admin/accounts', // Quản lý tài khoản người dùng
  products: '/admin/products', // Quản lý sản phẩm
  orders: '/admin/orders', // Quản lý đơn hàng
  recycle: '/admin/recycle', // Quản lý sản phẩm đã xóa
  formAccountEdit: '/admin/accounts/edit', // Mẫu chỉnh sửa tài khoản người dùng
  formProductEdit: '/admin/products/edit' // Mẫu chỉnh sửa sản phẩm
}

// Xuất đối tượng path để có thể sử dụng ở các module khác
export default path
