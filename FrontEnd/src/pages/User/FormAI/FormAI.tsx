import { Button, ConfigProviderProps, Form, Image, Input, Modal, Select, SelectProps } from 'antd'
import { useEffect, useState } from 'react'
import userApi from 'src/apis/user.api'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import logo from 'src/assets/logo.png'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { generateNameId } from 'src/utils/utils'
type SizeType = ConfigProviderProps['componentSize']
const options: SelectProps['options'] = [
  { label: 'mụn ẩn', value: 'mụn ẩn' },
  { label: 'mụn viêm', value: 'mụn viêm' },
  { label: 'da không đều màu', value: 'da không đều màu' },
  { label: 'lỗ chân lông to', value: 'lỗ chân lông to' },
  { label: 'sợi bã nhờn', value: 'sợi bã nhờn' },
  { label: 'mụn đầu đen', value: 'mụn đầu đen' },
  { label: 'tàn nhan', value: 'tàn nhan' },
  { label: 'thâm mụn', value: 'thâm mụn' }
]

const options2: SelectProps['options'] = [
  { label: 'Trắng da', value: 'Trắng da' },
  { label: 'Giảm mụn viêm', value: 'Giảm mụn viêm' },
  { label: 'Giảm dầu thừa', value: 'Giảm dầu thừa' },
  { label: 'Giảm mụn đầu đen', value: 'Giảm mụn đầu đen' },
  { label: 'Se khít lỗ chân lông', value: 'Se khít lỗ chân lông' },
  { label: 'Dưỡng ẩm', value: 'Dưỡng ẩm' },
  { label: 'Giảm thâm mụn', value: 'Giảm thâm mụn' },
  { label: 'Giảm tàn nhan', value: 'Giảm tàn nhan' },
  { label: 'Đều màu da', value: 'Đều màu da' }
]

interface SkincareForm {
  _id?: string
  user: string
  sex: string
  desired_routine: string
  skin_type: string
  skin_condition: string[]
  desired_improv: string[]
  additionalData: string
  reasoning: string
}

export default function FormAI() {
  const [form] = Form.useForm()
  const [size] = useState<SizeType>('middle')
  const [hovered, setHovered] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [userId, setUserId] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setdata] = useState<SkincareForm>({
    user: '',
    sex: '',
    desired_routine: '',
    skin_type: '',
    skin_condition: [],
    desired_improv: [],
    additionalData: '',
    reasoning: ''
  })

  const createHealthFormMutation = useMutation({
    mutationFn: userApi.createSkincareForm,
    onSuccess: (res: any) => {
      toast.success('Thêm thông tin thành công', { autoClose: 1200 })
      localStorage.setItem('Id_form', res.data.data._id)
      setIsSubmitting(false)
    },
    onError: () => {
      // toast.error('Có lỗi xảy ra, vui lòng thử lại', { autoClose: 1200 })
      setIsSubmitting(true)
    }
  })

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setIsSubmitting(true)
      toast.info('Đang xử lý...')
      await createHealthFormMutation.mutateAsync(values)
    } catch (error) {
      // handle form validation errors here if needed
      setIsSubmitting(false)
    }
  }
  const getSkincareFormDetail = useMutation({
    mutationFn: userApi.getSkincareFormDetail
  })
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })

  useEffect(() => {
    refetch()
  }, [data])
  useEffect(() => {
    form.setFieldsValue({
      user: profileData?.data.data?._id,
      sex: data ? data.sex : undefined,
      desired_routine: data ? data.desired_routine : undefined,
      skin_type: data ? data.skin_type : undefined,
      skin_condition: data ? data.skin_condition : undefined,
      desired_improv: data ? data.desired_improv : undefined
      // ... set values for other fields
    })
    console.log(form.getFieldValue)
  }, [data])

  // Hàm để hiển thị modal
  const showModal = async () => {
    setIsModalVisible(true)
    const value = localStorage.getItem('Id_form') ?? ''

    try {
      const productDetail: any = await getSkincareFormDetail.mutateAsync(value)
      setProducts(productDetail.data.products)
      setdata(productDetail.data.data)
    } catch (error) {
      console.log(error, 'show')
    }
  }

  // Hàm để đóng modal
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div className='rounded-md bg-white px-2 pb-10 shadow md:px-7 md:pb-20 font relative '>
      <div className='border-b border-b-gray-200 py-6 relative'>
        <h1 className='text-lg font-medium capitalize text-gray-900 '>
          <span className=' h-[25px] w-[25px] text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57]'>
            AI
          </span>{' '}
          hỗ trợ chu trình skincare
        </h1>
        <div className='mt-1 text-sm text-gray-700'>Vui lòng nhập form thông tin dưới đây để được hỗ trợ</div>
        {profileData && (
          <Form form={form} onFinish={handleSubmit} disabled={isSubmitting}>
            <div className='flex gap-2 w-full border border-gray-200 p-4 rounded-lg mt-3'>
              <div className='  flex flex-col gap-6 item-center justify-center'>
                <div className='flex gap-6'>
                  {' '}
                  <div className='flex flex-col gap-2'>
                    <span className='text-[15px]'>ID User</span>
                    <Form.Item name='user' initialValue={profileData?.data.data?._id} style={{ width: 180 }}>
                      <Input style={{ width: '100%' }} disabled />
                    </Form.Item>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className='text-[15px]'>Loại da</span>
                    <Form.Item name='skin_type'>
                      <Select
                        style={{ width: 180 }}
                        options={[
                          { value: 'Da dầu', label: 'Da dầu' },
                          { value: 'Da khô', label: 'Da khô' },
                          { value: 'Da hỗn hợp thiên dầu', label: 'Da hỗn hợp thiên dầu' },
                          { value: 'Da thường', label: 'Da thường' },
                          { value: 'Da nhạy cảm', label: 'Da nhạy cảm' }
                        ]}
                      />
                    </Form.Item>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className='text-[15px]'>Tình trạng da</span>
                    <Form.Item name='skin_condition'>
                      <Select
                        mode='multiple'
                        size={size}
                        placeholder='Please select'
                        style={{ width: 300 }}
                        options={options}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className='flex gap-8'>
                  <div className='flex flex-col gap-2'>
                    <span className='text-[15px]'>Giới tính</span>
                    <Form.Item
                      name='sex'
                      initialValue={data ? data.sex : undefined}
                      rules={[{ required: true, message: 'Please input!' }]}
                    >
                      <Select
                        defaultValue={data ? data.sex : undefined}
                        style={{ width: 100 }}
                        options={[
                          { value: 'male', label: 'Nam' },
                          { value: 'female', label: 'Nữ' }
                        ]}
                      />
                    </Form.Item>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className='text-[15px]'>Chu trình mong muốn</span>
                    <Form.Item name='desired_routine'>
                      <Select
                        defaultValue='Vui lòng chọn'
                        style={{ width: 200 }}
                        options={[
                          { value: 'makeup remover + cleanser + moisturizer', label: 'Chu trình đơn giản' },
                          {
                            value: 'makeup remover + cleanser + toner + serum + moisturizer',
                            label: 'Chu trình đầy đủ'
                          }
                        ]}
                      />
                    </Form.Item>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className='text-[15px]'>Mong muốn cải thiện</span>
                    <Form.Item name='desired_improv'>
                      <Select
                        mode='multiple'
                        size={size}
                        placeholder='Vui lòng chọn'
                        style={{ width: 350 }}
                        options={options2}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className='w-full flex items-center justify-center'>
                <button
                  className=' w-full h-[150px] text-gray-100  font-bold rounded-full bg-gradient-to-r from-[#f0a80edb] via-[#c43131d8] to-[#671f57d1]'
                  disabled={isSubmitting}
                >
                  <img
                    src='https://go4customer.com/images/blog/SIMPLE%20CHATBOTS.png'
                    alt=''
                    className={`w-[180px] h-[120px]  transform transition-transform duration-500 ease-in-out ${
                      hovered ? 'hover:animate-customAnimation' : ''
                    }`}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  />
                </button>
              </div>
            </div>
          </Form>
        )}

        <div className='absolute top-0 right-0    text-gray-100  rounded-full bg-gradient-to-r from-[#f0a80edb] via-[#c43131d8] to-[#671f57d1] w-[50px] h-[50px] flex justify-center items-center'>
          Mới
        </div>
      </div>
      <div className='border-b border-b-gray-200 py-6 '>
        <button
          onClick={() => showModal()}
          className=' text-gray-100  rounded-full bg-gradient-to-r from-[#f0a80edb] via-[#c43131d8] to-[#671f57d1] w-[140px] flex justify-center items-center p-3'
          disabled={!localStorage.getItem('Id_form')}
        >
          Xem chi tiết
        </button>
      </div>
      <Modal
        title=''
        width={1000}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Đóng
          </Button>
        ]}
      >
        <div className='flex flex-col border-2 border-gray-100 rounded-lg p-4 font relative'>
          <span className='text-center text-[16px] font-bold uppercase'>GỢI Ý CHU TRÌNH CHO BẠN</span>

          <div className='px-2 flex flex-col gap-3 mt-2 relative'>
            <div className='flex gap-6'>
              <span className='text-start text-[14px] font-semibold '>
                Tên người dùng: <span className='font-normal'>{data?.user}</span>{' '}
              </span>
              <span className='text-start text-[14px] font-semibold '>
                Giới tính : <span className='font-normal'>{data?.sex}</span>{' '}
              </span>
            </div>
            <div className='flex gap-6'>
              <span className='text-start text-[14px] font-semibold '>
                Loại Da: <span className='font-normal'>{data?.skin_type}</span>{' '}
              </span>
              <span className='text-start text-[14px] font-semibold '>
                Tình Trạng Da: <span className='font-normal'> {data?.skin_condition?.join(', ')}</span>{' '}
              </span>
            </div>
            <div className='flex gap-[54px]'>
              <span className='text-start text-[14px] font-semibold flex-[40%]'>
                Chu trình mong muốn:{' '}
                <span className='font-normal'>
                  {data?.desired_routine === 'makeup remover + cleanser + moisturizer'
                    ? 'chu trình đơn giản'
                    : 'chu trình đầy đủ'}
                </span>{' '}
              </span>
              <span className='text-start text-[14px] font-semibold  flex-[60%] '>
                Mong muốn cải thiện: <span className='font-normal'>{data?.desired_improv.join(', ')}</span>{' '}
              </span>
            </div>
          </div>
          <div className='flex gap-[54px] px-2 mt-4 w-full'>
            <div className='text-start text-[14px] font-semibold border-2  border-gray-200 rounded-lg p-4 '>
              Lời khuyên:{' '}
              <div className='font-normal px-4'>
                <ul className='list-disc'>
                  <li>{data?.additionalData}</li>
                </ul>
              </div>{' '}
            </div>
          </div>

          <table className='table-auto w-full mt-5 text-[12px] border-2 border-gray-100 rounded-lg p-4'>
            <thead>
              <tr>
                <th className='px-4 py-2 text-center w-[10%] text-[12px]'>Bước</th>
                <th className='px-4 py-2 text-center text-[12px]'>Ảnh</th>
                <th className='px-4 py-2 text-center w-[40%] text-[12px]'>Tên sản phẩm</th>{' '}
                <th className='px-4 py-2 text-center text-[12px]'>Công dụng</th>
              </tr>
            </thead>
            {products.map((product, index) => (
              <tbody key={index}>
                <>
                  <tr>
                    <td className='px-4 py-2 text-center'>Bước {index + 1}</td>
                    <td className='px-4 py-2 text-center'>
                      <Image width={80} src={product?.image} style={{ borderRadius: '5px' }} />
                    </td>

                    <td className='py-2 text-start pl-10'>
                      {' '}
                      <Link
                        to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}
                        className=' h-[419px] font '
                        onClick={() => {
                          window.scrollTo(0, 0)
                        }}
                      >
                        {product?.name}
                      </Link>
                    </td>
                    <td className='px-4 py-2 text-start'>{product?.uses}</td>
                  </tr>
                </>
              </tbody>
            ))}
          </table>
          <div className='flex gap-[54px] px-2 mt-4 w-full items-center justify-center'>
            <div>
              <strong>
                <em>
                  Làn da đẹp không phải là sự hoàn hảo mà là sự tự tin và yêu thương bản thân. Hãy yêu và chăm sóc da
                  của mình.
                </em>
              </strong>
            </div>
          </div>
          <div className='absolute top-[-50] right-0'>
            <img src={logo} alt='' className='w-[240px] h-[100px]' />
          </div>
        </div>
      </Modal>
    </div>
  )
}
