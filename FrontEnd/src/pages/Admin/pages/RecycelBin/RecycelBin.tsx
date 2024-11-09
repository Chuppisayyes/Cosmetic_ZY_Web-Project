import TableDataDelete from '../../component/TableDataDelete'

function RecycelBin() {
  return (
    <div className='flex flex-col  gap-8 border border-gray-200 rounded-lg w-full px-4 pt-4    '>
      <h1 className='font items-center text-[24px] font-bold text-center'>Quản lý sản phẩm đã xóa</h1>
      <TableDataDelete />
    </div>
  )
}

export default RecycelBin
