// Import các thành phần cần thiết từ Ant Design và React
import { ConfigProvider, Radio, RadioChangeEvent } from 'antd' // Dùng Radio để tạo danh sách chọn
import { useState } from 'react' // useState để quản lý trạng thái trong component
import { createSearchParams, useNavigate } from 'react-router-dom' // Điều hướng và tạo query string
import 'src/Styles/CheckBoxBrand.scss' // Import file CSS tùy chỉnh
import path from 'src/constants/path' // Import các đường dẫn cố định
import { QueryConfig } from 'src/hooks/useQueryConfig' // Import kiểu dữ liệu query
import { Category } from 'src/types/category.type' // Import kiểu dữ liệu cho category

// Khai báo interface Props cho component
interface Props {
  queryConfig: QueryConfig // Tham số query hiện tại
  categories: Category[] // Danh sách các category
}

// Component CheckBoxCategory
export default function CheckBoxCategory({ queryConfig, categories }: Props) {
  // Tùy chỉnh theme cho Radio component
  const myTheme = {
    components: {
      Radio: {
        colorPrimary: 'black', // Màu chính
        colorPrimaryHover: 'black', // Màu khi hover
        fontFamily: 'Montserrat', // Font chữ
        paddingXS: 10, // Padding
        marginXS: 10, // Margin
        controlInteractiveSize: 18 // Kích thước của biểu tượng Radio
      }
    }
  }

  // Trạng thái hiển thị danh sách đầy đủ hoặc thu gọn
  const [expanded, setExpanded] = useState(false)

  // Trạng thái của giá trị được chọn
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  // Dùng navigate để điều hướng giữa các trang
  const navigate = useNavigate()

  // Xử lý sự kiện khi chọn một Radio
  const onChange = (e: RadioChangeEvent) => {
    const newValue = e.target.value // Lấy giá trị mới từ Radio
    setSelectedValue(newValue) // Cập nhật trạng thái
    navigate({
      pathname: path.filterProduct, // Điều hướng đến trang filter product
      search: createSearchParams({
        ...queryConfig, // Kế thừa query hiện tại
        category: newValue // Thêm category vào query
      }).toString()
    })
  }

  // Hàm hiển thị danh sách Radio
  const renderCheckboxes = () => {
    const checkboxes = categories.map((categoryItem) => (
      <Radio
        key={categoryItem._id} // Mỗi Radio cần một key duy nhất
        onChange={onChange} // Gọi hàm onChange khi thay đổi
        value={categoryItem._id} // Giá trị là _id của category
      >
        <span className='ml-1 xl:ml-0 text-[10px]'>{categoryItem.name}</span> {/* Hiển thị tên category */}
      </Radio>
    ))

    // Nếu không mở rộng, chỉ hiển thị 5 mục đầu
    return expanded ? checkboxes : checkboxes.slice(0, 5)
  }

  // Toggle trạng thái mở rộng
  const handleToggleExpanded = () => {
    setExpanded(!expanded) // Đảo ngược trạng thái expanded
  }

  return (
    <div
      className='flex flex-col gap-5 scrollable-container' // Dùng flex và gap để tạo bố cục
      style={{ maxHeight: '310px', overflowY: 'auto' }} // Giới hạn chiều cao và thêm scroll
    >
      <ConfigProvider theme={myTheme}>
        <div className='flex flex-col gap-5 text-[10px]'>
          {/* Group các Radio */}
          <Radio.Group value={selectedValue}>
            <div className='flex flex-col gap-6 text-[10px]'>{renderCheckboxes()}</div>
          </Radio.Group>
        </div>
      </ConfigProvider>

      {/* Nút toggle để mở rộng/thu gọn */}
      {!expanded && (
        <button
          onClick={handleToggleExpanded}
          className='text-left mt-1 text-[10px] xl:text-xs font-semibold text-black hover:text-gray-500'
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'} {/* Hiển thị nội dung dựa vào trạng thái */}
        </button>
      )}
    </div>
  )
}
