import React, { useState, useEffect } from 'react'
import { Form, GetProp, Input, Modal, Upload, UploadProps, message } from 'antd'

import adminApi from 'src/apis/admin.api'
import { toast } from 'react-toastify'
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

interface CollectionCreateFormProps {
  brandId: any

  onClose: () => void
  onUpdateSuccess: () => void
}

const FormBrandEdit: React.FC<CollectionCreateFormProps> = ({ brandId, onClose, onUpdateSuccess }) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any>([])
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [brandData, setbrandData] = useState<any>(null)
  const [image, setImage] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const brandDataResponse = await adminApi.getBrandsbyID(brandId) // Thay đổi thành getUserById
        setbrandData(brandDataResponse.data)
        form.setFieldsValue(brandDataResponse.data.data) // Thiết lập giá trị mặc định cho các trường
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (brandId) {
      fetchUserData()
    }
  }, [brandId]) // Thêm form vào dependencies

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      await adminApi.updateBrand([brandId], values)
      console.log(previewImage)
      console.log(previewOpen)
      toast.success('Chỉnh sửa thương hiệu thành công', {
        position: 'top-right',
        autoClose: 1200
      })
      onUpdateSuccess()
      onClose()
    } catch (error) {
      toast.error('Chỉnh sửa thương hiệu thất bại', {
        position: 'top-right',
        autoClose: 1200
      })
    }
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
  const uploadProfileImg = async (formData: any) => {
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dvpgs36ca/image/upload', formData)
      const { url, asset_id, etag } = res.data
      return { url, asset_id, etag }
    } catch (err) {
      console.log(err)
    }
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
  useEffect(() => {
    if (brandData?.data.image) {
      setImage(brandData.data.image)
    }
  }, [brandData])
  const handleRemove = (e: any) => {
    // Nếu item được xóa là `image` mặc định
    if (image && e.uid === '-1') {
      setImage(null) // Xóa `image` và thiết lập lại state
    } else if (fileList) {
      // Xử lý xóa item khỏi `fileList` nếu nó không phải là `image` mặc định
      const index = fileList.findIndex((f: { uid: string }) => f.uid === e.uid)
      if (index !== -1) {
        const newFileList = [...fileList]
        newFileList.splice(index, 1)
        setFileList(newFileList)
      }
    }
  }
  return (
    <Modal
      open
      width={700}
      title=''
      onCancel={onClose}
      onOk={handleSave}
      destroyOnClose
      okText='Save'
      cancelText='Cancel'
      okButtonProps={{
        style: {
          backgroundColor: '#b94545' // Đổi màu của nút Save thành màu đỏ
        }
      }}
    >
      <Form {...formItemLayout} form={form} initialValues={brandData}>
        <div className='flex flex-col  gap-4 border border-gray-200 rounded-lg w-full px-4 pt-2  font  '>
          <h1 className='font items-center text-[14px] font-bold text-center'>Form chỉnh sửa thương hiệu</h1>
          <div className=' '>
            <div className=' w-full'>
              <Form.Item label='Ảnh chính' name='image' initialValue={image}>
                <Upload
                  name='avatar'
                  action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
                  listType='picture-card'
                  fileList={image ? [{ uid: '-1', name: 'image.png', url: image }] : fileList}
                  maxCount={1}
                  onPreview={handlePreview}
                  beforeUpload={beforeUpload}
                  onRemove={(e) => handleRemove(e)}
                  customRequest={(e) => upLoadImage(e)}
                >
                  {fileList.length <= 0 && image === null ? (
                    <div>
                      <div
                        style={{
                          marginTop: 8
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  ) : null}
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
    </Modal>
  )
}

export default FormBrandEdit
