import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { HiArrowNarrowLeft } from 'react-icons/hi'
import userApi from 'src/apis/user.api' // Đảm bảo import hàm forgetPassword từ module API
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'

type FormData = Pick<Schema, 'email'>
const forgetpasswordSchema = schema.pick(['email']) // Sửa schema để phản ánh trường email

export default function Forgetpassword() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit
    // setError,
    // formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(forgetpasswordSchema) })

  const [showSuccess, setShowSuccess] = useState(false)

  const onSubmit = async (data: FormData) => {
    try {
      await userApi.forgetPassword({ email: data.email })
      setShowSuccess(true) // Hiển thị thông báo thành công
    } catch (error) {
      // toast.error('Mật khẩu chưa được gửi! Vui lòng thử lại', { autoClose: 1300 })
    }
  }

  useEffect(() => {
    if (showSuccess) {
      toast.success('Mật khẩu đã được gửi', { autoClose: 1300 })
      const timer = setTimeout(() => {
        navigate('/login')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  return (
    <div className='bg-yellow pt-8 font'>
      <div className='h-auto xl:h-[683px] '>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-5 py-8 lg:py-14 lg:pr-10 bg-white border rounded-xl '>
            <div className='lg:col-span-3 lg:col-start-1 px-6'>
              <img
                src='https://bazaarvietnam.vn/wp-content/uploads/2020/01/my-pham-xanh-03-drunk-elephant-hibiscus.jpg'
                alt=''
              />
            </div>
            <form
              className='p-6 border-2 border-gray-100 rounded-lg  shadow-sm lg:col-span-2 lg:col-start-4 place-content-center'
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className='text-2xl mb-4 font-bold text-center'>Tìm kiếm tài khoản của bạn </div>
              <p className=' text-base mb-3'>Nhận mã xác minh được gửi đến email của bạn !</p>
              <div className='text-xl font-semibold'>Email address</div>
              <Input
                name='email'
                register={register}
                type='email' // Sử dụng register để kết nối trường input với react-hook-form
                className='mt-4'
                placeholder='Please Enter Your Email'
              />
              <div className='mt-1'>
                <button
                  type='submit' // Đặt type là submit để kích hoạt sự kiện handleSubmit
                  className='w-full text-center py-4 border rounded-lg  px-2 uppercase bg-pink_3 text-white text-sm hover:bg-pink_3/90'
                >
                  Send
                </button>
              </div>
              <div className='mx-auto mt-2 w-max'>
                <Link className='flex items-center text-sm font-medium gap-x-1 text-gray-600' to='/login'>
                  <HiArrowNarrowLeft />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
