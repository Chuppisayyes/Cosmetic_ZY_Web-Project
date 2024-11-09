// Import các thư viện và component cần thiết
import { Collapse, CollapseProps, ConfigProvider } from 'antd'  // Nhập các component từ Ant Design
import 'src/Styles/Header.scss'                                // Nhập các style liên quan
import Checkbox from '../Checkbox'                             // Nhập component Checkbox tùy chỉnh
import CheckBoxBrand from '../CheckBoxBrand'                   // Nhập component CheckBoxBrand cho bộ lọc thương hiệu
import CheckBoxCategory from '../CheckBoxCategory'             // Nhập component CheckBoxCategory cho bộ lọc danh mục
import useQueryConfig from 'src/hooks/useQueryConfig'          // Nhập hook tùy chỉnh useQueryConfig
import categoryApi from 'src/apis/category.api'                // Nhập API cho danh mục
import { useQuery } from 'react-query'                         // Nhập hook useQuery từ react-query để gọi API
import adminApi from 'src/apis/admin.api'                      // Nhập API cho quản lý admin (dùng để lấy thương hiệu)
import CheckBoxRating from '../CheckBoxRating'                 // Nhập component CheckBoxRating cho bộ lọc đánh giá

// Định nghĩa interface Props cho các tham số truyền vào component FilterItem
interface Props {
  index: number            // Chỉ số của mục lọc
  label: string            // Nhãn của mục lọc
}

// Định nghĩa component FilterItem dùng để hiển thị từng mục bộ lọc
export default function FilterItem({ index, label }: Props) {
  const queryConfig = useQueryConfig()   // Sử dụng hook useQueryConfig để lấy cấu hình query cho bộ lọc

  // Gọi API lấy danh mục sản phẩm
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],            // Đặt key cho query là 'categories'
    queryFn: () => {
      return categoryApi.getCategories() // Hàm gọi API để lấy danh mục
    }
  })

  // Gọi API lấy thương hiệu sản phẩm
  const { data: brandData } = useQuery({
    queryKey: ['brands'],                // Đặt key cho query là 'brands'
    queryFn: () => {
      return adminApi.getBrands()        // Hàm gọi API để lấy thương hiệu
    }
  })

  // Hàm generateChildren để sinh các component con tùy theo giá trị của index
  const generateChildren = (index: number) => {
    switch (index) {
      case 1:
        return <Checkbox queryConfig={queryConfig} />     // Trường hợp index là 1, trả về component Checkbox
      case 2:
        return (
          <div>
            <CheckBoxCategory queryConfig={queryConfig} categories={categoriesData?.data.data || []} /> 
            {/* Trường hợp index là 2, trả về CheckBoxCategory với dữ liệu danh mục từ categoriesData */}
          </div>
        )
      case 3:
        return (
          <div>
            <CheckBoxBrand queryConfig={queryConfig} brands={brandData?.data.data || []} />
            {/* Trường hợp index là 3, trả về CheckBoxBrand với dữ liệu thương hiệu từ brandData */}
          </div>
        )
      default:
        return (
          <div>
            <CheckBoxRating queryConfig={queryConfig} />
            {/* Mặc định trả về CheckBoxRating */}
          </div>
        )
    }
  }

  // Tạo danh sách items cho Collapse component với cấu hình từ Ant Design
  const items: CollapseProps['items'] = [
    {
      key: index,                   // Key của item bằng giá trị index
      label: label,                 // Label của item là nhãn truyền vào từ prop
      children: generateChildren(index) // Sinh ra component con theo giá trị index
    }
  ]

  // Cấu hình theme tùy chỉnh cho Collapse component
  const myTheme = {
    components: {
      Collapse: {
        colorBorder: 'white',           // Màu viền trắng
        headerBg: 'white',              // Nền header màu trắng
        fontSizeIcon: 10,               // Kích thước icon
        fontSizeLG: 12,                 // Kích thước font lớn
        fontFamily: 'Montserrat',       // Font chữ Montserrat
        fontSize: 12,                   // Kích thước font
        headerPadding: '10px 2px',      // Padding cho header
        contentPadding: '6px 2px'       // Padding cho nội dung
      }
    }
  }

  return (
    <div className='font'>
      <ConfigProvider theme={myTheme}>   {/* Sử dụng ConfigProvider với theme tùy chỉnh */}
        <Collapse accordion items={items} /> {/* Hiển thị Collapse component với chế độ accordion */}
      </ConfigProvider>
    </div>
  )
}
