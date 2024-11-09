import React, { useState, useEffect } from 'react'
import { Form, Input, Modal, Select } from 'antd'
import adminApi from 'src/apis/admin.api'
import { toast } from 'react-toastify'

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

interface CollectionEditFormProps {
  userId: string
  onClose: () => void
  onUpdateSuccess: () => void
}

const FormAccountEdit: React.FC<CollectionEditFormProps> = ({ userId, onClose, onUpdateSuccess }) => {
  const [form] = Form.useForm()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataResponse = await adminApi.getUser([userId]) // Thay đổi thành getUserById
        setUserData(userDataResponse.data)
        form.setFieldsValue(userDataResponse.data.data) // Thiết lập giá trị mặc định cho các trường
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId, form]) // Thêm form vào dependencies

  const handleChange = (value: string) => {
    setUserData((prevUserData: any) => ({
      ...prevUserData,
      roles: [value]
    }))
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      await adminApi.updateUser([userId], { ...values, roles: userData.roles })
      toast.success('Chỉnh sửa người dùng thành công', {
        position: 'top-right', // Vị trí hiển thị thông báo
        autoClose: 1200 // Thời gian tự động đóng thông báo sau 1200 mili giây (1.2 giây)
      })
      onUpdateSuccess() // Notify update success
      onClose()
    } catch (error) {
      toast.error('Chỉnh sủa người dùng thất bại', {
        position: 'top-right', // Vị trí hiển thị thông báo
        autoClose: 1200 // Thời gian tự động đóng thông báo sau 1200 mili giây (1.2 giây)
      })
    }
  }

  return (
    <Modal
      open={!!userId}
      title='Edit User'
      onCancel={onClose}
      onOk={handleSave}
      destroyOnClose
      okButtonProps={{ style: { backgroundColor: '#be4734' } }}
    >
      <Form {...formItemLayout} form={form} initialValues={userData}>
        <Form.Item label='Email' name='email'>
          <Input style={{ width: '100%' }} disabled />
        </Form.Item>

        <Form.Item label='Name' name='name'>
          <Input style={{ width: '100%' }} disabled />
        </Form.Item>

        <Form.Item label='Phone' name='phone'>
          <Input style={{ width: '100%' }} disabled />
        </Form.Item>

        <Form.Item label='Address' name='address'>
          <Input style={{ width: '100%' }} disabled />
        </Form.Item>

        <Form.Item label='Roles' name={['roles']}>
          <Select style={{ width: 120 }} onChange={handleChange}>
            <Select.Option key='Admin' value='Admin'>
              Admin
            </Select.Option>
            <Select.Option key='User' value='User'>
              User
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FormAccountEdit
