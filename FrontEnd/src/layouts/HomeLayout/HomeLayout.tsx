import { ConfigProvider, FloatButton } from 'antd'  // Nhập các component từ thư viện Ant Design
import Footer from 'src/components/Footer'  // Nhập component Footer từ thư mục components
import Header from 'src/components/Header'  // Nhập component Header từ thư mục components
import NavHeader from 'src/components/NavHeader'  // Nhập component NavHeader từ thư mục components
import { UpOutlined } from '@ant-design/icons'  // Nhập icon 'UpOutlined' từ thư viện Ant Design
import { useEffect, useState } from 'react'  // Nhập các hook useEffect và useState từ React

interface Props {
  children?: React.ReactNode  // Định nghĩa kiểu Props, cho phép truyền con (children) vào component
}

export default function HomeLayout({ children }: Props) {
  // Định nghĩa theme cho các component trong Ant Design
  const myTheme = {
    components: {
      FloatButton: {
        fontSizeIcon: 24,  // Kích thước icon trong button
        controlHeightLG: 60  // Chiều cao của button ở kích thước lớn
      }
    }
  }
  const myTheme1 = {
    components: {
      FloatButton: {
        colorPrimary: '#f37874',  // Màu sắc chủ đạo của button
        colorPrimaryHover: '#f37874c54',  // Màu khi hover (di chuột) vào button
        fontSizeIcon: 13,  // Kích thước icon trong button
        controlHeightLG: 40  // Chiều cao của button ở kích thước lớn
      }
    }
  }

  const [showFloatButton, setShowFloatButton] = useState(false)  // State để kiểm soát việc hiển thị nút cuộn lên

  useEffect(() => {
    // Hàm xử lý sự kiện khi cuộn trang
    function handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      setShowFloatButton(scrollTop > window.innerHeight)  // Hiển thị nút cuộn lên khi scroll vượt quá chiều cao cửa sổ
    }

    window.addEventListener('scroll', handleScroll)  // Thêm sự kiện cuộn trang
    return () => {
      window.removeEventListener('scroll', handleScroll)  // Xóa sự kiện khi component bị hủy
    }
  }, [])

  // Hàm cuộn trang lên trên cùng
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // Cuộn mượt mà lên trên
    })
  }

  return (
    <div className='relative'>
      <NavHeader />  
      <Header /> 
      {children} 
      <Footer />  
      <div className='absolute bottom-0 left-0 z-100 '>
        <ConfigProvider theme={myTheme}> 
          <FloatButton.Group
            trigger='click'  // Thiết lập trigger cho nhóm nút (click)
            style={{
              left: 40  // Đặt khoảng cách bên trái cho nhóm nút
            }}
            icon={
              <img className='hidden xl:inline' src='https://res.cloudinary.com/dpqdfe1al/image/upload/v1707192725/ICON_-03_lpozdn.png' alt='' />  // Icon ẩn trên màn hình nhỏ, hiển thị trên màn hình lớn
            }
          >
            <FloatButton icon={<img src='https://page.widget.zalo.me/static/images/2.0/Logo.svg' alt='' />} />  
            <FloatButton
              icon={
                <img src='https://res.cloudinary.com/dpqdfe1al/image/upload/v1706522050/messenger_zyke2c.png' alt='' />  // Nút Messenger
              }
            />
          </FloatButton.Group>
        </ConfigProvider>
        <ConfigProvider theme={myTheme1}> 
          {showFloatButton && (  // Kiểm tra nếu scrollTop vượt quá chiều cao cửa sổ thì hiển thị nút cuộn lên
            <FloatButton
              shape='circle'  // Đặt hình dạng nút là hình tròn
              type='primary'  // Đặt kiểu nút là nút chính (primary)
              style={{ right: 35 }}  // Đặt khoảng cách bên phải cho nút
              icon={<UpOutlined />}  // Icon của nút là mũi tên lên
              onClick={scrollToTop}  // Gọi hàm cuộn lên khi nhấn nút
            />
          )}
        </ConfigProvider>
      </div>
    </div>
  )
}
