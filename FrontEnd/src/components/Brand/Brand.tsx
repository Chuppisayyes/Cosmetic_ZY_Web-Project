// Import các module và thư viện cần thiết
import { FC } from 'react' // Import FC (Functional Component) từ React
import { Swiper, SwiperSlide } from 'swiper/react' // Import các thành phần Swiper từ thư viện Swiper
import { Navigation } from 'swiper' // Import Navigation module để thêm tính năng điều hướng
import 'swiper/swiper-bundle.css' // Import CSS mặc định của Swiper
import ItemBrand from '../ItemBrand' // Import component ItemBrand để hiển thị từng thương hiệu

// Import các hình ảnh thương hiệu từ thư mục assets
import brand1 from 'src/assets/Brands/brand1.webp'
import brand11 from 'src/assets/Brands/brand11.webp'
import brand3 from 'src/assets/Brands/brand3.webp'
import brand4 from 'src/assets/Brands/brand4.webp'
import brand5 from 'src/assets/Brands/brand5.webp'
import brand12 from 'src/assets/Brands/brand12.webp'
import brand7 from 'src/assets/Brands/brand7.webp'
import brand13 from 'src/assets/Brands/brand13.webp'
import brand14 from 'src/assets/Brands/brand14.webp'

// Định nghĩa interface AppProps (nếu cần thêm props sau này)
interface AppProps { }

// Tạo component FlashSale
const FlashSale: FC<AppProps> = () => {
  return (
    <>
      <Swiper
        slidesPerView={5} // Số lượng slide hiển thị đồng thời (mặc định)
        spaceBetween={-120} // Khoảng cách giữa các slide
        navigation={true} // Bật điều hướng (mũi tên trái/phải)
        mousewheel={true} // Bật tính năng cuộn bằng chuột
        keyboard={true} // Cho phép điều hướng bằng bàn phím
        modules={[Navigation]} // Sử dụng module Navigation
        className='w-full py-4' // CSS class tùy chỉnh
        breakpoints={{
          // Các breakpoint để responsive số lượng slide hiển thị
          375: { slidesPerView: 3 }, // 3 slide hiển thị trên màn hình rộng 375px
          414: { slidesPerView: 4 }, // 4 slide hiển thị trên màn hình rộng 414px
          640: { slidesPerView: 4 }, // 4 slide hiển thị trên màn hình rộng 640px
          768: { slidesPerView: 4 }, // 4 slide hiển thị trên màn hình rộng 768px
          1024: { slidesPerView: 5 }, // 5 slide hiển thị trên màn hình rộng 1024px
        }}
      >
        {/* Các SwiperSlide chứa từng thương hiệu */}
        <SwiperSlide>
          <ItemBrand id='663fa15e75541b57cc785393' img={brand1} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemBrand id='663fa87cca512521545e9e11' img={brand11} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemBrand id='663fa818ca512521545e9e0e' img={brand3} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemBrand id='664385b66c8d17a1659f7c38' img={brand4} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemBrand id='663fa4031e72c25cec57b97d' img={brand5} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemBrand id='663fa91fca512521545e9e1d' img={brand12} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemBrand id='663fa99eac2b524e4ca413f1' img={brand7} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemBrand id='664260ef8d0f5320971c1374' img={brand13} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemBrand id='663fa8ecca512521545e9e1a' img={brand14} />
        </SwiperSlide>
      </Swiper>
    </>
  )
}

// Xuất component FlashSale để sử dụng trong các phần khác của ứng dụng
export default FlashSale
