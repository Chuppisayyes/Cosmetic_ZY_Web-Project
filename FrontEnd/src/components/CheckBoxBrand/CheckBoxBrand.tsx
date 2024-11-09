// Import các thành phần từ Ant Design và React
import { ConfigProvider, Radio, RadioChangeEvent } from 'antd' // Sử dụng Radio và ConfigProvider để tùy chỉnh giao diện
import { useState } from 'react' // Sử dụng useState để quản lý trạng thái trong component
import { createSearchParams, useNavigate } from 'react-router-dom' // Điều hướng và tạo query string cho URL
import 'src/Styles/CheckBoxBrand.scss' // Import file CSS để áp dụng custom style
import path from 'src/constants/path' // Import đường dẫn từ file constants
import { QueryConfig } from 'src/hooks/useQueryConfig' // Import kiểu QueryConfig từ custom hook
import { Brand } from 'src/types/brand.type' // Import kiểu dữ liệu Brand

// Khai báo interface Props cho component
interface Props {
  queryConfig: QueryConfig // Nhận queryConfig để tạo URL filter
  brands: Brand[] // Danh sách các thương hiệu (brands)
}

// Định nghĩa component CheckBoxBrand
export default function CheckBoxBrand({ queryConfig, brands }: Props) {
  // Tùy chỉnh theme cho Radio component
  const myTheme = {
    components: {
      Radio: {
        colorPrimary: 'black', // Màu khi được chọn
        colorPrimaryHover: 'black', // Màu khi hover
        fontFamily: 'Montserrat', // Font chữ tùy chỉnh
        paddingXS: 10, // Padding nhỏ
        marginXS: 10, // Margin nhỏ
        controlInteractiveSize: 18 // Kích thước biểu tượng Radio
      }
    }
  }

  // Quản lý trạng thái cho việc hiển thị đầy đủ danh sách hoặc rút gọn
  const [expanded, setExpanded] = useState(false)

  // Quản lý trạng thái của giá trị được chọn
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  // Sử dụng hook useNavigate để điều hướng
  const navigate = useNavigate()

  // Hàm xử lý khi thay đổi giá trị Radio
  const onChange = (e: RadioChangeEvent) => {
    const newValue = e.target.value // Lấy giá trị mới từ sự kiện
    setSelectedValue(newValue) // Cập nhật giá trị được chọn

    // Điều hướng đến trang lọc sản phẩm với tham số query mới
    navigate({
      pathname: path.filterProduct, // Đường dẫn đến trang lọc sản phẩm
      search: createSearchParams({
        ...queryConfig, // Kế thừa các query hiện tại
        brand: newValue // Thêm hoặc cập nhật query brand
      }).toString()
    })
  }

  // Hàm tạo danh sách Radio buttons từ brands
  const renderCheckboxes = () => {
    const checkboxes = brands.map((brandItem) => (
      <Radio
        key={brandItem._id} // Mỗi Radio cần một key duy nhất
        onChange={onChange} // Gọi hàm onChange khi giá trị thay đổi
        value={brandItem._id} // Giá trị của Radio là _id của brand
      >
        <span className='ml-1 xl:ml-0 text-[10px]'>{brandItem.name}</span> {/* Hiển thị tên thương hiệu */}
      </Radio>
    ))

    // Nếu không ở trạng thái mở rộng, chỉ hiển thị tối đa 5 mục
    return expanded ? checkboxes : checkboxes.slice(0, 5)
  }

  // Hàm xử lý toggle trạng thái mở rộng
  const handleToggleExpanded = () => {
    setExpanded(!expanded) // Đảo ngược trạng thái expanded
  }

  return (
    <div
      className='flex flex-col gap-5 scrollable-container' // Flex layout và khoảng cách giữa các phần tử
      style={{ maxHeight: '310px', overflowY: 'auto' }} // Giới hạn chiều cao và thêm scroll khi vượt quá
    >
      {/* Cấu hình giao diện với theme */}
      <ConfigProvider theme={myTheme}>
        <div className='flex flex-col gap-5 text-[10px]'>
          {/* Nhóm các Radio buttons */}
          <Radio.Group value={selectedValue}>
            <div className='flex flex-col gap-6'>{renderCheckboxes()}</div> {/* Hiển thị danh sách Radio */}
          </Radio.Group>
        </div>
      </ConfigProvider>

      {/* Nút toggle hiển thị hoặc thu gọn danh sách */}
      {!expanded && (
        <button
          onClick={handleToggleExpanded} // Gọi hàm toggle khi click
          className='text-left mt-1 text-[10px] xl:test-xs font-semibold text-black hover:text-gray-500'
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'} {/* Hiển thị nội dung nút dựa vào trạng thái */}
        </button>
      )}
    </div>
  )
}
