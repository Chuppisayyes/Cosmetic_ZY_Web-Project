// Import component QuantityController từ đường dẫn tương đối
import QuantityController from '../QuantityController'

/**
 * Định nghĩa interface Props để xác định các thuộc tính (props) mà component `AddPurchase` sẽ nhận.
 * - product: chứa thông tin sản phẩm, kiểu `any` (nên cải thiện kiểu dữ liệu cụ thể hơn).
 * - addToCart: hàm xử lý sự kiện thêm sản phẩm vào giỏ hàng.
 * - buyNow: hàm xử lý sự kiện mua ngay.
 * - buyCount: số lượng sản phẩm mà người dùng muốn mua.
 * - handleBuyCount: hàm xử lý khi người dùng thay đổi số lượng sản phẩm (thông qua tăng, giảm hoặc nhập trực tiếp).
 */
interface Props {
  product: any
  addToCart: any
  buyNow: any
  buyCount: number
  handleBuyCount: (value: number) => void
}

/**
 * Component AddPurchase
 * - Hiển thị giao diện điều khiển số lượng sản phẩm, thêm vào giỏ hàng, và mua ngay.
 */
export default function AddPurchase({ product, addToCart, buyNow, buyCount, handleBuyCount }: Props) {
  return (
    <div className='flex-none xl:flex-row xl:flex gap-2 xl:mt-4 xl:pr-4'>
      {/* Phần điều khiển số lượng sản phẩm */}
      <div className='flex items-center my-1 justify-center rounded-full'>
        <QuantityController
          onDecrease={() => handleBuyCount(buyCount - 1)} // Giảm số lượng sản phẩm
          onIncrease={() => handleBuyCount(buyCount + 1)} // Tăng số lượng sản phẩm
          onType={handleBuyCount} // Nhập trực tiếp số lượng
          value={buyCount} // Giá trị hiện tại của số lượng sản phẩm
          max={product.quantity} // Giới hạn tối đa dựa trên số lượng tồn kho
        />
      </div>

      {/* Nút "Thêm vào giỏ hàng" */}
      <div className='flex items-center my-1 justify-center border-2 rounded-full w-full xl:w-[285px] h-[48px] bg-black text-white text-base hover:bg-black/80'>
        <button
          type='button'
          className='ant-btn ant-btn-primary size-16 w-100 flex-1 btn-black h-50 radius-38 pd-14-23 flex-center btn-add-cart'
          onClick={addToCart} // Gọi hàm addToCart khi click
        >
          {/* Icon giỏ hàng */}
          <span role='img' className='anticon'>
            <svg width='16' height='15' viewBox='0 0 22 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M21 6.99953H16.21L11.83 0.439531C11.64 0.159531 11.32 0.0195312 11 0.0195312C10.68 0.0195312 10.36 0.159531 10.17 0.449531L5.79 6.99953H1C0.45 6.99953 0 7.44953 0 7.99953C0 8.08953 0.00999996 8.17953 0.04 8.26953L2.58 17.5395C2.81 18.3795 3.58 18.9995 4.5 18.9995H17.5C18.42 18.9995 19.19 18.3795 19.43 17.5395L21.97 8.26953L22 7.99953C22 7.44953 21.55 6.99953 21 6.99953ZM11 2.79953L13.8 6.99953H8.2L11 2.79953ZM17.5 16.9995L4.51 17.0095L2.31 8.99953H19.7L17.5 16.9995ZM11 10.9995C9.9 10.9995 9 11.8995 9 12.9995C9 14.0995 9.9 14.9995 11 14.9995C12.1 14.9995 13 14.0995 13 12.9995C13 11.8995 12.1 10.9995 11 10.9995Z'
                fill='white'
              ></path>
            </svg>
          </span>
          <span className='pl-2 text-[10px]'>Thêm vào giỏ hàng</span>
        </button>
      </div>

      {/* Nút "Mua Ngay" */}
      <div className='flex items-center my-1 justify-center border-2 rounded-full w-[125px] h-[48px] bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57] text-white text-base '>
        <button
          onClick={buyNow} // Gọi hàm buyNow khi click
          type='button'
          className='text-[12px] xl:text-[14px] ant-btn ant-btn-primary size-16 w-100 flex-1 btn-black h-50 radius-38 pd-14-23 flex-center btn-add-cart'
        >
          Mua Ngay
        </button>
      </div>
    </div>
  )
}
