import { Navigate, Outlet, useRoutes } from 'react-router-dom'  // Nhập các thành phần liên quan đến routing từ react-router-dom
import Login from './pages/Login'  // Nhập component Login từ trang Login
import ProductList from './pages/ProductList'  // Nhập component ProductList từ trang danh sách sản phẩm
import Register from './pages/Register'  // Nhập component Register từ trang đăng ký
import MainLayout from './layouts/MainLayout'  // Nhập layout chính của ứng dụng
import { useContext } from 'react'  // Nhập hook useContext từ React để sử dụng context
import { AppContext } from './contexts/app.contexts'  // Nhập AppContext để lấy trạng thái toàn ứng dụng
import HomeLayout from './layouts/HomeLayout/HomeLayout'  // Nhập layout trang chủ
import FilterProduct from './pages/FIlterProduct'  // Nhập component lọc sản phẩm
import ProductDetail from './pages/ProductDetail'  // Nhập component chi tiết sản phẩm
import path from './constants/path'  // Nhập các định nghĩa đường dẫn
import Cart from './pages/Cart'  // Nhập component giỏ hàng
import Forgetpassword from './pages/ForgetPassword/ForgetPassword'  // Nhập component quên mật khẩu
import UserLayout from './layouts/UserLayout'  // Nhập layout của trang người dùng
import Profile from './pages/User/Profile'  // Nhập trang hồ sơ người dùng
import ChangePassword from './pages/User/ChangePassword'  // Nhập trang đổi mật khẩu người dùng
import HistoryPuchase from './pages/User/HistoryPurchase'  // Nhập trang lịch sử mua hàng của người dùng
import LayoutAdmin from './pages/Admin/layouts/LayoutAdmin'  // Nhập layout của trang admin
import Dashboard from './pages/Admin/pages/Dashboard'  // Nhập trang Dashboard của admin
import Accounts from './pages/Admin/pages/Accounts'  // Nhập trang tài khoản admin
import Products from './pages/Admin/pages/Products'  // Nhập trang sản phẩm admin
import Orders from './pages/Admin/pages/Orders'  // Nhập trang đơn hàng admin
import AdminLayout from './layouts/AdminLayout/AdminLayout'  // Nhập layout admin
import FormAI from './pages/User/FormAI'  // Nhập trang Form AI của người dùng
import FilterBrand from './pages/FIlterProduct/FilterBrand'  // Nhập trang lọc thương hiệu
import RecycelBin from './pages/Admin/pages/RecycelBin'  // Nhập trang thùng rác admin
import AdminProfile from './pages/Admin/pages/AdminProfile'  // Nhập trang hồ sơ admin
import Brands from './pages/Admin/pages/Brands'  // Nhập trang thương hiệu admin
import { useQuery } from 'react-query'  // Nhập hook useQuery từ react-query để lấy dữ liệu
import userApi from './apis/user.api'  // Nhập API để lấy thông tin người dùng

// Component bảo vệ route chỉ cho phép người dùng đã đăng nhập truy cập
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)  // Lấy trạng thái đăng nhập từ AppContext
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />  // Nếu đã đăng nhập, cho phép tiếp tục, nếu không chuyển hướng về trang login
}

// Component bảo vệ route chỉ cho phép người dùng chưa đăng nhập truy cập
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)  // Lấy trạng thái đăng nhập từ AppContext
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />  // Nếu chưa đăng nhập, cho phép tiếp tục, nếu không chuyển hướng về trang chủ
}

// Component bảo vệ route chỉ cho phép admin truy cập
function AdminRejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)  // Lấy trạng thái đăng nhập từ AppContext
  const { data: profileData } = useQuery({  // Lấy dữ liệu profile người dùng thông qua API
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data  // Lấy thông tin profile của người dùng

  // Nếu người dùng đã đăng nhập và có quyền admin, cho phép truy cập admin route, nếu không chuyển hướng về trang login
  return isAuthenticated && profile && profile.roles.includes('Admin') ? <Outlet /> : <Navigate to='/login' />
}

export default function useRouteElements() {
  // Xây dựng các route và xử lý bảo vệ các route theo trạng thái người dùng
  const routeElements = useRoutes([
    {
      path: '',  // Định nghĩa route mặc định
      element: <RejectedRoute />,  // Dùng RejectedRoute để bảo vệ các route cho người dùng chưa đăng nhập
      children: [
        {
          path: path.login,
          index: true,  // Đây là route mặc định trong nhóm này
          element: (
            <MainLayout>
              <Login />
            </MainLayout>
          )
        },
        {
          path: path.register,
          element: (
            <MainLayout>
              <Register />
            </MainLayout>
          )
        },
        {
          path: path.forgetpassword,
          index: true,
          element: (
            <MainLayout>
              <Forgetpassword />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: path.home,  // Route trang chủ
      index: true,
      element: (
        <HomeLayout>
          <ProductList /> 
        </HomeLayout>
      )
    },
    {
      path: path.filterProduct,  // Route lọc sản phẩm
      element: (
        <HomeLayout>
          <FilterProduct />
        </HomeLayout>
      )
    },
    {
      path: path.filterBrand,  // Route lọc theo thương hiệu
      element: (
        <HomeLayout>
          <FilterBrand />
        </HomeLayout>
      )
    },
    {
      path: path.productDetail,  // Route chi tiết sản phẩm
      element: (
        <HomeLayout>
          <ProductDetail />
        </HomeLayout>
      )
    },
    {
      path: '',  // Bảo vệ route cho người dùng đã đăng nhập
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,  // Route giỏ hàng
          index: true,
          element: (
            <HomeLayout>
              <Cart />
            </HomeLayout>
          )
        },
        {
          path: path.user,  // Route người dùng
          element: (
            <HomeLayout>
              <UserLayout />
            </HomeLayout>
          ),
          children: [
            {
              path: path.profile,  // Trang hồ sơ người dùng
              element: <Profile />
            },
            {
              path: path.changePassword,  // Trang thay đổi mật khẩu
              element: <ChangePassword />
            },
            {
              path: path.hitoryPurchase,  // Trang lịch sử mua hàng
              element: <HistoryPuchase />
            },
            {
              path: path.AIform,  // Trang Form AI
              element: <FormAI />
            }
          ]
        }
      ]
    },
    {
      path: '',  // Bảo vệ route cho admin chưa đăng nhập
      element: <AdminRejectedRoute />,
      children: [
        {
          path: path.admin,  // Route admin
          element: (
            <AdminLayout>
              <LayoutAdmin />
            </AdminLayout>
          ),
          children: [
            {
              index: true,
              path: path.dashboard,  // Trang Dashboard của admin
              element: <Dashboard />
            },
            {
              path: path.adminProfile,  // Trang hồ sơ admin
              element: <AdminProfile />
            },
            {
              path: path.accounts,  // Trang tài khoản admin
              element: <Accounts />
            },
            {
              path: path.products,  // Trang sản phẩm admin
              element: <Products />
            },
            {
              path: path.brands,  // Trang thương hiệu admin
              element: <Brands />
            },
            {
              path: path.orders,  // Trang đơn hàng admin
              element: <Orders />
            },
            {
              path: path.recycle,  // Trang thùng rác admin
              element: <RecycelBin />
            }
          ]
        }
      ]
    }
  ])

  return routeElements  // Trả về các route elements
}
