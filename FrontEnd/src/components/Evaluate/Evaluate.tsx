// Import các thư viện cần thiết
import React, { useState } from 'react'
import { Rate } from 'antd'                     // Nhập component Rate từ thư viện Ant Design để tạo đánh giá bằng sao
import TextArea from 'antd/es/input/TextArea'   // Nhập TextArea từ Ant Design để nhập nội dung đánh giá
import { toast } from 'react-toastify'          // Nhập toast từ react-toastify để hiển thị thông báo
import productApi from 'src/apis/product.api'   // Nhập API để gửi yêu cầu thêm đánh giá sản phẩm

// Định nghĩa interface EvaluateProps để chỉ định kiểu dữ liệu cho các props của component Evaluate
interface EvaluateProps {
  productId: string               // ID sản phẩm, kiểu chuỗi
  handleClose: () => void         // Hàm đóng modal, không có tham số trả về
  setReviewSuccess: any           // Hàm cập nhật trạng thái thành công của đánh giá (có thể dùng kiểu `Dispatch<SetStateAction<boolean>>`)
}

// Định nghĩa component Evaluate để người dùng đánh giá sản phẩm
const Evaluate = ({ productId, handleClose, setReviewSuccess }: EvaluateProps) => {
  // Khởi tạo trạng thái cho điểm đánh giá (số sao) và nội dung bình luận
  const [rating, setRating] = useState(0)          // Trạng thái điểm đánh giá, mặc định là 0
  const [comment, setComment] = useState('')       // Trạng thái bình luận, mặc định là chuỗi rỗng

  // Hàm xử lý thay đổi điểm đánh giá
  const handleRatingChange = (value: number) => setRating(value) // Cập nhật điểm đánh giá khi thay đổi
  // Hàm xử lý thay đổi nội dung bình luận
  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setComment(event.target.value)

  // Hàm xử lý khi người dùng gửi đánh giá
  const handleComment = async () => {
    // Kiểm tra xem đã nhập đánh giá và chọn số sao chưa
    if (!rating || !comment) {
      toast.error('Vui lòng nhập đánh giá hoặc chọn số sao bạn mong muốn.') // Hiển thị thông báo lỗi nếu thiếu thông tin
      return
    }

    // Tạo nội dung yêu cầu bao gồm điểm đánh giá và bình luận
    const body = {
      rating,
      commentItem: comment
    }

    try {
      // Gửi yêu cầu API để thêm bình luận cho sản phẩm với productId
      const response = await productApi.addComment(productId, body) // Giả sử addComment được định nghĩa trong productApi

      if (response.status === 200) { // Nếu yêu cầu thành công
        toast.success('Cảm ơn bạn đã đánh giá cho chúng tôi', { autoClose: 1300 }) // Hiển thị thông báo thành công
        setReviewSuccess(true)        // Cập nhật trạng thái thành công của đánh giá
        setRating(0)                  // Đặt lại điểm đánh giá về 0
        setComment('')                // Xóa nội dung bình luận
        handleClose()                 // Đóng modal đánh giá
      } else {
        toast.error('Vui lòng thử lại') // Hiển thị thông báo lỗi nếu có lỗi từ phía API
      }
    } catch (error) {
      toast.error('Vui lòng thử lại')   // Hiển thị thông báo lỗi nếu xảy ra lỗi khi gửi yêu cầu
    }
  }

  return (
    <div className='px-4 py-3'>
      {/* Phần tiêu đề đánh giá sản phẩm */}
      <div className='xl:w-full'>
        <div className='text-xl font-bold text-gray-600 uppercase text-center w-full'>Đánh Giá Sản phẩm</div>
      </div>

      {/* Giao diện chọn số sao và nhập bình luận */}
      <div className='xl:grid gap-5 mt-3' style={{ gridTemplateColumns: '40% 60%' }}>
        
        {/* Phần đánh giá chung bằng sao */}
        <div className='flex flex-col gap-2 '>
          <span className='text-gray-500 text-lg font-semibold'>
            Đánh giá chung <span className='text-rose-500'>*</span>
          </span>
          <Rate className='text-3xl' value={rating} onChange={handleRatingChange} /> {/* Component Rate để chọn sao */}
        </div>

        {/* Phần nhập nội dung đánh giá */}
        <div className='flex flex-col gap-2 '>
          <span className='text-gray-500 text-lg font-semibold'>
            Đánh giá sản phẩm<span className='text-rose-500'>*</span>
          </span>
          <TextArea
            rows={6}
            placeholder='Viết đánh giá chi tiết'
            maxLength={300}         // Giới hạn độ dài tối đa của bình luận
            value={comment}          // Liên kết trạng thái comment
            onChange={handleCommentChange} // Gọi hàm khi nội dung thay đổi
          />
          <div className='text-sm text-gray-400/80 text-left w-full'>
            Bạn có thể nói thêm về sản phẩm ở dưới đây, ví dụ như độ hoàn thiện, sự thoải mái
          </div>
        </div>
      </div>

      {/* Nút gửi đánh giá */}
      <div className='w-full flex items-center justify-center mt-4'>
        <div className='flex items-center justify-center border-2 rounded-full w-[200px] h-[48px] bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57] text-white text-base'>
          <button
            onClick={handleComment}                // Gọi hàm handleComment khi nhấn nút
            type='button'
            className='ant-btn ant-btn-primary size-16 font-bold flex-1 btn-black h-30 radius-38 pd-14-23 flex-center btn-add-cart uppercase'
          >
            Gửi Cho Chúng Tôi
          </button>
        </div>
      </div>
    </div>
  )
}

export default Evaluate   // Xuất component Evaluate để sử dụng ở nơi khác
