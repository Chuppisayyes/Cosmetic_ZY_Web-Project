import { ProductListConfig } from 'src/types/product.type'  // Import kiểu dữ liệu cấu hình danh sách sản phẩm
import { omitBy, isUndefined } from 'lodash'  // Import các hàm omitBy và isUndefined từ thư viện lodash
import useQueryParams from './useQueryParams'  // Import hook tùy chỉnh để lấy các tham số truy vấn từ URL

// Định nghĩa kiểu dữ liệu cho các tham số truy vấn, dựa trên kiểu dữ liệu ProductListConfig
export type QueryConfig = {
  [key in keyof ProductListConfig]: string  // Các tham số truy vấn phải là chuỗi
}

// Hook tùy chỉnh để cấu hình tham số truy vấn cho trang chủ hoặc danh sách sản phẩm
export default function useQueryConfig() {
  // Lấy các tham số truy vấn từ URL thông qua hook useQueryParams
  const queryParams: QueryConfig = useQueryParams()

  // Cấu hình lại tham số truy vấn bằng cách loại bỏ các tham số không xác định (undefined)
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',  // Nếu không có tham số 'page', mặc định là '1'
      limit: queryParams.limit || '12',  // Nếu không có tham số 'limit', mặc định là '12'
      sort_by: queryParams.sort_by,  // Tham số sắp xếp (nếu có)
      exclude: queryParams.exclude,  // Tham số loại trừ (nếu có)
      name: queryParams.name,  // Tên sản phẩm (nếu có)
      order: queryParams.order,  // Thứ tự sắp xếp (nếu có)
      price_max: queryParams.price_max,  // Giá tối đa (nếu có)
      price_min: queryParams.price_min,  // Giá tối thiểu (nếu có)
      rating_filter: queryParams.rating_filter,  // Lọc theo đánh giá (nếu có)
      category: queryParams.category,  // Danh mục sản phẩm (nếu có)
      brand: queryParams.brand,  // Thương hiệu sản phẩm (nếu có)
      status: 1  // Trạng thái mặc định là '1'
    },
    isUndefined  // Loại bỏ các tham số có giá trị là 'undefined'
  )

  // Trả về cấu hình tham số truy vấn đã được loại bỏ các tham số không xác định
  return queryConfig
}
