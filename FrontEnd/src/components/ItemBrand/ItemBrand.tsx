import { Link, createSearchParams } from 'react-router-dom'
import 'src/Styles/Footer.scss' // Nhập file SCSS chứa các lớp CSS
import path from 'src/constants/path' // Đường dẫn của trang lọc thương hiệu
import useQueryConfig from 'src/hooks/useQueryConfig' // Hook tùy chỉnh để lấy query config

interface Props {
  img?: string // Đường dẫn hình ảnh của thương hiệu
  id: any // ID của thương hiệu
}

function ItemBrand({ img, id }: Props) {
  const queryConfig = useQueryConfig() // Lấy cấu hình truy vấn hiện tại

  return (
    <Link
      to={{
        pathname: path.filterBrand, // Đường dẫn tới trang lọc theo thương hiệu
        search: createSearchParams({
          ...queryConfig, // Các tham số truy vấn hiện tại
          brand: id // Thêm tham số thương hiệu vào query
        }).toString()
      }}
      onClick={() => {
        window.scrollTo(0, 0) // Cuộn trang lên đầu khi click
      }}
      className='block w-full relative z-10'
    >
      <div className='w-full transition-transform duration-300 hover:-translate-y-3'>
        <div className='w-full'>
          {/* Hình ảnh thương hiệu */}
          <img 
            src={img} 
            alt='Brand' 
            className='w-[100px] h-[60px] lg:w-[217px] lg:h-[106px] rounded-md relative z-10' 
          />
        </div>
      </div>
    </Link>
  )
}

export default ItemBrand
