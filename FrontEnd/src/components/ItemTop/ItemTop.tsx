// Import các thành phần cần thiết từ thư viện Ant Design và các thành phần tùy chỉnh
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Modal } from 'antd'
import QuickView from '../QuickView' // Thành phần hiển thị chi tiết sản phẩm
import 'src/Styles/Header.scss' // File CSS của header
import path from 'src/constants/path' // Đường dẫn tĩnh của ứng dụng
import { formatCurrency, generateNameId, rateSale } from 'src/utils/utils' // Các hàm tiện ích
import ProductRating from '../ProductRating' // Thành phần hiển thị đánh giá sản phẩm

interface Props {
  products: any // Dữ liệu sản phẩm
}

export default function ItemTop({ products }: Props) {
  // Trạng thái để điều khiển việc hiển thị modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Hàm mở modal khi nhấn vào nút "Xem Nhanh"
  const showModal = () => {
    setIsModalOpen(true)
  }

  // Hàm đóng modal
  const handleOk = () => {
    setIsModalOpen(false)
  }

  // Hàm hủy đóng modal
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div className='relative h-full group w-[120px] md:w-[150px] lg:w-[260px] rounded-2xl bg-red-100 mb-7'>
      {/* Link dẫn đến trang chi tiết sản phẩm */}
      <Link
        to={`${path.home}${generateNameId({ name: products.name, id: products._id })}`}
        className=' h-[280px] lg:h-[419px] font '
        onClick={() => {
          window.scrollTo(0, 0) // Cuộn trang lên đầu khi nhấn vào sản phẩm
        }}
      >
        <div className='w-[120px] md:w-[150px] lg:w-[260px] flex flex-col justify-between gap-0 md:gap-5 items-center rounded-2xl shadow-gray-400/90 group-hover:shadow-lg'>
          <div className='flex-1 h-1/2  relative'>
            {/* Hình ảnh sản phẩm */}
            <img src={products?.image} alt='' className='w-full rounded-t-2xl' />
            
            {/* Hiển thị giảm giá nếu có */}
            {products.price_before_discount != products.price ? (
              <div className='absolute left-1 md:left-3 top-1 md:top-4 transform  w-[26px] h-[26px] md:w-[40px] md:h-[40px] bg-[#252322] text-white pl-1 py-[2px] md:px-1 md:py-2 rounded-full text-[9px] md:text-[12px] pl-1'>
                -{rateSale(products.price_before_discount, products.price)}
              </div>
            ) : (
              <div />
            )}
          </div>
          <div className='flex-1 h-1/2 mt-1'>
            <div className='flex flex-col gap-2 items-center justify-center md:px-6'>
              {/* Tên thương hiệu */}
              <div className='leading-3 text-[10px] lg:text-sm font-semibold text-black'>{products?.brand?.name}</div>
              {/* Tên sản phẩm */}
              <div className='text-[8px] md:text-[12px] line-clamp-2 px-4 md:px-0 text-center leading-relaxed font-normal text-black'>
                {products?.name}
              </div>

              {/* Giá sản phẩm và giá cũ nếu có */}
              <div className='text-[9px] md:text-[10px] lg:text-[13px] flex-row lg:flex justify-center mt-1 lg:mt-0 gap-0 md:gap-3 md:px-3 items-center'>
                {products.price_before_discount !== products.price ? (
                  <>
                    <div className='font-semibold text-black'>{formatCurrency(products.price)}đ</div>
                    <div className='font-medium text-gray-400 line-through'>
                      {formatCurrency(products.price_before_discount)}đ
                    </div>
                    {/* Hiển thị phần trăm giảm giá */}
                    <div className='relative bg-[#c73030] w-[30px] h-[15px] mx-1 flex justify-center items-center rounded-full'>
                      <div className='absolute text-gray-100 text-[11px] p-1'>
                        -{rateSale(products.price_before_discount, products.price)}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='font-semibold text-black '>{formatCurrency(products.price)}đ</div>
                )}
              </div>
              
              {/* Đánh giá và số lượng bán */}
              <div className='flex gap-1 mt-1 px-1 md:px-3 text-gray-300 items-center justify-center pb-1'>
                <ProductRating rating={products.rating} />
                <span className='text-black  ml-1 md:ml-2 text-[10px] md:text-xs'>({products.sold})</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Nút "Xem Nhanh" */}
      <button
        className='absolute top-1/3 left-1/2 md:left-1/2 lg:left-1/2 translate-x-[-50%] translate-y-[-50%] hidden group-hover:block bg-[#121010b6] text-gray-100 text-[8px] lg:text-[13px] px-2 ld:px-4 py-1 lg:py-3 font-bold rounded-full hover:bg-gradient-to-r from-[#f0a80edb] via-[#c43131d8] to-[#671f57d1]'
        onClick={showModal}
      >
        Xem Nhanh
      </button>

      {/* Modal hiển thị thông tin chi tiết sản phẩm */}
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1100} footer={null}>
        <QuickView product={products} />
      </Modal>
    </div>
  )
}
