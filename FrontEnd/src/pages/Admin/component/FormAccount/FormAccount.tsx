import { Space, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import { Link } from 'react-router-dom'
import adminApi from 'src/apis/admin.api'
import { useQuery } from 'react-query'
import { User } from 'src/types/user.type'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useEffect, useState } from 'react'
import FormAccountEdit from '../FormAccountEdit'
import { AiFillEdit } from 'react-icons/ai'

function FormAccount() {
  const [editUserId, setEditUserId] = useState<string | null>(null) // State to store the ID of the user being edited
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false)
  const [userData, setUserData] = useState<any>(null)
  const handleEdit = (userId: string) => {
    setEditUserId(userId) // Set the ID of the user being edited
  }

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <Link to='/'>{text}</Link>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Link to='/'>{text}</Link>
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },

    {
      title: 'Roles',
      key: 'roles',
      dataIndex: 'roles',
      render: (_, { roles }) => (
        <>
          {roles.map((role) => {
            let color = role.length > 5 ? 'geekblue' : 'green'
            if (role === 'User') {
              color = 'red'
            }
            return (
              <Tag color={color} key={role}>
                {role.toUpperCase()}
              </Tag>
            )
          })}
        </>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size='middle'>
          {/* <button
            onClick={() => handleDelete(record._id)}
            className='bg-none text-black transition-colors hover:text-rose-400'
          >
            <MdDelete className='text-[20px]' />
          </button> */}
          <button
            type='button'
            onClick={() => handleEdit(record._id)}
            className='bg-none text-black transition-colors hover:text-rose-400'
          >
            <AiFillEdit className='text-[20px]' />
          </button>
        </Space>
      )
    }
  ]
  const queryConfig = useQueryConfig()
  const fetchData = async () => {
    try {
      const userData = await adminApi.getAllUser()
      setUserData(userData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (shouldRefetch) {
      fetchData()
      setShouldRefetch(false) // Đặt shouldRefetch lại sau khi fetchData đã được gọi
    }
  }, [shouldRefetch])

  const handleUpdateSuccess = () => {
    setShouldRefetch(true) // Trigger fetchData khi cập nhật thành công
  }

  const { data: usersData } = useQuery({
    queryKey: ['users', queryConfig],
    queryFn: () => {
      return adminApi.getAllUser()
    }
  })

  // const deleteUserMutation = useMutation({
  //   mutationFn: adminApi.deleteUser,
  //   onSuccess: () => {
  //     refetch()
  //   }
  // })
  // const handleDelete = (userId: string) => {
  //   Modal.confirm({
  //     title: 'Xác nhận xoá',
  //     content: 'Bạn có chắc chắn muốn xoá người dùng này?',
  //     okText: 'Xoá',
  //     cancelText: 'Hủy',
  //     async onOk() {
  //       try {
  //         await deleteUserMutation.mutate([userId])
  //         message.success('Xoá người dùng thành công')
  //         refetch() // Refetch data after successful deletion
  //       } catch (error) {
  //         message.error('Xoá người dùng thất bại: ')
  //       }
  //     },

  //     okButtonProps: {
  //       style: {
  //         backgroundColor: '#b94545'
  //       }
  //     }
  //   })
  // }
  if (userData) {
    return (
      <>
        {/* Render the FormAccountEdit component if editUserId is not null */}
        {editUserId !== null && (
          <FormAccountEdit
            userId={editUserId}
            onClose={() => setEditUserId(null)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}

        {/* Render the table */}
        <Table
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['4', '8', '12'],
            defaultPageSize: 4
          }}
          columns={columns}
          dataSource={userData.data.data}
        />
      </>
    )
  } else if (usersData) {
    return (
      <>
        {/* Render the FormAccountEdit component if editUserId is not null */}
        {editUserId !== null && (
          <FormAccountEdit
            userId={editUserId}
            onClose={() => setEditUserId(null)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}

        {/* Render the table */}
        <Table
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['4', '8', '12'],
            defaultPageSize: 4
          }}
          columns={columns}
          dataSource={usersData.data.data}
        />
      </>
    )
  }
}

export default FormAccount
