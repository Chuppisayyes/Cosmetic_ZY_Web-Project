// Nhập các thư viện cần thiết
import { range } from 'lodash'         // Nhập hàm range từ lodash để tạo các dãy số
import { useState } from 'react'       // Nhập hook useState từ React để quản lý trạng thái
import 'src/Styles/CheckBoxBrand.scss' // Nhập file CSS để áp dụng các kiểu cho component

// Định nghĩa interface Props để quy định các props nhận vào của component
interface Props {
  onChange?: (value: Date) => void   // Hàm xử lý sự kiện thay đổi ngày, tháng, năm (tùy chọn)
  value?: Date                       // Giá trị ngày tháng năm hiện tại, kiểu Date (tùy chọn)
  errorMessage?: string              // Thông báo lỗi, kiểu chuỗi (tùy chọn)
}

// Định nghĩa component DateSelect để chọn ngày tháng năm
export default function DateSelect({ value, onChange, errorMessage }: Props) {
  
  // Khởi tạo trạng thái ban đầu cho ngày, tháng, năm dựa trên giá trị từ prop "value"
  const [date, setDate] = useState({
    date: value?.getDate() || 1,             // Ngày, mặc định là 1 nếu không có giá trị từ "value"
    month: value?.getMonth() || 0,           // Tháng, mặc định là 0 (tức tháng 1) nếu không có giá trị từ "value"
    year: value?.getFullYear() || 1990       // Năm, mặc định là 1990 nếu không có giá trị từ "value"
  })

  // Hàm xử lý khi thay đổi giá trị ngày, tháng, năm từ các ô chọn (select)
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = event.target
    const newDate = {
      ...date,
      [name]: value   // Cập nhật giá trị mới cho trường ngày, tháng hoặc năm tương ứng
    }
    setDate(newDate)   // Cập nhật trạng thái mới
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))   // Gọi hàm onChange với giá trị Date mới
  }

  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row '>
      {/* Label cho trường ngày sinh */}
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          {/* Dropdown chọn ngày */}
          <select
            onChange={handleChange}
            name='date'
            className='h-10 w-[32%] cursor-pointer rounded-md border border-black/10 px-3 hover:border-rose-800 scrollable-container'
            value={value?.getDate() || date.date}
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => ( // Tạo các tùy chọn từ 1 đến 31 cho ngày
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Dropdown chọn tháng */}
          <select
            onChange={handleChange}
            name='month'
            className='h-10 w-[32%] cursor-pointer rounded-md border border-black/10 px-3 hover:border-rose-800 scrollable-container'
            value={value?.getMonth() || date.month}
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((item) => ( // Tạo các tùy chọn từ 1 đến 12 cho tháng (0 = tháng 1)
              <option value={item} key={item}>
                {item + 1}               // Hiển thị giá trị từ 1 đến 12
              </option>
            ))}
          </select>

          {/* Dropdown chọn năm */}
          <select
            onChange={handleChange}
            name='year'
            className='h-10 w-[32%] cursor-pointer rounded-md border border-black/10 px-3 hover:border-rose-800 scrollable-container'
            value={value?.getFullYear() || date.year}
          >
            <option disabled>Năm</option>
            {range(1990, 2024).map((item) => ( // Tạo các tùy chọn từ 1990 đến 2023 cho năm
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        
        {/* Hiển thị thông báo lỗi nếu có */}
        <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
      </div>
    </div>
  )
}
