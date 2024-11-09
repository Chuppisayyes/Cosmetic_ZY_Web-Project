import { FaUserEdit } from 'react-icons/fa' // Import icon chỉnh sửa tài khoản
import { FaUserLock } from 'react-icons/fa6' // Import icon đổi mật khẩu
import { BsCartCheckFill } from 'react-icons/bs' // Import icon đơn hàng
import { Link, NavLink } from 'react-router-dom' // Import Link và NavLink từ react-router-dom để tạo liên kết
import path from 'src/constants/path' // Import các đường dẫn từ constants/path
import { AppContext } from 'src/contexts/app.contexts' // Import context để lấy thông tin người dùng
import { useContext } from 'react' // Hook để sử dụng context
import { getAvatarUrl } from 'src/utils/utils' // Hàm lấy URL của avatar
import classNames from 'classnames' // Thư viện hỗ trợ kết hợp các lớp CSS conditionally

export default function UserSideNav() {
  const { profile } = useContext(AppContext) // Lấy thông tin profile người dùng từ context
  return (
    <div className='border border-gray-200 rounded-lg w-full px-4 pb-6 bg-gray-100 font'>
      {/* Phần hiển thị avatar và thông tin người dùng */}
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        {/* Hiển thị avatar người dùng và liên kết đến trang chỉnh sửa profile */}
        <Link to={path.profile} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'>
          <img src={getAvatarUrl(profile?.avatar)} alt='' className='h-full w-full object-cover' />
        </Link>
        <div className='flex-grow pl-4'>
          {/* Hiển thị email người dùng */}
          <div className='mb-1 truncate font-semibold text-gray-600'>{profile?.email}</div>
          {/* Liên kết để người dùng có thể sửa hồ sơ */}
          <Link to={path.profile} className='flex items-center capitalize text-gray-500'>
            <svg
              width={12}
              height={12}
              viewBox='0 0 12 12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: 4 }}
            >
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              />
            </svg>
            Sửa hồ sơ
          </Link>
        </div>
      </div>

      {/* Các liên kết điều hướng đến các trang khác */}
      <div className='mt-7'>
        {/* Liên kết đến trang tài khoản của tôi */}
        <NavLink
          to={path.profile}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize text-[14px]  text-gray-700', {
              'text-rose-800': isActive, // Nếu trang đang được chọn, đổi màu chữ thành đỏ
              'text-gray-700': !isActive // Nếu không, màu chữ là xám
            })
          }
        >
          <div className='mr-3 h-[25px] w-[25px]'>
            <FaUserEdit className='h-[25px] w-[25px]' /> {/* Icon chỉnh sửa tài khoản */}
          </div>
          Tài khoản của tôi
        </NavLink>

        {/* Liên kết đến trang đổi mật khẩu */}
        <NavLink
          to={path.changePassword}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize text-[14px]  text-gray-700', {
              'text-rose-800': isActive,
              'text-gray-700': !isActive
            })
          }
        >
          <div className='mr-3 h-[25px] w-[25px]'>
            <FaUserLock className='h-[25px] w-[25px]' /> {/* Icon đổi mật khẩu */}
          </div>
          Đổi mật khẩu
        </NavLink>

        {/* Liên kết đến trang đơn mua */}
        <NavLink
          to={path.hitoryPurchase}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize text-[14px]  text-gray-700', {
              'text-rose-800': isActive,
              'text-gray-700': !isActive
            })
          }
        >
          <div className='mr-3 h-[25px] w-[25px]'>
            <BsCartCheckFill className='h-[25px] w-[25px]' /> {/* Icon đơn mua */}
          </div>
          Đơn mua
        </NavLink>

        {/* Liên kết đến trang hỗ trợ chu trình skincare */}
        <NavLink
          to={path.AIform}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize text-[14px]  text-gray-700', {
              'text-rose-800': isActive,
              'text-gray-700': !isActive
            })
          }
        >
          <div className='mr-3 h-[25px] w-[25px]'>
            <div className='h-[25px] w-[25px] text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57]'>
              AI {/* Hiển thị chữ AI cho hỗ trợ chu trình skincare */}
            </div>
          </div>
          Hỗ trợ chu trình skincare
        </NavLink>
      </div>
    </div>
  )
}
