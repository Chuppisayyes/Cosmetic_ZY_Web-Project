import { Link } from 'react-router-dom'

export default function Poster() {
  return (
    <div className='flex gap-5'>
      {/* Đoạn mã dưới đây tạo các poster dưới dạng hình ảnh, mỗi poster có liên kết riêng */}
      <Link to='/'>
        {/* Poster đầu tiên */}
        <img
          src='poster1.webp' // Đường dẫn đến hình ảnh poster
          alt='' // Mô tả thay thế cho hình ảnh
          className='max-h-[496px] rounded-xl transition-transform duration-300 hover:-translate-y-2' // Các lớp CSS để điều chỉnh kiểu dáng và hiệu ứng hover
        />
      </Link>
      <Link to='/'>
        {/* Poster thứ hai */}
        <img
          src='poster2.webp'
          alt=''
          className='max-h-[496px] rounded-xl transition-transform duration-300 hover:-translate-y-2'
        />
      </Link>
      <Link to='/'>
        {/* Poster thứ ba */}
        <img
          src='poster3.webp'
          alt=''
          className='max-h-[496px] rounded-xl transition-transform duration-300 hover:-translate-y-2'
        />
      </Link>
      <Link to='/'>
        {/* Poster thứ tư */}
        <img
          src='poster4.webp'
          alt=''
          className='max-h-[496px] rounded-xl transition-transform duration-300 hover:-translate-y-2'
        />
      </Link>
    </div>
  )
}
