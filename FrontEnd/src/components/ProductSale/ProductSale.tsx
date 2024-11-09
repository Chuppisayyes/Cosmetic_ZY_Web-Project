// import { Progress, ProgressProps } from 'antd'
import { Link } from 'react-router-dom'

import { Modal } from 'antd'
import QuickView from '../QuickView'
import { useState } from 'react'
import path from 'src/constants/path'
import { formatCurrency, generateNameId, rateSale } from 'src/utils/utils'
import ProductRating from '../ProductRating'

interface Props {
  product: any  // Định nghĩa kiểu cho thuộc tính sản phẩm
}

export default function ProductSale({ product }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)  // State để kiểm soát việc hiển thị modal

  // Hàm hiển thị modal
  const showModal = () => {
    setIsModalOpen(true)
  }

  // Hàm đóng modal
  const handleOk = () => {
    setIsModalOpen(false)
  }

  // Hàm hủy bỏ modal
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div className='xl:relative xl:h-full xl:group'>  {/* Container bao quanh sản phẩm */}
      <Link
        to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}  // Link đến trang chi tiết sản phẩm
        className=' p-5 h-[22px]  xl:h-[422px]'  // Định kiểu cho link
        onClick={() => {
          window.scrollTo(0, 0)  // Cuộn trang lên trên khi nhấp vào link
        }}
      >
        <div className=' bg-[#ffffff]  w-[262px] flex flex-col justify-between gap-5 items-center border-solid rounded-2xl group-hover:scale-105'>
          {/* Hình ảnh sản phẩm và giảm giá nếu có */}
          <div className='flex-1 h-1/2  relative '>
            <img src={product?.image} alt='' className='w-full rounded-t-2xl rounded-tr-2xl' />  {/* Hình ảnh sản phẩm */}
            {product.price_before_discount != product.price ? (  // Kiểm tra nếu có giảm giá
              <div className='absolute left-3 top-4 transform  w-[40px] h-[40px] bg-[#252322] text-white px-1 py-2 rounded-full text-[12px] pl-1'>
                -{rateSale(product.price_before_discount, product.price)}  {/* Hiển thị tỷ lệ giảm giá */}
              </div>
            ) : (
              <div />
            )}
          </div>

          {/* Thông tin chi tiết sản phẩm */}
          <div className='flex-1 h-1/2 '>
            <div className='flex flex-col gap-2 items-center justify-center px-6'>
              <div className='text-[10px] leading-3 lg:text-sm font-semibold text-black'>{product?.brand?.name}</div>  {/* Tên thương hiệu */}
              <div className='text-[10px] lg:text-[12px] line-clamp-2 text-center leading-relaxed font-normal text-black'>
                {product?.name}  {/* Tên sản phẩm */}
              </div>
              <div className='text-[8px] lg:text-[13px] flex gap-1 lg:gap-3 px-2 lg:px-3'>
                <div className='font-semibold text-black'>{formatCurrency(product.price)}đ</div>  {/* Giá sản phẩm */}
                <div className='font-medium text-gray-400 line-through'>
                  {formatCurrency(product.price_before_discount)}đ  {/* Giá gốc của sản phẩm */}
                </div>
                <div className='relative bg-[#c73030] w-[30px] h-[15px] flex justify-center items-center rounded-full'>
                  <div className='absolute text-gray-100 text-[10px] p-1'>
                    -{rateSale(product.price_before_discount, product.price)}  {/* Tỷ lệ giảm giá */}
                  </div>
                </div>
              </div>
              <div className='flex gap-1 px-3 text-gray-300 items-center justify-center'>
                <ProductRating rating={product.rating} />  {/* Component đánh giá sản phẩm */}
                <span className='text-black ml-2 text-sm'>({product.sold})</span>  {/* Số lượng đã bán */}
              </div>

              {/* Hiển thị số lượng sản phẩm đã bán */}
              <div className=' w-full font pb-3 relative mt-2'>
                <div className=' relative '>
                  <div>
                    <div
                      className='relative overflow-hidden w-full rounded-full'
                      style={{
                        backgroundColor: 'rgba(199, 49, 48, 0.314)'  // Màu nền cho thanh tiến trình
                      }}
                    >
                      <div
                        className=''
                        style={{
                          width: `${(product.sold / product.quantity) * 100}%`,  // Tính toán tỷ lệ đã bán
                          height: '20px',
                          background:
                            'repeating-linear-gradient(-45deg, rgba(199, 49, 48, 0.6), rgba(199, 49, 48, 0.6) 10px, rgb(199, 49, 48) 10px, rgb(199, 49, 48) 20px)'  // Hiệu ứng gradient cho thanh tiến trình
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className='absolute mt-[-20px] px-2 text-red-50'>Đã bán {product.sold} sản phẩm</div>  {/* Thông báo số lượng đã bán */}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Nút "Xem nhanh" */}
      <button
        className='absolute top-1/3 left-[40%] translate-x-[-50%] và translate-y-[-50%] hidden  group-hover:block bg-[#121010b6] text-gray-100 px-4 py-3 font-bold rounded-full hover:bg-gradient-to-r from-[#f0a80edb] via-[#c43131d8] to-[#671f57d1]'
        onClick={showModal}  // Hiển thị modal khi nhấn nút
      >
        Xem Nhanh
      </button>

      {/* Modal hiển thị chi tiết sản phẩm */}
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1100} footer={null}>
        <QuickView product={product} />  {/* Component hiển thị thông tin chi tiết sản phẩm */}
      </Modal>
    </div>
  )
}
