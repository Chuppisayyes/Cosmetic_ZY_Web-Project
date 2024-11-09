import { FaStar } from 'react-icons/fa6'  // Import icon sao đầy đủ từ react-icons
import SwiperQuick from '../SwiperQuick'  // Import component SwiperQuick (slider sản phẩm)
import { FaStarHalfAlt } from 'react-icons/fa'  // Import icon sao một nửa từ react-icons
import 'src/Styles/SwiperQuick.scss'  // Import stylesheet cho SwiperQuick
import { Link, useNavigate } from 'react-router-dom'  // Import các hook từ react-router-dom
import AddPurchase from '../AddPurchase'  // Import component AddPurchase (thêm sản phẩm vào giỏ)
import path from 'src/constants/path'  // Import các đường dẫn tĩnh từ constants
import { generateNameId } from 'src/utils/utils'  // Import hàm generateNameId để tạo tên đường dẫn sản phẩm
import { useMutation, useQueryClient } from 'react-query'  // Import các hook của react-query để thao tác với dữ liệu
import purchaseApi from 'src/apis/purchase.api'  // Import API liên quan đến mua hàng
import { toast } from 'react-toastify'  // Import thư viện thông báo
import { purchasesStatus } from 'src/constants/purchase'  // Import các trạng thái đơn hàng từ constants
import { useState } from 'react'  // Import hook useState để quản lý state trong component

interface Props {
  product: any  // Định nghĩa Props nhận vào một sản phẩm (product)
}

export default function QuickView({ product }: Props) {
  const [buyCount, setBuyCount] = useState(1)  // State quản lý số lượng mua
  const queryClient = useQueryClient()  // Khởi tạo queryClient để quản lý cache của react-query
  const navigate = useNavigate()  // Khởi tạo navigate để chuyển hướng trang
  const addToCartMutation = useMutation(purchaseApi.addToCart)  // Khởi tạo mutation để thêm sản phẩm vào giỏ

  // Hàm xử lý khi thêm sản phẩm vào giỏ hàng
  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },  // Truyền số lượng và ID sản phẩm vào API
      {
        onSuccess: (data) => {  // Nếu thêm vào giỏ thành công, hiển thị thông báo
          toast.success(data.data.message, { autoClose: 1000 })
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })  // Cập nhật lại giỏ hàng
        }
      }
    )
  }

  // Hàm xử lý khi nhấn nút mua ngay
  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })  // Thêm sản phẩm vào giỏ ngay lập tức
    const purchase = res.data.data  // Lấy thông tin đơn hàng vừa thêm
    navigate(path.cart, {  // Chuyển hướng đến trang giỏ hàng
      state: {
        purchaseId: purchase._id  // Truyền ID đơn hàng vào state để sử dụng
      }
    })
  }

  // Hàm xử lý thay đổi số lượng sản phẩm khi người dùng nhập
  const handleBuyCount = (value: number) => {
    setBuyCount(value)  // Cập nhật số lượng sản phẩm
  }

  if (!product) return null  // Nếu không có sản phẩm, không render gì

  return (
    <div className='grid gap-5 px-1' style={{ gridTemplateColumns: '35% 65%' }}>
      <div className='flex justify-center items-center'>
        <SwiperQuick product={product} />  {/* Hiển thị slider sản phẩm */}
      </div>
      <div className='flex flex-col gap-1'>
        {/* Hiển thị thương hiệu sản phẩm */}
        <div className='text-xs xl:text-l text-rose-700 uppercase font-bold'>{product?.brand?.name}</div>
        {/* Hiển thị tên sản phẩm */}
        <div className='text-xs xl:text-xl text-gray-900 font-bold'>{product?.name}</div>
        <div className='flex-row xl:flex gap-2'>
          {/* Hiển thị đánh giá sao của sản phẩm */}
          <div className='flex gap-1 text-orange-500 items-center justify-center text-[13px] border-white border-r-gray-200 border-2 pr-3'>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalfAlt />
            <span className='text-black ml-2 text-[13px]'>(10)</span>
          </div>
          {/* Hiển thị xuất xứ sản phẩm */}
          <div className='flex gap-1  border-white border-r-gray-200 border-2 pr-3'>
            <span className='font-semibold'>Xuất sứ :</span>
            <span>{product?.madeIn}</span>
          </div>
          {/* Hiển thị mã sản phẩm */}
          <div className='flex gap-1'>
            <span className='font-semibold'>Mã:</span>
            <span>5044</span>
          </div>
        </div>
        {/* Hiển thị thông tin sản phẩm */}
        <div className='border-gradient w-[92%] rounded-lg p-2 mt-4 flex flex-col gap-1 '>
          <div className='font-bold text-[12px] xl:text-[15px]'>Thông tin sản phẩm :</div>
          <p className='line-clamp-6 text-[10px] xl:text-[14px]'>
            Dưới đây là công dụng của sản phẩm. Bạn nên xem xét kỹ công dụng của từng sản phẩm để biết bản thân mình phù
            hợp với loại sản phẩm nào, và hiệu quả của sản phẩm đó trên da của chúng ta. {product.uses} . Chúc các bạn
            mãi xinh đẹp . Hãy luôn yêu thương bản thân mình nhé !
          </p>
        </div>
        {/* Component AddPurchase để thêm sản phẩm vào giỏ hoặc mua ngay */}
        <AddPurchase
          product={product}
          addToCart={addToCart}
          buyNow={buyNow}
          buyCount={buyCount}
          handleBuyCount={handleBuyCount}
        />
        <div className=' mt-4'>
          {/* Link để xem chi tiết sản phẩm */}
          <Link
            to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}
            className='text-xs xl:text-lg font-bold border-2 border-white border-b-gray-950 text-black hover:text-gray-800'
            onClick={() => {
              window.scrollTo(0, 0)  // Cuộn trang lên đầu khi click
            }}
          >
            Xem chi tiết sản phẩm
          </Link>
        </div>
      </div>
    </div>
  )
}
