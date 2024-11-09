import { useState } from 'react'  // Import hook useState từ React

import InputNumber, { InputNumberProps } from '../InputNumber/InputNumber'  // Import component InputNumber

// Định nghĩa kiểu Props cho component QuantityController
interface Props extends InputNumberProps {
  max?: number  // Giá trị tối đa cho số lượng
  onIncrease?: (value: number) => void  // Callback khi tăng số lượng
  onDecrease?: (value: number) => void  // Callback khi giảm số lượng
  onType?: (value: number) => void  // Callback khi nhập giá trị
  onFocusOut?: (value: number) => void  // Callback khi mất focus
  classNameWrapper?: string  // Class để thay đổi kiểu dáng của wrapper
}

export default function QuantityController({
  max,  // Nhận giá trị max từ Props
  onIncrease,  // Nhận callback onIncrease từ Props
  onDecrease,  // Nhận callback onDecrease từ Props
  onType,  // Nhận callback onType từ Props
  classNameWrapper = 'w-[40px] h-[45px]',  // Lớp CSS mặc định cho wrapper
  onFocusOut,  // Nhận callback onFocusOut từ Props
  value,  // Nhận giá trị ban đầu
  ...rest  // Nhận các thuộc tính khác (rest)
}: Props) {
  // Khởi tạo state localValue để quản lý giá trị số lượng
  const [localValue, setLocalValue] = useState<number>(Number(value || 0))

  // Hàm xử lý thay đổi giá trị khi người dùng nhập
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)  // Lấy giá trị người dùng nhập vào
    if (max !== undefined && _value > max) {
      _value = max  // Nếu giá trị nhập vào vượt quá max, gán giá trị bằng max
    } else if (_value < 1) {
      _value = 1  // Nếu giá trị nhập vào nhỏ hơn 1, gán giá trị bằng 1
    }
    onType && onType(_value)  // Gọi callback onType nếu có
    setLocalValue(_value)  // Cập nhật giá trị state
  }

  // Hàm xử lý khi nhấn nút tăng
  const increase = () => {
    let _value = Number(value || localValue) + 1  // Tăng giá trị lên 1
    if (max !== undefined && _value > max) {
      _value = max  // Nếu giá trị tăng vượt quá max, gán giá trị bằng max
    }
    onIncrease && onIncrease(_value)  // Gọi callback onIncrease nếu có
    setLocalValue(_value)  // Cập nhật giá trị state
  }

  // Hàm xử lý khi nhấn nút giảm
  const decrease = () => {
    let _value = Number(value || localValue) - 1  // Giảm giá trị đi 1
    if (_value < 1) {
      _value = 1  // Nếu giá trị giảm xuống dưới 1, gán giá trị bằng 1
    }
    onDecrease && onDecrease(_value)  // Gọi callback onDecrease nếu có
    setLocalValue(_value)  // Cập nhật giá trị state
  }

  // Hàm xử lý khi input mất focus (blur)
  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(event.target.value))  // Gọi callback onFocusOut nếu có
  }

  return (
    <div className={'flex  items-center justify-center border-2 border-gray-200 rounded-full'}>
      {/* Nút giảm */}
      <button
        className={'flex items-center px-3  rounded-l-full hover:bg-gray-200' + classNameWrapper}
        onClick={decrease}
      >
        <span role='img' className='anticon'>
          {/* Icon dấu trừ */}
          <svg width='14' height='2' viewBox='0 0 14 2' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2L1 0ZM13 2C13.5523 2 14 1.55228 14 1C14 0.447715 13.5523 0 13 0V2ZM1 2L13 2V0L1 0L1 2Z'
              fill='black'
            ></path>
          </svg>
        </span>
      </button>

      {/* Input number để người dùng nhập giá trị */}
      <InputNumber
        className=''
        classNameError='hidden'  // Ẩn thông báo lỗi
        classNameInput={'flex items-center pl-2 md:pl-3 text-[13px]  md:text-base font-bold justify-center ' + classNameWrapper}
        onChange={handleChange}  // Gọi handleChange khi giá trị thay đổi
        onBlur={handleBlur}  // Gọi handleBlur khi mất focus
        value={value || localValue}  // Hiển thị giá trị (giá trị mặc định là state localValue)
        {...rest}  // Truyền các thuộc tính còn lại cho InputNumber
      />

      {/* Nút tăng */}
      <button
        className={'flex items-center px-3  rounded-l-full hover:bg-gray-200' + classNameWrapper}
        onClick={increase}
      >
        <span role='img' className='anticon'>
          {/* Icon dấu cộng */}
          <svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M1 6C0.447715 6 0 6.44772 0 7C0 7.55228 0.447715 8 1 8L1 6ZM13 8C13.5523 8 14 7.55228 14 7C14 6.44772 13.5523 6 13 6V8ZM1 8L13 8V6L1 6L1 8Z'
              fill='black'
            ></path>
            <path
              d='M6 13C6 13.5523 6.44772 14 7 14C7.55228 14 8 13.5523 8 13L6 13ZM8 1C8 0.447715 7.55228 -2.41411e-08 7 0C6.44771 2.41411e-08 6 0.447715 6 1L8 1ZM8 13L8 1L6 1L6 13L8 13Z'
              fill='black'
            ></path>
          </svg>
        </span>
      </button>
    </div>
  )
}
