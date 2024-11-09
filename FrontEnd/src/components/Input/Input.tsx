import { InputHTMLAttributes, useState } from 'react'
import type { UseFormRegister, RegisterOptions } from 'react-hook-form'

// Định nghĩa Props cho component Input
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string // Thông báo lỗi (nếu có)
  classNameInput?: string // Lớp CSS cho phần input
  classNameError?: string // Lớp CSS cho phần thông báo lỗi
  classNameEye?: string // Lớp CSS cho icon mắt (toggle password visibility)
  register?: UseFormRegister<any> // Hàm register từ react-hook-form để kết nối với form
  rules?: RegisterOptions // Các quy tắc validation cho input
}

// Định nghĩa component Input
export default function Input({
  errorMessage,
  className,
  name,
  register,
  rules,
  classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm',
  classNameError = 'mt-1 text-red-400 min-h-[1.25rem] text-sm pl-1',
  classNameEye = 'absolute top-[12px] right-[14px] h-5 w-5 cursor-pointer',
  ...rest
}: Props) {
  const [openEye, setOpenEye] = useState(false) // Quản lý trạng thái của icon mắt (hiện mật khẩu hay không)

  // Kiểm tra và thực hiện register cho input nếu có
  const registerResult = register && name ? register(name, rules) : null

  // Hàm để toggle trạng thái mở/mắt của mắt
  const toggleEye = () => {
    setOpenEye((prev) => !prev)
  }

  // Xử lý thay đổi type của input nếu là password (hiện/ẩn mật khẩu)
  const handleType = () => {
    if (rest.type === 'password') {
      return openEye ? 'text' : 'password'
    }
    return rest.type
  }

  return (
    <div className={className}>
      {/* Input field */}
      <input className={classNameInput} {...registerResult} {...rest} type={handleType()} />
      
      {/* Icon mắt hiện mật khẩu khi type là password */}
      {rest.type === 'password' && openEye && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className={classNameEye}
          onClick={toggleEye}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
          />
          <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
        </svg>
      )}
      
      {/* Icon mắt ẩn mật khẩu khi type là password */}
      {rest.type === 'password' && !openEye && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className={classNameEye}
          onClick={toggleEye}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
          />
        </svg>
      )}

      {/* Hiển thị thông báo lỗi nếu có */}
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
