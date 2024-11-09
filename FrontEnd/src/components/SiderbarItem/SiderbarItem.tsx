import React, { useContext } from 'react'
import { data } from './data' // Dữ liệu cho các mục menu bên trong sidebar
import NavItem from './NavItem/NavItem' // Component NavItem dùng để hiển thị từng mục menu
import { getAvatarUrl } from 'src/utils/utils' // Hàm lấy đường dẫn ảnh avatar từ profile
import { AppContext } from 'src/contexts/app.contexts' // Import context chứa thông tin người dùng và trạng thái đăng nhập
import { Link } from 'react-router-dom' // Để sử dụng Link từ react-router-dom cho điều hướng
import path from 'src/constants/path' // Đường dẫn các trang trong ứng dụng
import { useMutation } from 'react-query' // Hook của react-query để quản lý các tác vụ bất đồng bộ
import authApi from 'src/apis/auth.api' // API liên quan đến xác thực người dùng
import { IoLogOut } from 'react-icons/io5' // Import icon đăng xuất

const SiderbarItem: React.FC = () => {
  const { profile } = useContext(AppContext) // Lấy thông tin người dùng từ context
  const { setIsAuthenticated, setProfile } = useContext(AppContext) // Hàm để thay đổi trạng thái đăng nhập và profile trong context
  const logoutMutation = useMutation({
    mutationFn: authApi.logout, // Gọi API đăng xuất
    onSuccess: () => {
      setIsAuthenticated(false) // Đánh dấu người dùng đã đăng xuất
      setProfile(null) // Xóa thông tin profile người dùng
    }
  })

  // Hàm xử lý sự kiện đăng xuất
  const handleLogout = () => {
    logoutMutation.mutate() // Thực hiện mutation đăng xuất
  }

  return (
    <nav className='border border-gray-200 rounded-lg w-full px-2 pb-8 bg-gray-100 font text-[15px]'>
      <div className='flex flex-col gap-8 items-center py-4'>
        {/* Hiển thị thông tin người dùng */}
        <Link to={path.adminProfile} className='flex flex-col gap-2 items-center'>
          <div className='h-14 w-14 flex overflow-hidden rounded-full border border-black/10'>
            <img src={getAvatarUrl(profile?.avatar)} alt='' className='h-full w-full object-cover' />
          </div>
          <span className=''>Hi!{profile.email}</span>
        </Link>

        {/* Hiển thị các mục menu từ dữ liệu đã có */}
        {data.map((data) => (
          <NavItem data={data} key={data.id} /> // Component NavItem sẽ hiển thị các mục menu
        ))}
        
        {/* Mục đăng xuất */}
        <div
          className='w-full flex items-center justify-start space-x-8 px-5 cursor-pointer
          group hover:border-rose-500 border-l-4 border-transparent'
        >
          <div className='flex gap-3 text-gray-600 w-full px-1'>
            <IoLogOut fontSize='24px' /> {/* Icon đăng xuất */}
            <button onClick={handleLogout} className='text-gray-600 text-[17px]'>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default SiderbarItem
