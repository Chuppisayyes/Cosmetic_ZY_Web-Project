import { Button, Image, Modal, Table, TableProps } from 'antd'
import { useQuery } from 'react-query'

import { Payment } from 'src/types/payment.type'

import { formatCurrency } from 'src/utils/utils'
import { useState } from 'react'

import adminApi from 'src/apis/admin.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import moment from 'moment'

export default function TableOrder() {
  const queryConfig = useQueryConfig()
  const { data: paymentData } = useQuery({
    queryKey: ['payment', queryConfig],
    queryFn: () => {
      return adminApi.getAllOrder()
    }
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  // Hàm để hiển thị modal
  const showModal = (id: any) => {
    setSelectedId(id)
    setIsModalVisible(true)
  }

  // Hàm để đóng modal
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const columns: TableProps<Payment>['columns'] = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      render: (text, record) => (
        <button
          className='bg-clip-text text-transparent bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57]'
          onClick={() => showModal(record._id)}
        >
          {text}
        </button>
      )
    },
    {
      title: 'Tên người đặt',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'city',
      key: 'city'
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (text) => formatCurrency(text)
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('DD/MM/YYYY HH:mm:ss')
    }
  ]
  if (paymentData) {
    const { data }: any = paymentData
    const payment: any = data.data.slice(0, 3)

    return (
      <>
        {' '}
        <Table pagination={false} columns={columns} dataSource={payment} />
        <Modal
          title=''
          width={800}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key='back' onClick={handleCancel}>
              Đóng
            </Button>
          ]}
        >
          {' '}
          {payment
            .filter((payment: any) => payment._id === selectedId)
            .map((filteredPayment: any) => (
              <div className='flex flex-col border-2 border-gray-100 rounded-lg p-4 font' key={filteredPayment._id}>
                <span className='text-center text-[16px] font-bold uppercase'>Thông tin hóa đơn</span>

                <div className='px-2 flex flex-col gap-3'>
                  <span className='text-start text-[14px] font-semibold '>
                    Tên khách hàng: <span className='font-normal'>{filteredPayment.name}</span>{' '}
                  </span>
                  <div className='flex gap-6'>
                    <span className='text-start text-[14px] font-semibold '>
                      Số điện thoại: <span className='font-normal'>{filteredPayment.phone}</span>{' '}
                    </span>
                    <span className='text-start text-[14px] font-semibold '>
                      Địa chỉ: <span className='font-normal'>{filteredPayment.street}</span>{' '}
                    </span>
                    <span className='text-start text-[14px] font-semibold '>
                      Thành Phố: <span className='font-normal'>{filteredPayment.city}</span>{' '}
                    </span>
                  </div>
                  <div className='flex gap-[54px]'>
                    <span className='text-start text-[14px] font-semibold '>
                      Số lượng mặt hàng: <span className='font-normal'>{filteredPayment.purchases.length}</span>{' '}
                    </span>
                    <span className='text-start text-[14px] font-semibold '>
                      Tổng tiền thanh toán:{' '}
                      <span className='font-normal'>{formatCurrency(filteredPayment.totalMoney)} đ</span>{' '}
                    </span>
                  </div>
                </div>

                <table className='table-auto w-full mt-5 text-[12px] border-2 border-gray-100 rounded-lg p-4'>
                  <thead>
                    <tr>
                      <th className='px-4 py-2 text-center text-[12px]'>Ảnh</th>
                      <th className='px-4 py-2 text-center w-[50%] text-[12px]'>Tên sản phẩm</th>
                      <th className='px-4 py-2 text-center text-[12px]'>Số lượng</th>
                      <th className='px-4 py-2 text-center text-[12px]'>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayment.purchases.map((Item: any) => (
                      <>
                        <tr>
                          <td className='px-4 py-2 text-center'>
                            <Image width={80} src={Item.product.image} style={{ borderRadius: '5px' }} />
                          </td>
                          <td className='px-4 py-2'>{Item?.product.name}</td>
                          <td className='px-4 py-2 text-center'>{Item?.buy_count}</td>
                          <td className='px-4 py-2 text-center'>
                            {`${(Item?.product?.price * Item?.buy_count).toLocaleString()} VND`}
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </Modal>
      </>
    )
  }
}
