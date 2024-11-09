import React from 'react'  // Nhập React để sử dụng JSX
import ReactDOM from 'react-dom/client'  // Nhập ReactDOM để render ứng dụng vào DOM
import App from 'src/App'  // Nhập component chính App từ thư mục src
import './index.css'  // Nhập file CSS để áp dụng toàn bộ các kiểu dáng cho ứng dụng
import { BrowserRouter } from 'react-router-dom'  // Nhập BrowserRouter từ react-router-dom để quản lý routing trong ứng dụng
import { ReactQueryDevtools } from 'react-query/devtools'  // Nhập ReactQueryDevtools để debug các query từ react-query
import { QueryClient, QueryClientProvider } from 'react-query'  // Nhập QueryClient và QueryClientProvider từ react-query để quản lý trạng thái query
import { GoogleOAuthProvider } from '@react-oauth/google'  // Nhập GoogleOAuthProvider để tích hợp đăng nhập bằng Google OAuth
import { AppProvider } from './contexts/app.contexts'  // Nhập AppProvider từ app.contexts để cung cấp context toàn ứng dụng

// Tạo instance của QueryClient với các cài đặt mặc định
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false  // Không tự động refetch dữ liệu khi cửa sổ trình duyệt được lấy lại focus
    }
  }
})

// Render ứng dụng vào phần tử DOM có id 'root'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>  
    {/*// Kích hoạt chế độ Strict để kiểm tra các vấn đề về performance và warnings trong ứng dụng */}
    <GoogleOAuthProvider clientId='592312556131-qt9ab2tpfub1nup23vca71j7ln0a66vg.apps.googleusercontent.com'>
      {/* Cung cấp clientId cho Google OAuth để tích hợp đăng nhập bằng tài khoản Google */}
      <BrowserRouter>
        {/* Cung cấp BrowserRouter để quản lý navigation và routing trong ứng dụng */}
        <QueryClientProvider client={queryClient}>
          {/* Cung cấp QueryClientProvider để quản lý trạng thái và các request của react-query */}
          <AppProvider>
            {/* Cung cấp AppContext cho toàn bộ ứng dụng */}
            <App />  {/* Render component App */}
          </AppProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          {/* Hiển thị ReactQueryDevtools (công cụ giúp debug các query trong react-query) */}
        </QueryClientProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
