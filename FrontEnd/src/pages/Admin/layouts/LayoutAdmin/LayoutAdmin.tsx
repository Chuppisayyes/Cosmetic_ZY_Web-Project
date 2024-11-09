import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import SiderbarItem from 'src/components/SiderbarItem'
import path from 'src/constants/path'

export default function LayoutAdmin() {
  return (
    <div className='h-full bg-slate-500 xl:bg-transparent'>
      <div className='h-full flex justify-center items-center xl:hidden'>
        <div className='bg-orange-100'>
          <div className='bg-red-700 text-white text-center py-5 px-10 text-[16px] md:text-[25p] font-bold '>
            CẢNH BÁO !
          </div>
          <h1 className='text-red-700 my-5 text-[16px] md:text-[25px] px-5'>
            <b>Chức Năng Này Không Hỗ trợ trên Mobile</b>
          </h1>
          <h5 className='text-[14px] md:text-[18px] px-5'><b>Vui lòng thử lại trên máy tính!</b></h5>
          <button
            className='text-red-700 checkout-button mx-5 my-5 bg-gradient-to-r border-2 border-red-700 py-3 px-5 rounded-md  font-semibold'
            type='submit'
          >
            <Link to={path.home}>
              Quay về trang chủ
            </Link>
          </button>
        </div>
      </div>
      <div className='hidden xl:grid grid-cols-1 gap-6 md:grid-cols-12 h-full my-4 mx-10 text-sm '>
        <div className='col-span-3 items-center place-items-center'>
          <SiderbarItem></SiderbarItem>
        </div>
        <div className='col-span-9 '>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
