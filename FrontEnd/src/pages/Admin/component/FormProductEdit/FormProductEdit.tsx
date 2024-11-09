import React, { useState, useEffect } from 'react'
import { Form, GetProp, Input, message, Modal, Select, Upload, UploadProps } from 'antd'

import adminApi from 'src/apis/admin.api'
import { toast } from 'react-toastify'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useQuery } from 'react-query'

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
  productId: string

  onClose: () => void
  onUpdateSuccess: () => void
}

const FormProductEdit: React.FC<CollectionCreateFormProps> = ({ productId, onClose, onUpdateSuccess }) => {
  const [form] = Form.useForm()
  const [image, setImage] = useState(null)
  const [images, setImages] = useState(null)
  const [productData, setProductData] = useState<any>(null)
  const [initialCategoryValue, setInitialCategoryValue] = useState([''])
  const [fileList, setFileList] = useState<any>([])
  const [fileList1, setFileList1] = useState<any>([])
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const productDataResponse = await adminApi.getProduct([productId]) // Thay đổi thành getUserById
        setProductData(productDataResponse.data)
        form.setFieldsValue(productDataResponse.data.data) // Thiết lập giá trị mặc định cho các trường
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (productId) {
      fetchUserData()
    }
  }, [productId]) // Thêm form vào dependencies

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      await adminApi.updateProduct([productId], values)
      toast.success('Chỉnh sửa sản phẩm thành công', {
        position: 'top-right', // Vị trí hiển thị thông báo
        autoClose: 1200 // Thời gian tự động đóng thông báo sau 1200 mili giây (1.2 giây)
      })
      console.log(initialCategoryValue), console.log(previewImage)
      console.log(previewOpen)
      onUpdateSuccess() // Notify update success
      onClose()
    } catch (error) {
      toast.error('Chỉnh sửa sản phẩm thất bại', {
        position: 'top-right', // Vị trí hiển thị thông báo
        autoClose: 1200 // Thời gian tự động đóng thông báo sau 1200 mili giây (1.2 giây)
      })
    }
  }

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

  useEffect(() => {
    if (productData?.data.image) {
      setImage(productData.data.image)
    }
  }, [productData])

  useEffect(() => {
    if (productData?.data.images) {
      setImages(productData.data.images)
      const result = productData.data.images.map((item: any) => ({
        url: item
      }))
      console.log(result)
      setFileList1(result)
    }
  }, [productData])

  useEffect(() => {
    if (productData && productData.data && productData.data.category) {
      const categoryName = productData.data.category.name
      setInitialCategoryValue([categoryName])
    }
  }, [productData])
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
  const handleRemove1 = (e: any) => {
    if (images && e.uid === '-1') {
      setImages(null) // Xóa `image` và thiết lập lại state
    } else if (fileList1) {
      // Xử lý xóa item khỏi `fileList` nếu nó không phải là `image` mặc định
      const index = fileList1.findIndex((f: { uid: string }) => f.uid === e.uid)
      if (index !== -1) {
        const newFileList = [...fileList1]
        newFileList.splice(index, 1)
        setFileList1(newFileList)
      }
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

  const upLoadImage1 = async (e: any) => {
    try {
      if (e.file) {
        const formData = new FormData()
        formData.append('file', e.file)
        formData.append('upload_preset', 'Health')
        const image = await uploadProfileImg1(formData)

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

  const beforeUpload1 = async (list: any) => {
    const prevList = fileList1.length
    const maxCount = list.length

    if (prevList + maxCount > 6) {
      return false
    }
    return true
  }
  return (
    <Modal
      open
      width={1200}
      title='Edit Product'
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
      <Form {...formItemLayout} form={form} initialValues={productData}>
        <div className='grid grid-cols-2 grid-flow-row  w-full'>
          <Form.Item label='Tên sản phẩm' name='name'>
            <Input />
          </Form.Item>
          <Form.Item label='Giá hiện tại' name='price'>
            <Input />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 grid-flow-row  w-full'>
          <Form.Item label='Số lượng' name='quantity'>
            <Input />
          </Form.Item>
          <Form.Item
            label='Danh mục'
            name={['category']}
            initialValue={categoriesData?.data.data.map((category) => category.name)}
          >
            <Select style={{ width: 340 }} defaultValue={categoriesData?.data.data.map((category) => category.name)}>
              {categoriesData?.data.data.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 grid-flow-row  w-full'>
          <Form.Item label='Công dụng' name='uses'>
            <Input />
          </Form.Item>
          <Form.Item
            label='Thương Hiệu'
            name={['brand']}
            initialValue={brandsData?.data.data.map((brand) => brand.name)}
          >
            <Select style={{ width: 340 }} defaultValue={brandsData?.data.data.map((brand) => brand.name)}>
              {brandsData?.data.data.map((brand) => (
                <Select.Option key={brand._id} value={brand._id}>
                  {brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 grid-flow-row  w-full'>
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

          <Form.Item label='Ảnh minh họa' name='images' initialValue={images}>
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

        <Form.Item label='Mô tả sản phẩm' name='description' className=''>
          <Input.TextArea style={{ width: '100%', height: '200px' }} className=' resize-none' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FormProductEdit
