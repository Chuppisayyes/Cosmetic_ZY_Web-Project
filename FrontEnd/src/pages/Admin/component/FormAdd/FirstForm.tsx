import React, { useState, useEffect } from 'react'
import {
  Button,
  Form,
  Input,
  Modal,
  ConfigProvider,
  Select,
  InputNumber,
  type FormInstance,
  Upload,
  message,
  GetProp,
  UploadProps
} from 'antd'

import adminApi from 'src/apis/admin.api'
import { useQuery } from 'react-query'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { Product } from 'src/types/product.type'
import axios from 'axios'
import { Brand } from 'src/types/brand.type'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}
interface Values {
  title?: string
  description?: string
  modifier?: string
}

interface CollectionCreateFormProps {
  initialValues: Values
  onFormInstanceReady: (instance: FormInstance<Values>) => void
  onImageDataReceived: (data: any) => void
  onCreated: () => void // Thêm prop onCreated vào interface
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({ onFormInstanceReady }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    onFormInstanceReady(form)
  }, [])
  // console.log(form)
  const queryConfig = useQueryConfig()
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', queryConfig],
    queryFn: () => {
      return adminApi.getcategories()
    }
  })
  const { data: brandsData } = useQuery({
    queryKey: ['brands', queryConfig],
    queryFn: () => {
      return adminApi.getBrands()
    }
  })

  const uploadProfileImg = async (formData: any) => {
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dvpgs36ca/image/upload', formData)
      const { url, asset_id, etag } = res.data
      return { url, asset_id, etag }
    } catch (err) {
      console.log(err)
    }
  }
  const uploadProfileImg1 = async (formData: any) => {
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dvpgs36ca/image/upload', formData)
      const { url, asset_id, etag } = res.data
      return { url, asset_id, etag }
    } catch (err) {
      console.log(err)
    }
  }
  const [fileList, setFileList] = useState<any>([])

  const [fileList1, setFileList1] = useState<any>([])
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  console.log(previewImage)
  console.log(previewOpen)
  const handleRemove = (e: any) => {
    const index = fileList?.findIndex((f: any) => f?.uid === e?.uid)
    const copyList = fileList.slice()
    copyList.splice(index, 1)
    setFileList([...copyList])
  }
  const handleRemove1 = (e: any) => {
    const index = fileList1?.findIndex((f: any) => f?.uid === e?.uid)
    const copyList = fileList1.slice()
    copyList.splice(index, 1)
    setFileList1([...copyList])
  }

  const getBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }
  /* Upload image with local */
  const upLoadImage = async (e: any) => {
    try {
      if (e.file) {
        const formData = new FormData()
        formData.append('file', e.file)
        formData.append('upload_preset', 'Health')
        const image = await uploadProfileImg(formData)
        console.log(image)
        setFileList((prevImagePaths: any) => [
          ...prevImagePaths,
          {
            url: image?.url
          }
        ])
        form.setFieldsValue({ image: image?.url })
      }
    } catch (error) {
      console.error(error)
    }
  }

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/webp file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const upLoadImage1 = async (e: any) => {
    try {
      if (e.file) {
        const formData = new FormData()
        formData.append('file', e.file)
        formData.append('upload_preset', 'Health')
        const image = await uploadProfileImg1(formData)
        console.log(image)
        console.log(image)
        if (image && image.url) {
          const newFileList1 = [...fileList1, { url: image.url }]
          setFileList1((prevImagePaths: any) => [
            ...prevImagePaths,
            {
              url: image?.url
            }
          ])
          const urls = newFileList1.map((file) => file.url)

          form.setFieldsValue({ images: urls })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const beforeUpload1 = async (fileList1: any, list: any) => {
    const prevList = fileList1.length
    const maxCount = list.length

    if (prevList + maxCount > 6) {
      return false
    }
    return true
  }
  return (
    <Form
      {...formItemLayout}
      variant='filled'
      form={form}
      className='grid grid-cols-2 grid-flow-row  w-full '
      // initialValues={initialValues}
    >
      <Form.Item label='Tên sản phẩm' name='name' rules={[{ required: true, message: 'Please input!' }]}>
        <Input style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label='Giá Hiện Tại' name='price' rules={[{ required: true, message: 'Please input!' }]}>
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label='Giá Cũ' name='price_before_discount' rules={[{ required: true, message: 'Please input!' }]}>
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label='Số lượng' name='quantity' rules={[{ required: true, message: 'Please input!' }]}>
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label='Mô tả sản phẩm' name='description' rules={[{ required: true, message: 'Please input!' }]}>
        <Input.TextArea />
      </Form.Item>

      <Form.Item label='Danh mục' name={['category']}>
        <Select style={{ width: 340 }}>
          {categoriesData?.data.data.map((category) => (
            <Select.Option key={category._id} value={category._id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label='Thương hiệu' name={['brand']}>
        <Select style={{ width: 340 }}>
          {brandsData?.data.data.map((brand: Brand) => (
            <Select.Option key={brand._id} value={brand._id}>
              {brand.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label='Công dụng' name='uses' rules={[{ required: true, message: 'Please input!' }]}>
        <Input.TextArea />
      </Form.Item>
      <div className=''>
        <Form.Item label='Ảnh chính' name='image' rules={[{ required: true, message: 'Please input!' }]}>
          <Upload
            name='avatar'
            action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
            listType='picture-card'
            fileList={fileList}
            maxCount={1}
            onPreview={handlePreview}
            beforeUpload={beforeUpload}
            onRemove={(e) => handleRemove(e)}
            customRequest={(e) => upLoadImage(e)}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <div
                  style={{
                    marginTop: 8
                  }}
                >
                  Upload
                </div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label='Ảnh minh họa' name='images' rules={[{ required: true, message: 'Please input!' }]}>
          <Upload
            name='images'
            action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
            listType='picture-card'
            fileList={fileList1}
            maxCount={5}
            onPreview={handlePreview}
            beforeUpload={beforeUpload1}
            onRemove={(e) => handleRemove1(e)}
            customRequest={(e) => upLoadImage1(e)}
          >
            {fileList.length > 5 ? null : (
              <div>
                <div
                  style={{
                    marginTop: 8
                  }}
                >
                  Upload
                </div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </div>
    </Form>
  )
}

interface CollectionCreateFormModalProps {
  open: boolean
  onCreate: (values: any) => void
  onCancel: () => void
  initialValues: Values
}

const CollectionCreateFormModal: React.FC<CollectionCreateFormModalProps> = ({
  open,
  onCreate,
  onCancel,
  initialValues
}) => {
  const [formInstance, setFormInstance] = useState<FormInstance>()
  const handleCreate = async () => {
    try {
      const values = (await formInstance?.validateFields()) as Promise<Product>
      // console.log('Form values:', values)
      await adminApi.createProduct(values)
      formInstance?.resetFields()
      onCreate(values)
    } catch (error) {
      // console.log('Failed:', error)
    }
  }
  return (
    <Modal
      width={1300}
      open={open}
      title=' Tạo Sản Phẩm Mới'
      okText='Create'
      cancelText='Cancel'
      okButtonProps={{ autoFocus: true }}
      onCancel={onCancel}
      destroyOnClose
      onOk={handleCreate}
    >
      <CollectionCreateForm
        initialValues={initialValues}
        onFormInstanceReady={(instance) => {
          setFormInstance(instance)
        }}
        onImageDataReceived={() => {}}
        onCreated={() => {}}
      />
    </Modal>
  )
}

const FristForm: React.FC<CollectionCreateFormProps> = ({ onCreated }) => {
  const [formValues, setFormValues] = useState<Values>()
  const [open, setOpen] = useState(false)
  console.log(formValues)
  const onCreate = (values: Values) => {
    setFormValues(values)
    setOpen(false)
    onCreated()
  }
  // console.log(formValues)

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: '#f08c8c',
              algorithm: true
            }
          }
        }}
      >
        <Button type='primary' onClick={() => setOpen(true)} className='w-32 bg-[#d86967]'>
          Add Product
        </Button>
      </ConfigProvider>
      <CollectionCreateFormModal
        open={open}
        onCreate={onCreate}
        onCancel={() => setOpen(false)}
        initialValues={{ modifier: 'public' }}
      />
    </>
  )
}

export default FristForm
