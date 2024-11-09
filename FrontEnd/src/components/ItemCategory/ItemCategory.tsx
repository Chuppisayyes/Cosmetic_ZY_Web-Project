import { useState } from 'react'
import 'src/Styles/Footer.scss' // Nhập file SCSS chứa các lớp CSS

interface Props {
  img?: string // Đường dẫn hình ảnh của mục (category)
  name?: string // Tên của mục (category)
}

function ItemCategory({ img, name }: Props) {
  const [hovered, setHovered] = useState(false) // Trạng thái hover

  return (
    <div className='px-2 py-3 font-semibold text-gray-500 hover:text-rose-400'>
      <div className='flex flex-col items-center justify-center relative'>
        {/* Hình ảnh mục (category) */}
        <img
          src={img}
          alt={name} // Thêm alt cho hình ảnh để hỗ trợ accessibility
          className={`w-[120px] h-[120px] transform transition-transform duration-500 ease-in-out ${
            hovered ? 'hover:animate-customAnimation' : ''
          }`}
          onMouseEnter={() => setHovered(true)} // Bắt sự kiện hover
          onMouseLeave={() => setHovered(false)} // Bắt sự kiện khi rời khỏi hover
        />
        {/* Tên mục */}
        <div className='pt-3 flex items-center text-sm'>
          <span>{name}</span>
        </div>
      </div>
    </div>
  )
}

export default ItemCategory
