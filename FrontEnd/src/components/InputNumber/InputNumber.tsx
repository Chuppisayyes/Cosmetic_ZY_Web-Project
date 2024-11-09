import { forwardRef, InputHTMLAttributes, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string // Thông báo lỗi
  classNameInput?: string // Lớp CSS tùy chỉnh cho input
  classNameError?: string // Lớp CSS tùy chỉnh cho thông báo lỗi
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string) // Quản lý giá trị nội bộ của input

  // Hàm xử lý sự kiện thay đổi giá trị input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    // Kiểm tra nếu giá trị là số hoặc chuỗi rỗng
    if (/^\d+$/.test(value) || value === '') {
      // Thực thi callback onChange nếu có
      onChange && onChange(event)
      // Cập nhật giá trị localValue trong state
      setLocalValue(value)
    }
  }

  return (
    <div className={className}>
      {/* Input field */}
      <input
        className={classNameInput}
        onChange={handleChange}
        value={value || localValue} // Hiển thị giá trị từ props hoặc state
        {...rest}
        ref={ref} // Gắn ref cho input
      />
      {/* Hiển thị thông báo lỗi nếu có */}
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
