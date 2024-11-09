import React, { useState, useEffect } from 'react'
import {
  Button,
  Form,
  Input,
  Modal,
  ConfigProvider,
  type FormInstance,
  Upload,
  message,
  GetProp,
  UploadProps
} from 'antd'

import adminApi from 'src/apis/admin.api'

import { Product } from 'src/types/product.type'
import axios from 'axios'

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

  const uploadProfileImg = async (formData: any) => {
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dvpgs36ca/image/upload', formData)
      const { url, asset_id, etag } = res.data
      return { url, asset_id, etag }
    } catch (err) {
      console.log(err)
    }
  }

  const [fileList, setFileList] = useState<any>([])
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
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  return (
    <Form
      {...formItemLayout}
      variant='filled'
      form={form}

      // initialValues={initialValues}
    >
      <div className='flex flex-col  gap-4 border border-gray-200 rounded-lg w-full px-4 pt-2  font  '>
        <h1 className='font items-center text-[14px] font-bold text-center'>Form chỉnh sửa thương hiệu</h1>
        <div className=' '>
          <div className=' w-full'>
            <Form.Item label='Ảnh chính' name='image'>
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
          </div>{' '}
          <div className='  w-full'>
            <Form.Item label='Tên sản phẩm' name='name'>
              <Input />
            </Form.Item>
          </div>
        </div>

        <Form.Item label='Mô tả sản phẩm' name='description' style={{ width: '100%', height: '200px' }}>
          <Input.TextArea className=' resize-none' style={{ height: '200px' }} />
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
      await adminApi.createBrand(values)
      formInstance?.resetFields()
      onCreate(values)
    } catch (error) {
      // console.log('Failed:', error)
    }
  }
  return (
    <Modal
      width={700}
      open={open}
      title=' Tạo Thương Hiệu Mới'
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

const FormBrand: React.FC<CollectionCreateFormProps> = ({ onCreated }) => {
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
        <Button type='primary' onClick={() => setOpen(true)} className='w-28 bg-[#d86967]'>
          Add Brand
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

export default FormBrand
