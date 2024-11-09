import React, { useState } from 'react'
import { Upload } from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useMutation } from 'react-query'
import adminApi from 'src/apis/admin.api'
import { getAvatarUrl } from 'src/utils/utils'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
interface UploadimgsProps {
  onUpload: (data: string[]) => void
}
const Uploadimgs: React.FC<UploadimgsProps> = ({ onUpload }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    // }
  ])
  const uploadedDataArray: string[] = []
  const uploadImageMutaion = useMutation(adminApi.uploadImage)
  const onChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    const formData = new FormData()

    // Lặp qua mỗi file mới được chọn
    newFileList.forEach((file) => {
      formData.append('image', file.originFileObj || '')

      // Nếu file này chưa được tải lên trước đó, thêm nó vào mảng
      if (!uploadedDataArray.includes(file.uid)) {
        uploadedDataArray.push(file.uid)
      }
    })
    const removeBaseUrl = (url: string): string => {
      const baseUrl = 'http://localhost:4000/images/'
      return url.startsWith(baseUrl) ? url.slice(baseUrl.length) : url
    }
    // Lặp qua mỗi file đã được tải lên trước đó
    uploadedDataArray.forEach((url) => {
      // Nếu không tìm thấy URL trong fileList mới, loại bỏ nó khỏi mảng
      if (!newFileList.some((file) => file.url === url)) {
        const index = uploadedDataArray.indexOf(url)
        uploadedDataArray.splice(index, 1)
      }
    })

    // Thêm các file mới vào formData và cập nhật uploadedDataArray
    await Promise.all(
      newFileList.map(async (file) => {
        formData.append('image', file.originFileObj || '')
        const uploadRes = await uploadImageMutaion.mutateAsync(formData)
        const uploadedUrl = getAvatarUrl(uploadRes.data.data)
        uploadedDataArray.push(removeBaseUrl(uploadedUrl))
      })
    )

    // Tạo updatedFileList từ newFileList
    const updatedFileList: UploadFile<any>[] = newFileList.map((file) => {
      return {
        ...file,
        url: file.url, // Giữ nguyên URL của file
        status: 'done'
      }
    })

    const filteredUrls: string[] = uploadedDataArray.filter((url) => url.endsWith('.jpg')).map((url) => url.toString())
    setFileList(updatedFileList)
    onUpload(filteredUrls)
  }
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as FileType)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    const token = localStorage.getItem('profile')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:4000/admin/products/upload-images', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const responseData = await response.json()
      onSuccess(responseData, file)
    } catch (error) {
      onError(error)
    }
  }
  // console.log(fileList)
  return (
    <ImgCrop rotationSlider>
      <Upload
        action='http://localhost:4000/admin/products/upload-images'
        listType='picture-card'
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        customRequest={customRequest}
      >
        {fileList.length < 5 && '+ Upload'}
      </Upload>
    </ImgCrop>
  )
}

export default Uploadimgs
