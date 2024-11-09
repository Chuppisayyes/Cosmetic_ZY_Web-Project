import { createContext, useState } from 'react'
import { ExtendedPurchase } from 'src/types/purchase.type'  // Import kiểu dữ liệu mở rộng cho giao dịch mua
import { User } from 'src/types/user.type'  // Import kiểu dữ liệu người dùng
import { getAccessTokenFromLS, getProfileFromLS, getUser } from 'src/utils/auth'  // Các hàm tiện ích để lấy thông tin từ localStorage

// Định nghĩa giao diện của context để lưu trữ các giá trị trạng thái và hàm setState
interface AppContextInterface {
  isAuthenticated: boolean  // Trạng thái người dùng đã đăng nhập hay chưa
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>  // Hàm để thay đổi trạng thái đăng nhập
  profile: User | null | any  // Thông tin hồ sơ người dùng
  setProfile: React.Dispatch<React.SetStateAction<User | null>>  // Hàm để thay đổi thông tin hồ sơ
  extendedPurchases: ExtendedPurchase[]  // Danh sách các giao dịch mua mở rộng
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>  // Hàm để thay đổi danh sách giao dịch mua
  reset: () => void  // Hàm để reset lại trạng thái
  user: User | null | any  // Thông tin người dùng
  setUser: (user: User | null) => void  // Hàm để thay đổi thông tin người dùng
}

// Giá trị khởi tạo của context, lấy từ localStorage hoặc mặc định
const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),  // Kiểm tra xem người dùng đã đăng nhập chưa bằng token lưu trong localStorage
  setIsAuthenticated: () => null,  // Hàm thay đổi trạng thái đăng nhập (ban đầu không làm gì)
  profile: getProfileFromLS(),  // Lấy thông tin hồ sơ người dùng từ localStorage
  setProfile: () => null,  // Hàm thay đổi thông tin hồ sơ (ban đầu không làm gì)
  extendedPurchases: [],  // Danh sách giao dịch mua ban đầu là rỗng
  setExtendedPurchases: () => null,  // Hàm thay đổi danh sách giao dịch mua (ban đầu không làm gì)
  reset: () => null,  // Hàm reset trạng thái (ban đầu không làm gì)
  user: getUser(),  // Lấy thông tin người dùng từ localStorage
  setUser: () => {}  // Hàm thay đổi thông tin người dùng (ban đầu không làm gì)
}

// Tạo context với giá trị khởi tạo
export const AppContext = createContext<AppContextInterface>(initialAppContext)

// Component Provider để bao bọc toàn bộ ứng dụng và cung cấp context cho các component con
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // Khai báo các state với giá trị khởi tạo
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>(initialAppContext.extendedPurchases)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  const [user, setUser] = useState<User | null>(initialAppContext.profile)

  // Hàm reset lại tất cả các trạng thái
  const reset = () => {
    setIsAuthenticated(false)  // Đặt lại trạng thái đăng nhập
    setExtendedPurchases([])  // Đặt lại danh sách giao dịch mua
    setProfile(null)  // Đặt lại thông tin hồ sơ
  }

  // Cung cấp giá trị context cho các component con
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendedPurchases,
        setExtendedPurchases,
        reset,
        user,
        setUser
      }}
    >
      {children}  {/* Render các component con */}
    </AppContext.Provider>
  )
}
