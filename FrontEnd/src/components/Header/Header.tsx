// Import các thư viện và thành phần cần thiết
import { Link } from 'react-router-dom' // Dùng để tạo các liên kết điều hướng trong ứng dụng
import logo from 'src/assets/logo.png' // Import logo để hiển thị trên trang
import 'src/Styles/Header.scss' // Import file CSS cho phần header

import Popover from '../Popover' // Import component Popover dùng để hiển thị pop-up thông báo

// Import các hook và context cần thiết
import { useContext, useEffect, useState } from 'react' // Dùng để quản lý trạng thái và hiệu ứng trong component
import { useMutation, useQuery } from 'react-query' // Dùng để làm việc với dữ liệu bất đồng bộ (fetch data từ API)
import { AppContext } from 'src/contexts/app.contexts' // Import context để quản lý trạng thái toàn cục của ứng dụng
import path from 'src/constants/path' // Import các đường dẫn cho các page trong ứng dụng
import { FaPhone } from 'react-icons/fa6' // Import icon điện thoại
import authApi from 'src/apis/auth.api' // API để làm việc với xác thực người dùng
import { formatCurrency, getAvatarUrl } from 'src/utils/utils' // Các hàm tiện ích như định dạng tiền tệ và lấy URL avatar
import { purchasesStatus } from 'src/constants/purchase' // Các trạng thái của đơn hàng
import purchaseApi from 'src/apis/purchase.api' // API để lấy thông tin đơn hàng
import useSearchProducts from 'src/hooks/useSearchProducts' // Hook để tìm kiếm sản phẩm

import { PiBellRingingBold } from 'react-icons/pi' // Import icon chuông thông báo
import paymentApi from 'src/apis/payment.api' // API để lấy thông tin thanh toán

const MAX_PURCHASES = 5 // Số lượng đơn hàng tối đa được hiển thị trong thông báo

// Component Header
function Header() {
  // Truy cập vào context để lấy thông tin người dùng và các chức năng quản lý trạng thái
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)
  
  // Các state cần thiết trong component
  const [notifications, setNotifications] = useState<string[]>([]) // Lưu trữ thông báo
  const [viewedPayments, setViewedPayments] = useState<string[]>([]) // Lưu trữ các payment đã xem
  const [isVisible, setIsVisible] = useState(true) // Quản lý việc hiển thị thông báo
  
  // Mutation để xử lý việc đăng xuất
  const logoutMutation = useMutation({
    mutationFn: authApi.logout, // API logout
    onSuccess: () => {
      setIsAuthenticated(false) // Đặt lại trạng thái xác thực sau khi logout
      setProfile(null) // Đặt lại thông tin profile sau khi logout
    }
  })

  // Hàm xử lý khi người dùng muốn đăng xuất
  const handleLogout = () => {
    logoutMutation.mutate() // Gọi mutation để đăng xuất
  }

  // Các query để lấy dữ liệu từ API (giỏ hàng, thanh toán)
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }], // Lấy dữ liệu giỏ hàng
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }), // API lấy giỏ hàng
    enabled: isAuthenticated // Chỉ gọi query khi người dùng đã đăng nhập
  })
  const { data: paymentData } = useQuery({
    queryKey: ['payment'],
    queryFn: () => paymentApi.getPayment(), // API lấy dữ liệu thanh toán
    enabled: isAuthenticated
  })
  
  // Hàm và hook để xử lý tìm kiếm sản phẩm
  const { onSubmitSearch, register } = useSearchProducts()

  // Biến lưu trữ giỏ hàng và thông tin thanh toán
  const purchasesInCart = purchasesInCartData?.data.data
  const paymentDataProfile = paymentData?.data.data

  // Các useEffect để xử lý thông báo khi có thay đổi về thanh toán hoặc giỏ hàng
  useEffect(() => {
    setNotifications([]) // Reset notifications khi trạng thái xác thực thay đổi
    setViewedPayments([]) // Reset các payment đã xem khi trạng thái xác thực thay đổi
  }, [isAuthenticated])

  useEffect(() => {
    // Xử lý thông báo mới khi có payment thay đổi trạng thái
    if (profile && paymentData && Array.isArray(paymentData.data.data) && paymentData.data.data.length > 0) {
      paymentData.data.data.forEach((payment) => {
        if (!viewedPayments.includes(payment._id)) {
          let statusText

          // Xử lý trạng thái của payment
          switch (payment.status) {
            case 1:
              statusText = 'Đang chờ xác nhận'
              break
            case 2:
              statusText = 'Đang chuẩn bị'
              break
            case 3:
              statusText = 'Đợi vận chuyển'
              break
            case 4:
              statusText = 'Đang giao'
              break
            case 5:
              statusText = 'Thành công'
              break
          }

          // Tạo thông báo mới và thêm vào danh sách notifications
          const newNotification = `<div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <img
            src=${payment.purchases[0].product.image}
            alt='hihi'
            style="width: 70px; border-radius: 8px; border: 2px solid #ccc;"
          />
          <div style="flex: 60%;">
            Đơn hàng mã
            <strong className='truncate mx-1'>${payment._id}</strong>
            đã thay đổi trạng thái
            <strong className='truncate ml-1'>${statusText}</strong>
          </div>
</div>`

          setNotifications([...notifications, newNotification]) // Thêm thông báo mới vào danh sách
          setViewedPayments([...viewedPayments, payment._id]) // Đánh dấu payment đã xem
        }
      })
    }
  }, [paymentData, viewedPayments])

  useEffect(() => {
    // Hiển thị thông báo trong 3 giây
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false) // Ẩn thông báo sau 3 giây
    }, 3000)

    return () => {
      clearTimeout(timer) // Xóa timer khi component unmount hoặc isVisible thay đổi
    }
  }, [])

  return (
    <header className='font p-10 lg:p-5 '>
      <div className='fixed top-0 left-1/2 transform -translate-x-1/2 mt-16 w-64 rounded-md overflow-hidden bg-white shadow-lg opacity-0 transition-opacity duration-500 ease-in-out'>
        <div className='relative bg-blue-500 py-2'>
          <div className='w-2 h-2 bg-blue-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 animate-ping'></div>
        </div>
        <div className={`py-4 px-6 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
          <p className='text-gray-800'>hihi</p>
        </div>
      </div>
      <div className='flex justify-center items-center '>
        <div className=' xl:hidden logo xl:w-1/6 sm:w-1/8'>
          <Link to={path.home}>
            <img src={logo} alt='' className='xl:w-[240px] w-[100px] xl:h-[80px] h-[50px]' />
          </Link>
        </div>
      </div>
      <div className='flex-row xl:flex xl:py-5 lg:py-3 xl:px-8   items-center xl:gap-12 lg:gap-6 sm:gap-2 justify-between lg:justify-center'>
        <div className='hidden xl:inline logo xl:w-1/6 sm:w-1/8'>
          <Link to={path.home}>
            <img src={logo} alt='' className='xl:w-[240px] w-[100px] xl:h-[80px] h-[50px]' />
          </Link>
        </div>
        <div className='hidden search w-3/8 lg:w-2/5  xl:flex flex-col lg:gap-2 '>
          <form className=' mt-4' onSubmit={onSubmitSearch}>
            <div className='bg-gray-100 rounded-sm p-1 flex rounded-l-3xl rounded-r-3xl  h-9 '>
              <input
                type='text'
                {...register('name')}
                className='text-black px-3 flex-grow border-none outline-none bg-transparent'
                placeholder='search'
              />
              <button className='py-2 px-6 flex-shrink-0 bg-red-300 hover:opacity-90 rounded-r-3xl '>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-[14px]'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                  />
                </svg>
              </button>
            </div>
          </form>
          <div className='xl:flex xl:flex-wrap xl:gap-3 xl: xl:text-xs xl:ml-2 hidden'>
            <Link to='/' className='text-gray-400 hover:text-red-400'>
              <span>Vận chuyển nhanh</span>
            </Link>
            <Link to='/' className='text-gray-400 hover:text-red-400'>
              <span>Sản phẩm chất lượng</span>
            </Link>
            <Link to='/' className='text-gray-400 hover:text-red-400'>
              <span>Hoàn trả trong 7 ngày</span>
            </Link>
          </div>
        </div>
        <div className='flex justify-around items-center w-full xl:w-3/5 '>
          <div className='hidden xl:inline'>
            <Link to='/'>
              {' '}
              <div className='flex flex-wrap gap-3 items-center text-red-400'>
                <FaPhone className='text-1xl sm:text-3xl' />
                <div className='flex flex-col gap-1 '>
                  <span className='text-gray-400 font-medium md:text-sm hidden '>Hỗ trợ khách hàng</span>
                  <span className='text-gray-500 font-semibold md:text-sm hidden'>1950.6750</span>
                </div>
              </div>
            </Link>
          </div>
          <div className='flex-grow-1'>
            <div className='flex justify-center items-center flex-wrap xl:gap-3'>
              {profile?.roles.includes('Admin') ? (
                <Link to={path.dashboard}>
                  <img
                    src={getAvatarUrl(profile?.avatar)}
                    alt=''
                    className=' md:h-[32px] h-[25px] w-[25px] md:w-[32px] mt-1 border-2 border-rose-400 rounded-full '
                  />
                </Link>
              ) : (
                <img
                  src={getAvatarUrl(profile?.avatar)}
                  alt=''
                  className='md:h-[32px] h-[25px] w-[25px] md:w-[32px] mt-1 border-2 border-rose-400 rounded-full '
                />
              )}
              {isAuthenticated && (
                <div className='flex flex-col justify-center mt-1'>
                  <Link to={path.profile}>
                    {' '}
                    <span className='text-gray-500'>Hi ! {profile?.email}</span>
                  </Link>
                  <div className='flex flex-wrap gap-1'>
                    <button onClick={handleLogout} className='text-gray-500 text-xs mt-1 md:mt-0 hover:text-red-400 '>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
              {!isAuthenticated && (
                <div className='flex flex-col md:items-start justify-center md:mx-2 mt-1 '>
                  <span className='text-gray-500 font-semibold'>Tài Khoản</span>
                  <div className='flex flex-wrap gap-1 justify-center items-center'>
                    <Link to={path.login}>
                      <span className='text-gray-500 text-xs hover:text-red-400 '>Đăng Nhập </span>
                    </Link>
                    <span className='text-gray-500 text-sm pt-[-16px]'>|</span>
                    <Link to={path.register}>
                      <span className='text-gray-500 text-xs hover:text-red-400  '>Đăng Ký </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='mx-5 md:mx-5'>
            <Popover
              renderPopover={
                <div className='bg-white relative shadow-md rounded-lg border border-gray-200 max-w-[400px] text-sm mr-3 font'>
                  {isAuthenticated ? (
                    <div className='flex h-[300px] w-[350px] overflow-auto'>
                      {notifications.length > 0 ? (
                        <div className='flex flex-col gap-1'>
                          {notifications.map((notification, index) => (
                            <Link to={path.hitoryPurchase} key={index} className='hover:bg-gray-200 w-full p-2  '>
                              <div>
                                <div className='flex ' dangerouslySetInnerHTML={{ __html: notification } as any} />
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className='flex h-[300px] w-[300px] overflow-auto'>
                          <img
                            src='https://theyouthproject.in/static/media/empty_data_set.88c7d759.png'
                            alt='no purchase'
                            className='h-full w-full '
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='flex h-[300px] w-[300px] overflow-auto'>
                      <img
                        src='https://theyouthproject.in/static/media/empty_data_set.88c7d759.png'
                        alt='no purchase'
                        className='h-full w-full '
                      />
                    </div>
                  )}
                </div>
              }
            >
              <button className='flex-grow-1 relative'>
                <PiBellRingingBold fontSize={28} />
                {isAuthenticated && paymentDataProfile && (
                  <span className='absolute top-[-5px] left-[17px] rounded-full w-[14px] h-[14px]  bg-red-600 text-white '></span>
                )}
              </button>
            </Popover>
          </div>
          <Popover
            renderPopover={
              <div className='bg-white relative shadow-md rounded-lg border border-gray-200 max-w-[350px] md:max-w-[400px] text-sm mr-3 font'>
                {isAuthenticated && purchasesInCart && purchasesInCart.length > 0 ? (
                  <div className='p-2'>
                    <div className='capitalize text-gray-400'>Sản phẩm mới thêm</div>
                    <div className='mt-5'>
                      {purchasesInCart.slice(0, MAX_PURCHASES).map((purchase) => (
                        <div className='mt-2 flex py-2 hover:bg-gray-100' key={purchase._id}>
                          <div className='flex-shrink-0'>
                            <img
                              src={purchase.product.image}
                              alt={purchase.product.name}
                              className='h-11 w-11 object-cover rounded-md'
                            />
                          </div>
                          <div></div>
                          <div className='sm:ml-2 flex-grow overflow-hidden'>
                            <div className='truncate text-[10px]'>{purchase.product.name}</div>
                          </div>
                          <div className='sm:ml-2 '>
                            <span className='bg-clip-text text-[13px]  text-transparent bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57] font-semibold'>
                              {formatCurrency(purchase.product.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='mt-6 flex items-center justify-between'>
                      <div className='text-xs capitalize text-gray-500'>
                        {purchasesInCart.length > MAX_PURCHASES ? purchasesInCart.length - MAX_PURCHASES : ''} Thêm hàng
                        vào giỏ
                      </div>
                      <Link
                        to={path.cart}
                        className='capitalize bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57] text-white text-base px-4 py-2 rounded-lg '
                      >
                        Xem giỏ hàng
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className='flex h-[300px] w-[300px] flex-col  items-center justify-center p-2'>
                    <img
                      src='https://fansport.vn/default/template/img/cart-empty.png'
                      alt='no purchase'
                      className='h-28 w-28 '
                    />
                    <div className='mt-3 capitalize'> Không có sản phẩm</div>
                  </div>
                )}
              </div>
            }
          >
            <Link to={path.cart} className='relative'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-8 w-8'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                />
              </svg>
              {isAuthenticated && purchasesInCart && purchasesInCart.length > 0 && (
                <span className='absolute top-[-5px] left-[17px] rounded-full px-[7px] py-[2px]  w-[20px] h-[20px] text-[12px] bg-red-500 text-white  '>
                  {purchasesInCart?.length}
                </span>
              )}
            </Link>
          </Popover>
        </div>
      </div>
    </header>
  )
}

export default Header
