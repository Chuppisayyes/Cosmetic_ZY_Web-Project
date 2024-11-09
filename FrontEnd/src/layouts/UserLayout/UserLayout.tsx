import { Outlet } from 'react-router-dom'  // Nhập Outlet từ react-router-dom để hiển thị các route con
import UserSideNav from '../../components/UserSideNav'  // Nhập component UserSideNav từ thư mục components

export default function UserLayout() {
  return (
    <div className='gap-2 my-4 mx-5 md:mx-20 text-sm text-gray-600'>
      {/* Container chính chứa nội dung */}
      <div className='container'>
        <div className='xl:grid xl:grid-cols-12 gap-6'>
          {/* Phân chia layout theo dạng lưới (grid) với 12 cột */}
          <div className='col-span-3 items-center place-items-center'>
            {/* Sidebar của người dùng chiếm 3 cột trong lưới */}
            <UserSideNav />  {/* Hiển thị UserSideNav bên trái */}
          </div>
          <div className='col-span-9 '>
            {/* Nội dung chính chiếm 9 cột trong lưới */}
            <Outlet />  {/* Hiển thị nội dung của các route con */}
          </div>
        </div>
      </div>
    </div>
  )
}
