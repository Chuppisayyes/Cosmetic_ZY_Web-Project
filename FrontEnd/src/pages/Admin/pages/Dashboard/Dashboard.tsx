// import ChartWeek from '../../component/ChartWeek'

import ChartWeek from '../../component/ChartWeek'

export default function Dashboard() {
  return (
    <div className='border border-gray-200 rounded-lg w-full px-4 pt-4 flex flex-col gap-8 '>
      <h1 className='font items-center text-[24px] font-bold text-center'>Quản lý doanh thu</h1>
      <ChartWeek></ChartWeek>
    </div>
  )
}
