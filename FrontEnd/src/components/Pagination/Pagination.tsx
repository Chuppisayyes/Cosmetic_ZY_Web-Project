import classNames from 'classnames'  // Import thư viện classNames để dễ dàng quản lý các lớp CSS
import { Link, createSearchParams } from 'react-router-dom'  // Import các thành phần từ react-router-dom để xử lý điều hướng
import path from 'src/constants/path'  // Import đường dẫn tĩnh từ constants
import { QueryConfig } from 'src/pages/FIlterProduct/FilterProduct'  // Import kiểu dữ liệu cho cấu hình truy vấn từ trang lọc sản phẩm

interface Props {
  queryConfig: QueryConfig  // Cấu hình truy vấn nhận từ props
  pageSize: number  // Tổng số trang nhận từ props
}

/**
 * Chú thích về cách phân trang:
 * - Mỗi trang sẽ hiển thị một số lượng phần tử nhất định.
 * - Phân trang sẽ hiển thị số trang xung quanh trang hiện tại với một số lượng trang cố định (RANGE = 2).
 * - Dấu "..." được sử dụng để chỉ ra rằng có các trang bị ẩn.
 */

const RANGE = 2  // Số trang hiển thị trước và sau trang hiện tại
export default function Pagination({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)  // Chuyển đổi số trang hiện tại từ chuỗi sang số

  // Hàm render để tạo các nút phân trang
  const renderPagination = () => {
    let dotAfter = false  // Biến để kiểm tra đã hiển thị dấu "..." phía sau chưa
    let dotBefore = false  // Biến để kiểm tra đã hiển thị dấu "..." phía trước chưa

    // Hàm render dấu "..." trước các trang
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span
            key={index}
            className='mx-2 rounded border bg-white px-3 py-2 shadow-sm flex items-center justify-center'
          >
            ...
          </span>
        )
      }
      return null
    }

    // Hàm render dấu "..." sau các trang
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span
            key={index}
            className='mx-2 rounded border bg-white px-3 py-2 shadow-sm flex items-center justify-center'
          >
            ...
          </span>
        )
      }
      return null
    }

    // Vòng lặp qua tất cả các trang từ 1 đến pageSize để tạo các nút phân trang
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1

        // Điều kiện để hiển thị dấu "..." nếu trang hiện tại không đủ gần các trang đầu/cuối
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }

        // Render số trang bình thường
        return (
          <Link
            to={{
              pathname: path.filterProduct,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()  // Cập nhật trang hiện tại trong URL
              }).toString()
            }}
            key={index}
            className={classNames(
              'bg-white rounded-full p-2 shadow-sm mx-2 cursor-pointer border  w-10 h-10 flex items-center justify-center',
              {
                'border-gray-700': pageNumber === page,  // Đổi màu cho trang hiện tại
                'border-transparent': pageNumber !== page  // Các trang khác không có viền
              }
            )}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  return (
    <div className='flex flex-wrap mt-6 justify-center'>
      {/* Nút "Prev" (trang trước) */}
      {page === 1 ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: path.filterProduct,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()  // Giảm số trang khi nhấn vào "Prev"
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm'
        >
          Prev
        </Link>
      )}

      {/* Render các trang phân trang */}
      {renderPagination()}

      {/* Nút "Next" (trang sau) */}
      {page === pageSize ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm'>Next</span>
      ) : (
        <Link
          to={{
            pathname: path.filterProduct,
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()  // Tăng số trang khi nhấn vào "Next"
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm'
        >
          Next
        </Link>
      )}
    </div>
  )
}
