import { Fragment, useRef } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

interface Props {
  onChange?: (file?: File) => void // Callback khi file được chọn
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null) // Sử dụng useRef để tham chiếu đến input file

  // Hàm xử lý khi người dùng thay đổi file
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0] // Lấy file được chọn từ input
    fileInputRef.current?.setAttribute('value', '') // Reset giá trị input sau khi chọn file

    // Kiểm tra dung lượng file và loại file
    if (fileFromLocal && (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      // Nếu file vượt quá dung lượng hoặc không phải hình ảnh thì hiển thị thông báo lỗi
      toast.error(`Dụng lượng file tối đa 1 MB. Định dạng:.JPEG, .PNG`, {
        position: 'top-center'
      })
    } else {
      // Nếu file hợp lệ, gọi hàm onChange (nếu có) và truyền file vào
      onChange && onChange(fileFromLocal)
    }
  }

  // Hàm mở cửa sổ chọn file
  const handleUpload = () => {
    fileInputRef.current?.click() // Kích hoạt click trên input file
  }

  return (
    <Fragment>
      {/* Input file ẩn, chỉ hiển thị qua nút bấm */}
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          // Reset giá trị file khi nhấn vào input
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(event.target as any).value = null
        }}
      />
      
      {/* Nút bấm để chọn file */}
      <button
        className='flex h-10 items-center justify-end rounded-lg border bg-white px-6 text-sm text-gray-600 shadow-sm '
        type='button'
        onClick={handleUpload} // Mở cửa sổ chọn file khi nhấn nút
      >
        Chọn ảnh
      </button>
    </Fragment>
  )
}
