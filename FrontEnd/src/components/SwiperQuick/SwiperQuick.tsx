import { Swiper, SwiperSlide } from 'swiper/react' // Import các component Swiper và SwiperSlide từ thư viện Swiper
import { Navigation, Pagination } from 'swiper' // Import các module Navigation và Pagination từ Swiper

import 'swiper/swiper-bundle.css' // Import các kiểu mặc định của Swiper
import 'src/Styles/SwiperQuick.scss' // Import các kiểu tùy chỉnh cho Swiper từ file SCSS của ứng dụng

interface Props {
  product: any // Định nghĩa kiểu Props cho component, trong đó product là đối tượng chứa thông tin sản phẩm
}

function SwiperQuick({ product }: Props) {
  return (
    <>
      <Swiper
        spaceBetween={20} // Khoảng cách giữa các slide
        cssMode={true} // Bật chế độ CSS mode để điều khiển Swiper bằng CSS
        navigation={true} // Bật tính năng điều hướng (next/prev buttons)
        mousewheel={true} // Cho phép điều khiển Swiper bằng chuột (cuộn lên/xuống)
        keyboard={true} // Cho phép điều khiển Swiper bằng bàn phím (mũi tên trái/phải)
        pagination={{
          clickable: true // Bật tính năng phân trang, có thể nhấn vào các điểm phân trang (dots)
        }}
        modules={[Pagination, Navigation]} // Chỉ định các module Swiper cần sử dụng
        className='flex items-center justify-center w-[300] xl:w-[434] text-sm h-[300px] xl:h-[430px] pb-2 name' // Các lớp CSS để tạo kiểu cho Swiper
      >
        {/* Duyệt qua mảng images của sản phẩm để hiển thị từng hình ảnh trong Swiper */}
        {product.images.map((img: string, index: number) => {
          return (
            <SwiperSlide key={index}> {/* Mỗi hình ảnh là một SwiperSlide */}
              <img src={img} alt='' className='object-center object-cover w-full h-full' /> {/* Hiển thị hình ảnh */}
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}

export default SwiperQuick
