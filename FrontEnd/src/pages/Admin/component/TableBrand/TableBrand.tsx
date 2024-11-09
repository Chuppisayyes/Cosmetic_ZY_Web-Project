import { Space, Table } from 'antd'
import type { TableProps } from 'antd'

import adminApi from 'src/apis/admin.api'
import { useQuery } from 'react-query'

import useQueryConfig from 'src/hooks/useQueryConfig'
import { useEffect, useState } from 'react'

import { AiFillEdit } from 'react-icons/ai'
import { FaEye } from 'react-icons/fa6'
import { Brand } from 'src/types/brand.type'
import FormBrandEdit from '../FormBrandEdit'

interface props {
  handleView: (id: string) => void
}
function TableBrand({ handleView }: props) {
  const [editBrandId, setEditBrandId] = useState<string | null>(null)
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false)
  const queryConfig = useQueryConfig()

  const handleEdit = (brandId: string) => {
    setEditBrandId(brandId) // Set the ID of the user being edited
  }

  const handleUpdateSuccess = () => {
    setShouldRefetch(true) // Trigger fetchData khi cập nhật thành công
  }
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return adminApi.getAllProducts()
    }
  })
  const products = productsData?.data.data

  const columns: TableProps<Brand>['columns'] = [
    {
      title: 'Thương hiệu',
      dataIndex: 'name',
      key: 'name'
      // render: (text) => <Link to='/'>{text}</Link>
    },
    {
      title: 'Số lượng',
      dataIndex: '_id',
      key: '_id',
      render: (brandId: string) => {
        let totalQuantity = 0
        if (products)
          products.forEach((product: any) => {
            if (product.brand._id === brandId) {
              totalQuantity++
            }
          })
        return totalQuantity
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size='middle'>
          <button
            type='button'
            className='bg-none text-black transition-colors hover:text-rose-400'
            onClick={() => handleView(record._id)}
          >
            <FaEye className='text-[20px]' />
          </button>
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

  const { data: brandsData, refetch } = useQuery({
    queryKey: ['brands', queryConfig],
    queryFn: () => {
      return adminApi.getBrands()
    }
  })

  useEffect(() => {
    if (shouldRefetch) {
      refetch()
      setShouldRefetch(false) // Đặt shouldRefetch lại sau khi fetchData đã được gọi
    }
  }, [shouldRefetch])
  if (brandsData) {
    return (
      <>
        {/* Render the FormAccountEdit component if editUserId is not null */}
        {editBrandId !== null && (
          <FormBrandEdit
            brandId={editBrandId}
            onClose={() => setEditBrandId(null)}
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
          dataSource={brandsData.data.data}
        />
      </>
    )
  }
}

export default TableBrand
