// Import các icon từ thư viện react-icons để sử dụng trong menu
import { MdOutlineAccountCircle } from 'react-icons/md'
import { FaShoppingCart } from 'react-icons/fa'
import { BiSolidPackage } from 'react-icons/bi'
import path from 'src/constants/path' // Định nghĩa các đường dẫn trong ứng dụng
import { TbBrandBaidu } from 'react-icons/tb'
import { AiFillSignal } from 'react-icons/ai'
import { RiDeleteBin4Fill } from 'react-icons/ri'

// Mảng 'data' chứa các mục menu trong ứng dụng
export const data = [
  {
    id: 0, // ID của mục menu, dùng để phân biệt các mục
    title: 'Quản lý doanh thu', // Tiêu đề của mục menu
    icon: <AiFillSignal fontSize='24px' />, // Icon của mục menu
    link: path.dashboard // Đường dẫn điều hướng khi click vào mục này
  },
  {
    id: 1,
    title: 'Quản lý tài khoản',
    icon: <MdOutlineAccountCircle fontSize='24px' />,
    link: path.accounts // Liên kết đến trang quản lý tài khoản
  },
  {
    id: 2,
    title: 'Quản lý sản phẩm',
    icon: <BiSolidPackage fontSize='24px' />,
    link: path.products // Liên kết đến trang quản lý sản phẩm
  },
  {
    id: 3,
    title: 'Quản lý thương hiệu',
    icon: <TbBrandBaidu fontSize='24px' />,
    link: path.brands // Liên kết đến trang quản lý thương hiệu
  },
  {
    id: 4,
    title: 'Quản lý đơn hàng',
    icon: <FaShoppingCart fontSize='24px' />,
    link: path.orders // Liên kết đến trang quản lý đơn hàng
  },
  {
    id: 5,
    title: 'Quản lý sản phẩm đã xóa',
    icon: <RiDeleteBin4Fill fontSize='24px' />,
    link: path.recycle // Liên kết đến trang quản lý sản phẩm đã xóa
  }
]
