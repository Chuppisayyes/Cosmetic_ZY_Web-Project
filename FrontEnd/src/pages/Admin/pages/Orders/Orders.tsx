import { useEffect, useState } from 'react'

import { useQuery } from 'react-query'
import adminApi from 'src/apis/admin.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
// import TableHistory from '../../component/TableHistory'
import ChartHistory from '../../component/ChartHistory'
import TableHistoryAdmin from '../../component/TableHistoryAdmin'

interface Role {
  role1: number
  role2: number
  role3: number
  role4: number
  role5: number
}

export default function Orders() {
  const queryConfig = useQueryConfig()
  const { data: paymentData } = useQuery({
    queryKey: ['payment', queryConfig],
    queryFn: () => {
      return adminApi.getAllOrder()
    }
  })

  const [role, setRole] = useState<Role>({
    role1: 0,
    role2: 0,
    role3: 0,
    role4: 0,
    role5: 0
  }) // Initialize role state with the Role type

  const handleGetAllAccount = async () => {
    const roleCounts: Role = {
      role1: 0,
      role2: 0,
      role3: 0,
      role4: 0,
      role5: 0
    }
    if (paymentData) {
      paymentData.data.data.forEach((item: { status: number }) => {
        if (item.status === 1) {
          roleCounts.role1++
        }
        if (item.status === 2) {
          roleCounts.role2++
        }
        if (item.status === 3) {
          roleCounts.role3++
        }
        if (item.status === 4) {
          roleCounts.role4++
        } else if (item.status === 5) {
          roleCounts.role5++
        }
      })
    }

    setRole(roleCounts)
  }

  useEffect(() => {
    handleGetAllAccount()
  }, [paymentData])

  console.log(paymentData)
  return (
    <div className='flex flex-col  gap-8 border border-gray-200 rounded-lg w-full px-4 pt-4    '>
      <h1 className='font items-center text-[24px] font-bold text-center'>Quản lý lịch sử đơn hàng</h1>
      <div className='flex items-center justify-center border-b-2 border-gray-200 w-full pb-8'>
        <ChartHistory role={role}></ChartHistory>
      </div>
      <TableHistoryAdmin></TableHistoryAdmin>
    </div>
  )
}
