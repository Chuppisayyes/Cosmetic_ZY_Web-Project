import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import Input from 'src/components/Input'
import { useMutation } from 'react-query'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import styles from 'src/Styles/Login.module.scss'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.contexts'
import authApi from 'src/apis/auth.api'
import { toast } from 'react-toastify'
import path from 'src/constants/path'

// Định nghĩa kiểu dữ liệu cho form
type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext) // Lấy context để quản lý trạng thái đăng nhập
  const navigate = useNavigate() // Sử dụng hook để điều hướng sau khi đăng ký thành công
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(registerSchema) }) // Sử dụng hook react-hook-form với validation từ yup

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body) // Mutation đăng ký tài khoản
  })

  // Hàm xử lý khi người dùng gửi form
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password']) // Loại bỏ confirm_password khỏi body khi gửi dữ liệu
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true) // Đánh dấu người dùng đã đăng nhập
        setProfile(data.data.data.user) // Lưu thông tin người dùng vào context
        toast.success('Tài khoản đăng ký thành công!', {
          autoClose: 1300 // Tự động đóng thông báo sau 1.3 giây
        })
        navigate(path.login) // Điều hướng đến trang đăng nhập
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
        toast.error('Tài khoản đăng thất bại!', {
          autoClose: 1300 // Tự động đóng thông báo sau 1.3 giây
        })
      }
    })
  })
  return (
    <div className='bg-yellow pt-8'>
      <div className='h-auto xl:h-[683px]'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-5 py-8 lg:py-14 lg:pr-10 bg-white border rounded-xl'>
            <div className='lg:col-span-3 lg:col-start-1 px-6 h-[533px] '>
              <img
                src='https://tronhouse.com/assets/data/editor/source/tai-sao-hinh-anh-san-pham-thuong-duoc-chup-tren-nen-trang/chup-anh-sang-tao-2.jpg'
                alt=''
                className='h-[533px] w-full object-cover'
              />
            </div>
            <div className='lg:col-span-2 lg:col-start-4 place-content-center '>
              <form className='p-10 roundedshadow-sm' onSubmit={onSubmit} noValidate>
                <div className={styles.text}>
                  <span className='text-4xl'>Đăng Ký</span>
                </div>
                <Input
                  name='email'
                  register={register}
                  type='email'
                  className='mt-8'
                  errorMessage={errors.email?.message}
                  placeholder='Email'
                />
                <Input
                  name='password'
                  register={register}
                  type='password'
                  className='mt-2 relative'
                  errorMessage={errors.password?.message}
                  placeholder='Password'
                  autoComplete='on'
                />

                <Input
                  name='confirm_password'
                  register={register}
                  type='password'
                  className='mt-2 relative'
                  errorMessage={errors.confirm_password?.message}
                  placeholder='Confirm Password'
                  autoComplete='on'
                />
                <div className='mt-3'>
                  <button className='w-full text-center py-4 border rounded-lg  px-2 uppercase bg-pink_3 text-white text-sm hover:bg-pink_3/90'>
                    Đăng Ký
                  </button>
                </div>
                <div className='flex items-center justify-center mt-8'>
                  <div className={styles.text}>
                    <span className='text-gray-400 text-xl'>Bạn đã có tài khoản?</span>
                  </div>
                  <div className={styles.text}>
                    <Link
                      className='text-pink_2 ml-1  text-xl'
                      to='/login'
                      onClick={() => {
                        window.scrollTo(0, 0)
                      }}
                    >
                      Đăng Nhập
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
