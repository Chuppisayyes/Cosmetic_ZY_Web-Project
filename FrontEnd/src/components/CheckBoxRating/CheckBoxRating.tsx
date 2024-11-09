// Import các thành phần cần thiết từ Ant Design, React, và các thư viện khác
import { ConfigProvider, Radio, RadioChangeEvent } from 'antd' // Radio để tạo danh sách lựa chọn
import { useState } from 'react' // useState để quản lý trạng thái
import { FaStar } from 'react-icons/fa6' // Biểu tượng sao
import { HiOutlineMinus } from 'react-icons/hi' // Biểu tượng gạch ngang
import { createSearchParams, useNavigate } from 'react-router-dom' // Điều hướng và tạo query string
import path from 'src/constants/path' // Các đường dẫn cố định
import { QueryConfig } from 'src/hooks/useQueryConfig' // Kiểu dữ liệu query

// Định nghĩa Props cho component
interface Props {
  queryConfig: QueryConfig // Query hiện tại
}

// Component CheckBoxRating để lọc theo xếp hạng
export default function CheckBoxRating({ queryConfig }: Props) {
  const [value, setValue] = useState<number | undefined>() // Trạng thái lưu giá trị được chọn
  const navigate = useNavigate() // Sử dụng để điều hướng giữa các trang

  // Xử lý khi thay đổi giá trị Radio
  const onChange = (e: RadioChangeEvent) => {
    const newValue = e.target.value
    setValue(newValue) // Cập nhật trạng thái giá trị được chọn
    let ratingFilter

    // Xác định giá trị bộ lọc dựa trên số sao
    switch (newValue) {
      case 1:
        ratingFilter = 1
        break
      case 2:
        ratingFilter = 2
        break
      case 3:
        ratingFilter = 3
        break
      case 4:
        ratingFilter = 4
        break
      case 5:
        ratingFilter = 5
        break
      default:
        return // Không làm gì nếu giá trị không hợp lệ
    }

    // Điều hướng đến trang lọc sản phẩm với query mới
    navigate({
      pathname: path.filterProduct,
      search: createSearchParams({
        ...queryConfig, // Kế thừa query hiện tại
        rating_filter: String(ratingFilter) // Thêm bộ lọc rating vào query
      }).toString()
    })
  }

  // Tùy chỉnh giao diện Radio
  const myTheme = {
    components: {
      Radio: {
        colorPrimary: 'black', // Màu chính cho Radio
        colorPrimaryHover: 'black', // Màu khi hover
        fontFamily: 'Montserrat', // Font chữ
        paddingXS: 10, // Padding nhỏ
        marginXS: 10, // Margin nhỏ
        controlInteractiveSize: 10 // Kích thước biểu tượng
      }
    }
  }

  return (
    <div>
      <ConfigProvider theme={myTheme}>
        <Radio.Group onChange={onChange} value={value}>
          <div className='flex flex-col gap-1 xl:gap-6 font'>
            {/* Các lựa chọn Radio cho từng mức rating */}
            <Radio value={1}>
              <span className='flex items-center justify-center gap-1'>
                <FaStar fontSize={12} />
                <HiOutlineMinus />
                <span className='text-[10px] xl:text-[15px]'>Trở lên</span>
              </span>
            </Radio>
            <Radio value={2}>
              <span className='flex items-center justify-center gap-1'>
                <FaStar fontSize={12} />
                <FaStar fontSize={12} />
                <HiOutlineMinus />
                <span className='text-[10px] xl:text-[15px]'>Trở lên</span>
              </span>
            </Radio>
            <Radio value={3}>
              <span className='flex items-center justify-center gap-1'>
                <FaStar fontSize={12} />
                <FaStar fontSize={12} />
                <FaStar fontSize={12} />
                <HiOutlineMinus />
                <span className='text-[10px] xl:text-[15px]'>Trở lên</span>
              </span>
            </Radio>
            <Radio value={4}>
              <span className='flex items-center justify-center gap-1'>
                <FaStar fontSize={12} />
                <FaStar fontSize={12} />
                <FaStar fontSize={12} />
                <FaStar fontSize={12} />
                <HiOutlineMinus />
                <span className='text-[10px] xl:text-[15px]'>Trở lên</span>
              </span>
            </Radio>
            <Radio value={5}>
              <span className='flex items-center justify-center gap-1'>
                <FaStar fontSize={12} />
                <FaStar fontSize={12} />
                <FaStar fontSize={12} />
                <FaStar fontSize={12} />
                <FaStar fontSize={12} />
              </span>
            </Radio>
          </div>
        </Radio.Group>
      </ConfigProvider>
    </div>
  )
}
