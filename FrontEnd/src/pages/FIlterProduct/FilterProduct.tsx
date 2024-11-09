import { Breadcrumb } from 'antd'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import 'src/Styles/Header.scss'
import Filter from './component/Fillter'
import Pagination from 'src/components/Pagination'

import Product from 'src/components/Product'
import path from 'src/constants/path'
import { ProductListConfig } from 'src/types/product.type'
import { isUndefined, omit, omitBy } from 'lodash'
import useQueryParams from 'src/hooks/useQueryParams'
import { useQuery } from 'react-query'
import productApi from 'src/apis/product.api'
import { sortBy, order as orderConstant } from 'src/constants/product'

// Kiểu dữ liệu cho queryConfig
export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function FilterProduct() {
  // Lấy các tham số từ URL (queryParams)
  const queryParams: QueryConfig = useQueryParams()
  const navigate = useNavigate()

  // Tạo đối tượng queryConfig từ queryParams với các giá trị mặc định
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1', // Trang hiện tại
      limit: queryParams.limit || 12, // Số lượng sản phẩm trên một trang
      sort_by: queryParams.sort_by, // Cách sắp xếp sản phẩm
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order, // Thứ tự sắp xếp (tăng dần hoặc giảm dần)
      price_max: queryParams.price_max, // Giá tối đa
      price_min: queryParams.price_min, // Giá tối thiểu
      rating_filter: queryParams.rating_filter, // Lọc theo đánh giá
      category: queryParams.category, // Loại sản phẩm
      brand: queryParams.brand, // Thương hiệu sản phẩm
      status: 1 // Trạng thái sản phẩm (1 có thể là sản phẩm đang bán)
    },
    isUndefined // Loại bỏ các tham số không có giá trị
  )

  // Dùng useQuery để lấy dữ liệu sản phẩm từ API
  const { data } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true // Giữ dữ liệu cũ khi có thay đổi query
  })

  // Lấy thứ tự sắp xếp từ queryConfig
  const { order } = queryConfig

  // Hàm xử lý thay đổi thứ tự sắp xếp theo giá
  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.filterProduct,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price, // Sắp xếp theo giá
        order: orderValue // Thứ tự sắp xếp
      }).toString()
    })
  }

  // Hàm xử lý xóa tất cả bộ lọc
  const handleRemoveAll = () => {
    navigate({
      pathname: path.filterProduct,
      search: createSearchParams(
        omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category', 'brand', 'limit', 'page', 'status'])
      ).toString()
    })
    // setRadioValue(null) // Dòng này không cần thiết vì không có logic để xử lý radio
  }

  return (
    <div className='h-full flex flex-col font '>
      <div className='min-h-32'>
        {data && (
          <div className='flex flex-col gap-2 my-4 md:mx-10 xl:mx-20'>
            <div className='flex'>
              <Breadcrumb
                items={[ // Mục Breadcrumb để hiển thị các đường dẫn
                  {
                    title: <Link to={path.home}>Trang chủ</Link> // Liên kết đến trang chủ
                  },
                  {
                    title: <Link to={path.filterProduct}>Trang sản phẩm</Link> // Liên kết đến trang sản phẩm
                  }
                ]}
              />
            </div>
            <div className='text-base xl:text-2xl font-bold uppercase mt-5'>Tất cả sản phẩm</div>
            <div className=' mt-4 xl:flex xl:justify-between'>
              <div className='text-sm xl:text-lg font-bold uppercase'>Bộ Lọc</div>
              <div className='mt-3 md:mt-0 flex justify-around xl:justify-between flex-wrap gap-6'>
                {/* Nút xóa tất cả bộ lọc */}
                <button
                  onClick={handleRemoveAll}
                  className='flex flex-wrap gap-3 items-center justify-center border rounded-lg border-gray-100 bg-gray-200 p-2 xl:p-3 hover:opacity-80'
                >
                  Xóa tất cả bộ lọc
                </button>
                <div className='flex flex-wrap gap-3 items-center justify-center'>
                  <span>Lọc Theo</span>
                  <select
                    className='px-4 capitalize bg-white text-black text-left outline-none'
                    value={order || ''}
                    onChange={(event) =>
                      handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)
                    }
                  >
                    <option value='' disabled className='bg-white text-black'>
                      Tất Cả
                    </option>
                    <option value={orderConstant.asc}>Giá: Thấp đến cao</option> {/* Lọc theo giá tăng dần */}
                    <option value={orderConstant.desc}>Giá: Cao đến thấp</option> {/* Lọc theo giá giảm dần */}
                  </select>
                </div>
              </div>
            </div>

            <div className='xl:grid gap-1 xl:gap-5' style={{ gridTemplateColumns: '20% 80%' }}>
              <div>
                <Filter /> {/* Component bộ lọc */}
              </div>
              {data.data.data.products.length > 0 ? ( // Nếu có sản phẩm
                <div className='flex flex-col items-center justify-center'>
                  <div className='mt-6 grid md:grid-cols-2 xl:grid-cols-4 gap-5'>
                    {data.data.data.products.map((product) => ( // Lặp qua các sản phẩm để hiển thị
                      <div className='col-span-1' key={product._id}>
                        <Product product={product} /> {/* Hiển thị thông tin sản phẩm */}
                      </div>
                    ))}
                  </div>
                  <Pagination queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size} /> {/* Phân trang */}
                </div>
              ) : (
                <div className='w-full flex justify-center items-center'>
                  <img src='https://drive.gianhangvn.com/image/empty-cart.jpg' alt='' className='w-full rounded-2xl' /> {/* Hiển thị hình ảnh nếu không có sản phẩm */}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
