import { FC } from 'react' // Import FC từ React, để định nghĩa một component kiểu function component
import { Swiper, SwiperSlide } from 'swiper/react' // Import các component Swiper và SwiperSlide từ thư viện Swiper
import { Navigation, Pagination } from 'swiper' // Import các module Navigation và Pagination từ Swiper

import 'swiper/swiper-bundle.css' // Import file CSS của Swiper để áp dụng các kiểu mặc định
import 'src/Styles/SwiperCustom.scss' // Import các kiểu tùy chỉnh cho Swiper từ file SCSS của ứng dụng

interface AppProps {} // Định nghĩa kiểu Props cho component (trong trường hợp này không có Props)

const Banner: FC<AppProps> = () => {
  return (
    <>
      <Swiper
        spaceBetween={30} // Khoảng cách giữa các slide
        cssMode={true} // Bật chế độ CSS mode để điều khiển Swiper bằng CSS
        navigation={true} // Bật tính năng điều hướng (next/prev buttons)
        mousewheel={true} // Cho phép điều khiển Swiper bằng chuột (cuộn lên/xuống)
        keyboard={true} // Cho phép điều khiển Swiper bằng bàn phím (mũi tên trái/phải)
        pagination={{
          clickable: true // Bật tính năng phân trang, có thể nhấn vào các điểm phân trang (dots)
        }}
        modules={[Pagination, Navigation]} // Chỉ định các module Swiper cần sử dụng
        className='h-full w-full justify-center productSale-Font' // Các lớp CSS để tạo kiểu cho Swiper
      >
        {/* Các SwiperSlide chứa hình ảnh, mỗi SwiperSlide là một trang trong carousel */}
        <SwiperSlide className='flex w-full items-center justify-center h-full'>
          <img src='swiper1.webp' alt='' className='rounded-md' /> {/* Hình ảnh đầu tiên */}
        </SwiperSlide>
        <SwiperSlide className='flex w-full items-center justify-center h-full'>
          <img src='swiper.webp' alt='' className='rounded-md' /> {/* Hình ảnh thứ hai */}
        </SwiperSlide>
        <SwiperSlide>
          <img src='swiper2.webp' alt='' className='rounded-md' /> {/* Hình ảnh thứ ba */}
        </SwiperSlide>
        <SwiperSlide>
          <img src='swiper3.webp' alt='' className='rounded-md h-[340px]' /> {/* Hình ảnh thứ tư */}
        </SwiperSlide>
        <SwiperSlide>
          <img src='swiper4.webp' alt='' className='rounded-md' /> {/* Hình ảnh thứ năm */}
        </SwiperSlide>
        <SwiperSlide>
          <img src='swiper5.webp' alt='' className='rounded-md' /> {/* Hình ảnh thứ sáu */}
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default Banner
