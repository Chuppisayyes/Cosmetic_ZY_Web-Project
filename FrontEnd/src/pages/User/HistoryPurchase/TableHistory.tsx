import { Button, Image, Modal, Table, TableProps, Tag } from 'antd'
import { useQuery } from 'react-query'
import paymentApi from 'src/apis/payment.api'
import { Payment } from 'src/types/payment.type'
import { ClockCircleOutlined, SyncOutlined, CarOutlined, SmileOutlined, QuestionOutlined } from '@ant-design/icons'
import moment from 'moment'
import { formatCurrency } from 'src/utils/utils'
import { useState } from 'react'
import { FaCarSide } from 'react-icons/fa6'

export default function TableHistory() {
  const { data: paymentData } = useQuery({
    queryKey: ['payment'],
    queryFn: () => {
      return paymentApi.getPayment()
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
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let statusText
        let icon
        let color

        switch (status) {
          case 1:
            statusText = 'Đang chờ xác nhận'
            icon = <ClockCircleOutlined />
            color = 'volcano' // red-orange
            break
          case 2:
            statusText = 'Đang chuẩn bị'
            icon = <SyncOutlined spin />
            color = 'geekblue' // blue
            break
          case 3:
            statusText = 'Đang giao'
            icon = <CarOutlined />
            color = 'orange' // orange
            break
          case 4:
            statusText = 'Giao Thành công'
            icon = <FaCarSide />
            color = 'green' // yellow
            break
          case 5:
            statusText = 'Đã bị hủy'
            icon = <SmileOutlined />
            color = 'red' // green
            break
          default:
            statusText = 'Không xác định'
            icon = <QuestionOutlined />
            color = 'default' // grey
            break
        }

        return (
          <Tag icon={icon} color={color} className='flex justify-center items-center gap-1 '>
            {statusText}
          </Tag>
        )
      }
    }
  ]
  if (paymentData) {
    const { data }: any = paymentData
    const payment: any = data.data

    return (
      <>
        <Table
          pagination={{
            showSizeChanger: true, // Hiển thị tùy chọn lựa chọn pageSize
            pageSizeOptions: ['4', '6', '8'], // Các tùy chọn pageSize
            defaultPageSize: 6 // Kích thước mặc định của pageSize
          }}
          columns={columns}
          dataSource={payment}
        />
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
                <span className='text-center text-[16px] font-bold uppercase'>Hóa Đơn của bạn</span>

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
