import TableData from '../../component/TableData'
import FirstForm from '../../component/FormAdd'
import { useEffect, useState } from 'react'
import adminApi from 'src/apis/admin.api'
import 'src/Styles/CheckBoxBrand.scss'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useQuery } from 'react-query'
function Products() {
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false)

  const queryConfig = useQueryConfig()
  const { refetch } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return adminApi.getAllProducts()
    }
  })
  useEffect(() => {
    if (shouldRefetch) {
      refetch()
      setShouldRefetch(false) // Đặt shouldRefetch lại sau khi fetchData đã được gọi
    }
  }, [shouldRefetch])
  const handleCreatSuccess = () => {
    setShouldRefetch(true)
  }
  return (
    <div className='flex flex-col  gap-8 border border-gray-200 rounded-lg w-full px-4 pt-4   scrollable-container '>
      <h1 className='font items-center text-[24px] font-bold text-center'>Quản lý thông tin sản phẩm</h1>
      <FirstForm
        initialValues={{}}
        onFormInstanceReady={() => {}}
        onImageDataReceived={() => {}}
        onCreated={handleCreatSuccess}
      ></FirstForm>
      <TableData shouldRefetch={shouldRefetch} />
    </div>
  )
}

export default Products
