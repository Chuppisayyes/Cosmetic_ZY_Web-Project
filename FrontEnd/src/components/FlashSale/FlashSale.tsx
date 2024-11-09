import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper'

import 'swiper/swiper-bundle.css'
import ProductSale from '../ProductSale'
import { Product } from 'src/types/product.type'
interface Props {
  data?: any
  product?: Product
}

function FlashSale({ data }: Props) {
  const [listItem, setListItem] = useState([])
  const fectchBannerItem = async () => {
    if (data) {
      setListItem(data)
    }
  }
  useEffect(() => {
    fectchBannerItem()
  }, [])

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={-60}
        navigation={true}
        mousewheel={true}
        keyboard={true}
        pagination={{
          clickable: true
        }}
        modules={[Pagination, Navigation]}
        className=' w-5/6 lace-items-center text-sm py-5 md:pb-10'
        breakpoints={{
          // Responsive breakpoints
          375: {slidesPerView: 1 },
          414: {slidesPerView: 2 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {listItem?.length > 0 &&
          listItem.slice(0, 21).map((product: Product, index) => {
            if (product.price_before_discount != product.price) {
              return (
                <SwiperSlide key={index}>
                  <ProductSale product={product} />
                </SwiperSlide>
              )
            }
            return null // Nếu sản phẩm không phù hợp điều kiện, trả về null
          })}
      </Swiper>
    </>
  )
}

export default FlashSale
