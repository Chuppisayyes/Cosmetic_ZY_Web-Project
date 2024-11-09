import { Swiper, SwiperSlide } from 'swiper/react'  // Nhập các component cần thiết từ thư viện Swiper
import { Navigation, Pagination } from 'swiper'  // Nhập các module Navigation và Pagination từ Swiper
import 'swiper/swiper-bundle.css'  // Import CSS của Swiper để hiển thị giao diện
import ItemTop from '../ItemTop'  // Component hiển thị sản phẩm
import { Product } from 'src/types/product.type'  // Import kiểu dữ liệu Product
import { useEffect, useState } from 'react'  // Import các hook của React

// Định nghĩa kiểu dữ liệu cho Props và Item
interface Props {
  data?: any  // Dữ liệu sản phẩm (có thể là bất kỳ kiểu dữ liệu nào)
  product?: Product  // Sản phẩm, kiểu dữ liệu là Product
  name?: string  // Tên để xác định tiêu chí sắp xếp
}

interface Item {
  sold: number  // Số lượng đã bán
  view: number  // Số lượt xem
  createdAt: string  // Thời gian tạo sản phẩm
}

function ProductTop({ data, name }: Props) {
  const [listItem, setListItem] = useState<Item[]>([])  // State để lưu trữ danh sách sản phẩm

  // Hàm lấy dữ liệu sản phẩm
  const fectchBannerItem = async () => {
    if (data) {
      setListItem(data)  // Cập nhật danh sách sản phẩm nếu có dữ liệu
    }
  }

  // Dùng useEffect để gọi hàm fectchBannerItem khi component được render
  useEffect(() => {
    fectchBannerItem()
  }, [])  // Mảng phụ thuộc rỗng để chỉ gọi hàm này khi component được mount lần đầu tiên

  return (
    <>
      <Swiper
        slidesPerView={3}  // Mặc định hiển thị 3 slide
        spaceBetween={10}  // Khoảng cách giữa các slide
        navigation={true}  // Hiển thị nút điều hướng
        mousewheel={true}  // Cho phép điều khiển slide bằng cuộn chuột
        keyboard={true}  // Cho phép điều khiển slide bằng bàn phím
        pagination={{ clickable: true }}  // Hiển thị phân trang và cho phép click vào các điểm phân trang
        modules={[Pagination, Navigation]}  // Sử dụng các module Pagination và Navigation
        className=' w-10/12  text-sm py-4'  // Định kiểu cho Swiper
        breakpoints={{
          // Các breakpoints để thay đổi số lượng slide hiển thị tùy vào kích thước màn hình
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >
        {/* Kiểm tra nếu danh sách sản phẩm có dữ liệu */}
        {listItem?.length > 0 &&
          listItem
            .slice()  // Tạo bản sao của mảng để không thay đổi mảng gốc
            .sort((a, b) => {
              // Sắp xếp danh sách sản phẩm theo tiêu chí name
              if (name === 'sold') {
                return b.sold - a.sold  // Sắp xếp theo số lượng đã bán
              } else if (name === 'view') {
                return b.view - a.view  // Sắp xếp theo số lượt xem
              } else if (name === 'createdAt') {
                // Sắp xếp theo ngày tạo sản phẩm
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              }
              return 0  // Nếu name không phải là 'sold', 'view' hay 'createdAt', không sắp xếp
            })
            .slice(0, 10)  // Lấy 10 sản phẩm đầu tiên sau khi sắp xếp
            .map((product, index) => (
              <SwiperSlide key={index}>
                <ItemTop products={product} />  {/* Hiển thị từng sản phẩm trong ItemTop */}
              </SwiperSlide>
            ))}
      </Swiper>
    </>
  )
}

export default ProductTop  // Xuất component ProductTop
