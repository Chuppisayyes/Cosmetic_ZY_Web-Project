// Import file CSS cho header
import 'src/Styles/Header.scss'

function NavHeader() {
  return (
    // Phần header có nền gradient, các dòng thông tin khuyến mãi
    <div className='bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57] flex xl:gap-8 lg:gap-6 md:gap-4 sm:gap-4 text-[13px] md:text-[10px] sm:text-[10px] text-[8px] gap-4 p-2 text-gray-100 lg:py-2 lg:px-10 sm:py-2 sm:px-10 justify-center items-center font'>
      
      {/* Thông tin giảm giá */}
      <div className=''>Nhập SUMMER50K GIẢM 50K</div>
      
      {/* Dấu phân cách giữa các thông tin */}
      <div className='text-[15px] mt-[-5px]'>.</div>
      
      {/* Thông tin khuyến mãi "Mua online giá hời chưa từng có" */}
      <div className=''>Mua online giá hời chưa từng có</div>
      
      {/* Dấu phân cách giữa các thông tin */}
      <div className='text-[15px] mt-[-5px]'>.</div>
      
      {/* Thông tin freeship */}
      <div className=''>Freeship 24H</div>
    </div>
  )
}

export default NavHeader
