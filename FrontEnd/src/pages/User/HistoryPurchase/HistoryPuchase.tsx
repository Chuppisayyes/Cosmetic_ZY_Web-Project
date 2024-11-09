import TableHistory from './TableHistory'

export default function HistoryPuchase() {
  return (
    <div className='rounded-md bg-white px-2 pb-10 shadow md:px-7 md:pb-20 '>
      <div className='border-b border-b-gray-200 py-6 font'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Lịch sử đơn hàng</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <div className='mt-2'>
        <TableHistory />
      </div>
    </div>
  )
}
