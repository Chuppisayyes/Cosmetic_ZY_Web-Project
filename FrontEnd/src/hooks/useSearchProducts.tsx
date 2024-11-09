import { yupResolver } from '@hookform/resolvers/yup'  // Nhập resolver từ yup để xử lý validation form
import { omit } from 'lodash'  // Nhập hàm omit từ lodash để loại bỏ các thuộc tính không mong muốn
import { useForm } from 'react-hook-form'  // Nhập hook useForm từ react-hook-form để quản lý form
import useQueryConfig from './useQueryConfig'  // Nhập custom hook để lấy cấu hình query
import { schema, Schema } from 'src/utils/rules'  // Nhập schema và kiểu Schema từ utils để sử dụng trong validation
import { createSearchParams, useNavigate } from 'react-router-dom'  // Nhập các hàm để tạo searchParams và điều hướng
import path from 'src/constants/path'  // Nhập đối tượng chứa các đường dẫn tĩnh trong ứng dụng

type FormData = Pick<Schema, 'name'>  // Định nghĩa kiểu dữ liệu cho form, chỉ chọn trường 'name' từ Schema

const nameSchema = schema.pick(['name'])  // Lấy chỉ trường 'name' từ schema để áp dụng validation

export default function useSearchProducts() {
  const queryConfig = useQueryConfig()  // Lấy cấu hình query từ custom hook

  const { register, handleSubmit } = useForm<FormData>({  // Sử dụng useForm để khởi tạo form với kiểu dữ liệu FormData
    defaultValues: {
      name: ''  // Giá trị mặc định cho trường 'name' là chuỗi rỗng
    },
    resolver: yupResolver(nameSchema)  // Sử dụng yupResolver với nameSchema để xử lý validation
  })
  const navigate = useNavigate()  // Khởi tạo hàm điều hướng từ react-router-dom

  const onSubmitSearch = handleSubmit((data) => {  // Hàm xử lý khi submit form
    const config = queryConfig.order  // Kiểm tra xem có cấu hình 'order' trong queryConfig hay không
      ? omit(  // Nếu có, loại bỏ các trường 'order' và 'sort_by' khỏi config
          {
            ...queryConfig,
            name: data.name  // Thêm giá trị 'name' từ form vào config
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name  // Nếu không có 'order', chỉ thêm 'name' vào config
        }
    navigate({  // Điều hướng đến đường dẫn sản phẩm lọc với các tham số query mới
      pathname: path.filterProduct,  // Đường dẫn đến trang lọc sản phẩm
      search: createSearchParams(config).toString()  // Chuyển config thành query string
    })
  })
  return { onSubmitSearch, register }  // Trả về các hàm cần thiết cho component sử dụng
}
