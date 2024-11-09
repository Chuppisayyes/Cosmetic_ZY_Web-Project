import useRouteElements from './useRouteElements'  // Nhập custom hook useRouteElements để lấy các route elements
import { ToastContainer } from 'react-toastify'  // Nhập ToastContainer từ react-toastify để hiển thị thông báo
import 'react-toastify/dist/ReactToastify.css'  // Nhập file CSS cho react-toastify
import { useEffect, useContext } from 'react'  // Nhập các hook useEffect và useContext từ React
import { LocalStorageEventTarget } from './utils/auth'  // Nhập đối tượng LocalStorageEventTarget từ utils để quản lý sự kiện với localStorage
import { AppContext } from './contexts/app.contexts'  // Nhập AppContext từ thư mục contexts

function App() {
  const routeElements = useRouteElements()  // Gọi hook để lấy các route elements
  const { reset } = useContext(AppContext)  // Lấy hàm reset từ AppContext để reset ứng dụng khi cần

  useEffect(() => {
    // Đăng ký sự kiện để lắng nghe khi localStorage bị xóa
    LocalStorageEventTarget.addEventListener('clearLS', reset)

    // Cleanup: loại bỏ sự kiện khi component bị hủy
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])  // Hook useEffect sẽ chạy lại khi hàm reset thay đổi

  return (
    <div>
      {routeElements} 
      <ToastContainer />  
    </div>
  )
}

export default App
