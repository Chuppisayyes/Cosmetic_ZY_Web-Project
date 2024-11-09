import { FaStar } from 'react-icons/fa6'

export default function ProductRating({
  rating,  // Đánh giá sản phẩm (số điểm từ 0 đến 5)
  activeClassname = 'text-[10px] md:text-[12px] lg:text-[14px] fill-orange-600 text-orange-800 rounded-lg',  // Class CSS cho sao đang được chọn (sao sáng)
  nonActiveClassname = 'text-[10px] md:text-[12px] lg:text-[14px] fill-current text-gray-300 rounded-lg'  // Class CSS cho sao chưa được chọn (sao mờ)
}: {
  rating: number  // Đánh giá của sản phẩm (số điểm từ 0 đến 5)
  activeClassname?: string  // Class tùy chọn cho sao sáng
  nonActiveClassname?: string  // Class tùy chọn cho sao mờ
}) {
  // Hàm tính toán độ rộng của sao được chọn (dựa trên số điểm đánh giá)
  const handleWidth = (order: number) => {
    if (order <= rating) {
      return '100%'  // Nếu sao này nằm trong phạm vi đánh giá, nó sẽ có độ rộng 100% (sao đầy đủ)
    }
    if (order > rating && order - rating < 1) {
      return (rating - Math.floor(rating)) * 100 + '%'  // Nếu sao này là sao phân đoạn, tính độ rộng của phần sao chưa được đầy
    }
    return '0%'  // Nếu sao này không nằm trong phạm vi đánh giá, độ rộng là 0%
  }

  return (
    <div className='flex items-center gap-1  '>  {/* Container chứa các sao */}
      {Array(5)  // Tạo 5 sao
        .fill(0)  // Khởi tạo mảng với 5 phần tử có giá trị ban đầu là 0
        .map((_, index) => (  // Duyệt qua mảng để tạo các sao
          <div className='relative ' key={index}>  {/* Vị trí của sao */}
            <div className='absolute top-0 left-0 h-full overflow-hidden' style={{ width: handleWidth(index + 1) }}>  {/* Tạo hiệu ứng sao sáng với độ rộng tính toán */}
              <FaStar className={activeClassname} />  {/* Sao sáng */}
            </div>
            <FaStar className={nonActiveClassname} />  {/* Sao mờ */}
          </div>
        ))}
    </div>
  )
}
