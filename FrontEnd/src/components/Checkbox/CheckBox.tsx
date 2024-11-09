// Import các thành phần cần thiết từ các thư viện
import { Radio, ConfigProvider, RadioChangeEvent } from 'antd' // Import Radio và ConfigProvider từ Ant Design
import { useState } from 'react' // Import useState để quản lý trạng thái trong functional component
import { createSearchParams, useNavigate } from 'react-router-dom' // Import để điều hướng và tạo query string
import path from 'src/constants/path' // Import path từ file constants để sử dụng các đường dẫn URL
import { QueryConfig } from 'src/hooks/useQueryConfig' // Import kiểu dữ liệu QueryConfig từ custom hook

// Định nghĩa kiểu Props cho component
interface Props {
  queryConfig: QueryConfig // Nhận queryConfig làm prop
}

// Tạo component CheckBox
export default function CheckBox({ queryConfig }: Props) {
  // Sử dụng state để lưu giá trị của Radio button được chọn
  const [value, setValue] = useState<number>()

  // Tùy chỉnh giao diện cho Radio bằng ConfigProvider
  const myTheme = {
    components: {
      Radio: {
        colorPrimary: 'black', // Màu chủ đạo khi chọn
        colorPrimaryHover: 'black', // Màu khi hover
        fontFamily: 'Montserrat', // Font chữ tùy chỉnh
        paddingXS: 10, // Padding nhỏ
        marginXS: 10, // Margin nhỏ
        controlInteractiveSize: 10, // Kích thước biểu tượng Radio
        fontSize: 10, // Kích thước chữ
      }
    }
  }

  // Khai báo hook useNavigate để điều hướng
  const navigate = useNavigate()

  // Hàm xử lý khi giá trị Radio thay đổi
  const onChange = (e: RadioChangeEvent) => {
    const newValue = e.target.value // Lấy giá trị mới từ sự kiện
    setValue(newValue) // Cập nhật giá trị state

    // Khởi tạo giá trị price_max và price_min
    let price_max
    let price_min

    // Xử lý logic theo từng giá trị Radio
    switch (newValue) {
      case 1: 
        price_max = '500000'
        price_min = '0'
        break
      case 2: 
        price_max = '1000000'
        price_min = '500000'
        break
      case 3: 
        price_max = '1500000'
        price_min = '1000000'
        break
      case 4: 
        price_max = '2000000'
        price_min = '1500000'
        break
      case 5: 
        price_max = '10000000' // Đặt giới hạn trên cao cho giá trị này
        price_min = '2000000'
        break
      default: 
        return // Không làm gì nếu không khớp giá trị nào
    }

    // Điều hướng tới trang lọc sản phẩm với query string mới
    navigate({
      pathname: path.filterProduct, // Đường dẫn đến trang lọc sản phẩm
      search: createSearchParams({
        ...queryConfig, // Giữ nguyên các tham số query trước đó
        price_max, // Thêm tham số price_max mới
        price_min  // Thêm tham số price_min mới
      }).toString()
    })
  }

  // Trả về giao diện của component
  return (
    <div>
      {/* Bọc Radio.Group trong ConfigProvider để áp dụng theme tùy chỉnh */}
      <ConfigProvider theme={myTheme}>
        <Radio.Group onChange={onChange} value={value}>
          <div className='flex flex-col gap-6 text-[10px]'>
            {/* Radio cho từng khoảng giá */}
            <Radio value={1}>
              <span className='ml-1 xl:ml-0'>Dưới 500.000₫</span>
            </Radio>
            <Radio value={2}>
              <span className='ml-1 xl:ml-0'>500.000₫ - 1.000.000₫</span>
            </Radio>
            <Radio value={3}>
              <span className='ml-1 xl:ml-0'>1.000.000₫ - 1.500.000₫</span>
            </Radio>
            <Radio value={4}>
              <span className='ml-1 xl:ml-0'>1.500.000₫ - 2.000.000₫</span>
            </Radio>
            <Radio value={5}>
              <span className='ml-1 xl:ml-0'>Trên 2.000.000₫</span>
            </Radio>
          </div>
        </Radio.Group>
      </ConfigProvider>
    </div>
  )
}
