// import { useRecoilState } from 'recoil'
// import { activeNavItemState } from 'src/atoms/ActiveNavBarAtom'

import { NavLink } from 'react-router-dom'  // Import NavLink từ react-router-dom để tạo các liên kết điều hướng
import classNames from 'classnames'  // Import classNames để dễ dàng kết hợp các class CSS conditionally

// interface Link {
//   id: number
//   title: string
//   icon: JSX.Element
//   link: string
// }

interface NavItemProps {
  data: any  // Định nghĩa props nhận vào dữ liệu cho item menu (chứa các thông tin như tiêu đề, liên kết, icon...)
}

const NavItem = ({ data }: NavItemProps) => {
  // const [activeNav, setActiveNav] = useRecoilState(activeNavItemState)  // (Đoạn mã này bị chú thích lại, có thể dùng để quản lý trạng thái active của item)

  return (
    <div
      // onClick={() => setActiveNav(data.id)}  // (Đoạn mã này bị chú thích lại, sẽ gọi hàm setActiveNav khi nhấn vào item menu)
      className={`w-full flex items-center justify-start space-x-8 px-5 cursor-pointer
       group hover:border-rose-500 border-l-4 border-transparent`}  // Đặt các class cho item menu
    >
      <NavLink
        to={data.link}  // Sử dụng NavLink để điều hướng đến đường dẫn (link) được cung cấp trong data
        className={({ isActive }) =>  // Sử dụng hàm classNames để điều chỉnh class dựa trên trạng thái active của NavLink
          classNames(' flex items-center gap-5 w-full capitalize transition-colors  text-[17px]', {
            'text-rose-400': isActive,  // Nếu NavLink đang active, áp dụng màu text-rose-400
            'text-gray-600': !isActive  // Nếu NavLink không active, áp dụng màu text-gray-600
          })
        }
      >
        <span className='w-[20px] h-[20px]'> {data.icon}</span>  {/* Hiển thị icon của item menu */}
        <h1>{data.title}</h1>  {/* Hiển thị tiêu đề của item menu */}
      </NavLink>
    </div>
  )
}

export default NavItem  // Export component NavItem để sử dụng ở nơi khác trong dự án
