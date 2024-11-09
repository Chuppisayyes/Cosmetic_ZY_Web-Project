// Import các thư viện cần thiết
import { Link } from 'react-router-dom'                  // Nhập Link từ react-router-dom để tạo các liên kết
import { FaTwitter, FaFacebookF } from 'react-icons/fa'  // Nhập các icon mạng xã hội từ react-icons
import { IoLogoGoogle } from 'react-icons/io'
import { PiInstagramLogoBold } from 'react-icons/pi'
import { IoLogoYoutube } from 'react-icons/io5'
import 'src/Styles/Footer.scss'                          // Nhập CSS tùy chỉnh cho Footer
import logo from 'src/assets/logo.png'                   // Nhập hình ảnh logo

// Định nghĩa component Footer
function Footer() {
  return (
    <footer className="bg-[url('https://bizweb.dktcdn.net/100/336/334/themes/939194/assets/bg_cosmetics.jpg?1706112573342')] bg-center bg-no-repeat bg-cover">
      {/* Nội dung của Footer được căn giữa và có khoảng cách padding ở trên dưới */}
      <div className='grid place-items-center py-9 font'>
        <div className='py-[30px] px-[20px] mx-auto'>
          <div className='md:flex flex-row xl:gap-12 text-white'>
            
            {/* Logo và Thông tin giới thiệu */}
            <div className='flex-grow-1'>
              <div className=' mb-4 mt-[-40px] '>
                <Link to='/' className='flex justify-center items-center md:flex-none md:justify-start logo-wrapper'>
                  <img src={logo} alt='logo' className='xl:w-[240px] w-[120px] xl:h-[80px] h-[50px] md:w-[120px] md:h-[60px]' />
                </Link>
              </div>
              <div className='mb-6'>
                <h4 className='flex flex-col gap-1 xl:text-base text-[12px] md:text-sm'>
                  <span>Shop mỹ phẩm Cool Beauty</span>
                  <span> Làm đẹp trở nên dễ dàng hơn</span>
                </h4>
                <div className='my-5'>
                  <ul className='flex flex-col gap-3 text-[12px]'>
                    <li>Địa chỉ: Phường 8, Quận 3, T.Phố Hồ Chí Minh</li>
                    <li>
                      Hotline: <Link className='hai01' to='tel:19006750'>1900 6750</Link>
                    </li>
                    <li>
                      Email: <a href='mailto:coolteam@gmail.com'>vannguyen.312211024163@st.ueh.edu.vn</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Menu Hỗ trợ khách hàng */}
            <div className='flex-grow-1 mt-1 md:mt-0'>
              <div className='flex gap-2 text-white'>
                <div>
                  <h4 className='font-semibold'>
                    <Link to='/' className='uppercase'>Hỗ trợ khách hàng</Link>
                  </h4>
                  <div className='text-white mt-4' id='collapseListMenu01'>
                    <ul className='flex flex-col gap-3 text-gray-400'>
                      <li className='li_menu hover:text-rose-200'><Link to='/'>Trang chủ</Link></li>
                      <li className='li_menu hover:text-rose-200'><Link to='/gioi-thieu'>Giới thiệu</Link></li>
                      <li className='li_menu hover:text-rose-200'><Link to='/collections/all'>Sản phẩm</Link></li>
                      <li className='li_menu hover:text-rose-200'><Link to='/san-pham-hot'>Khuyến mãi hot</Link></li>
                      <li className='li_menu hover:text-rose-200'><Link to='/tin-tuc'>Tin tức</Link></li>
                      <li className='li_menu hover:text-rose-200'><Link to='/lien-he'>Liên hệ</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Chính sách */}
            <div className='flex-grow-1 mt-2 md:mt-0'>
              <div className='flex gap-2 text-white'>
                <div>
                  <h4 className='uppercase mb-4 font-semibold'>
                    <Link to='/'>Chính sách</Link>
                  </h4>
                  <div className='text-white' id='collapseListMenu02'>
                    <ul className='flex flex-col gap-3 text-gray-400'>
                      <li className='li_menu hover:text-rose-200'><Link to='/collections/all'>Chính sách đổi trả</Link></li>
                      <li className='li_menu hover:text-rose-200'><Link to='/san-pham-hot'>Chính sách vận chuyển</Link></li>
                      <li className='li_menu hover:text-rose-200'><Link to='/tin-tuc'>Chính sách bảo mật</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Kết nối mạng xã hội và Phương thức thanh toán */}
            <div className='flex-grow-1 mt-2 md:mt-0'>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-5'>
                  <h4 className='uppercase font-semibold'>Kết nối với chúng tôi</h4>
                  <div className='flex mt-3 gap-4 text-white text-3xl'>
                    <Link to='/'><FaFacebookF className='hover:bg-rose-300 border rounded-full border-white p-[6px]' /></Link>
                    <Link to='/'><FaTwitter className='hover:bg-rose-300 border rounded-full border-white p-[6px]' /></Link>
                    <Link to='/'><IoLogoGoogle className='hover:bg-rose-300 border rounded-full border-white p-[6px]' /></Link>
                    <Link to='/'><PiInstagramLogoBold className='hover:bg-rose-300 border rounded-full border-white p-[6px]' /></Link>
                    <Link to='/'><IoLogoYoutube className='hover:bg-rose-300 border rounded-full border-white p-[6px]' /></Link>
                  </div>
                </div>
                <div className='flex flex-col gap-5 mt-5'>
                  <h4 className='uppercase font-semibold'>Phương thức thanh toán</h4>
                  <div>
                    <Link to='/'>
                      <img
                        src='https://bizweb.dktcdn.net/100/336/334/themes/939194/assets/i_payment.png?1706112573342'
                        alt='Các phương thức thanh toán'
                        className='w-[230px] h-[65px] ml-[-14px]'
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
