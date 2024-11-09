import { useState, useRef, useId, type ElementType } from 'react'
import { useFloating, FloatingPortal, arrow, shift, offset } from '@floating-ui/react-dom-interactions'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode // Nội dung hiển thị chính của Popover
  renderPopover: React.ReactNode // Nội dung popover sẽ được hiển thị khi popover mở
  className?: string // Lớp CSS tùy chọn cho phần tử gốc
  as?: ElementType // Cho phép thay đổi phần tử gốc (mặc định là 'div')
  initialOpen?: boolean // Trạng thái ban đầu của popover (mở hay đóng)
}

export default function Popover({ children, className, renderPopover, as: Element = 'div', initialOpen }: Props) {
  const [open, setOpen] = useState(initialOpen || false) // Quản lý trạng thái mở/đóng của popover
  const arrowRef = useRef<HTMLElement>(null) // Tham chiếu đến mũi tên của popover
  const { x, y, reference, floating, strategy, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })] // Cấu hình vị trí cho popover
  })
  const id = useId() // ID duy nhất cho popover
  const showPopover = () => {
    setOpen(true) // Mở popover khi di chuột vào phần tử
  }
  const hidePopover = () => {
    setOpen(false) // Đóng popover khi di chuột ra ngoài phần tử
  }
  return (
    <Element className={className} ref={reference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children} {/* Hiển thị nội dung chính của Popover */}
      <FloatingPortal id={id}> {/* Sử dụng FloatingPortal để hiển thị popover ngoài DOM của phần tử gốc */}
        <AnimatePresence> {/* Quản lý hiệu ứng khi popover xuất hiện hoặc biến mất */}
          {open && (
            <motion.div
              ref={floating}
              style={{
                position: strategy,
                top: y ?? 0, // Vị trí theo chiều dọc
                left: x ?? 0, // Vị trí theo chiều ngang
                width: 'max-content', // Độ rộng popover tự động thay đổi theo nội dung
                transformOrigin: `${middlewareData.arrow?.x}px top` // Tạo điểm gốc cho mũi tên
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }} // Hiệu ứng ban đầu (ẩn và thu nhỏ)
              animate={{ opacity: 1, transform: 'scale(1)' }} // Hiệu ứng khi hiển thị (mờ dần và phóng to)
              exit={{ opacity: 0, transform: 'scale(0)' }} // Hiệu ứng khi ẩn (thu nhỏ và mờ đi)
              transition={{ duration: 0.5 }} // Thời gian hiệu ứng
            >
              <span
                ref={arrowRef}
                className='border-x-transparent border-t-transparent border-b-white border-[11px] absolute translate-y-[-95%] z-10' // Mũi tên của popover
                style={{
                  left: middlewareData.arrow?.x, // Vị trí mũi tên theo chiều ngang
                  top: middlewareData.arrow?.y // Vị trí mũi tên theo chiều dọc
                }}
              />
              {renderPopover} {/* Hiển thị nội dung popover */}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
