import { useEffect } from 'react'

import FormAccount from '../../component/FormAccount'
import { useQuery } from 'react-query'
import adminApi from 'src/apis/admin.api'
import useQueryConfig from 'src/hooks/useQueryConfig'

interface Role {
  role1: number
  role2: number
}

export default function Accounts() {
  const queryConfig = useQueryConfig()
  const { data: usersData } = useQuery({
    queryKey: ['users', queryConfig],
    queryFn: () => {
      return adminApi.getAllUser()
    }
  })

  const handleGetAllAccount = async () => {
    const roleCounts: Role = {
      role1: 0,
      role2: 0
    }
    if (usersData)
      usersData.data.data.forEach((item: { roles: string[] }) => {
        if (item.roles.includes('Admin')) {
          roleCounts.role1++
        } else if (item.roles.includes('User')) {
          roleCounts.role2++
        }
      })
  }

  useEffect(() => {
    handleGetAllAccount()
  }, [usersData])

  return (
    <div className='border border-gray-200 rounded-lg w-full px-4 pt-4 flex flex-col gap-8 '>
      <h1 className='font items-center text-[24px] font-bold text-center'>Quản lý thông tin người dùng</h1>
      <FormAccount></FormAccount>
    </div>
  )
}
