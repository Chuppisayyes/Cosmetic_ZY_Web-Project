import { useSearchParams } from 'react-router-dom'  // Import hook useSearchParams từ react-router-dom để làm việc với tham số truy vấn trong URL

export default function useQueryParams() {
  // Lấy tham số truy vấn từ URL
  const [searchParams] = useSearchParams()

  // Chuyển đổi các tham số truy vấn thành một đối tượng (key-value)
  return Object.fromEntries([...searchParams])
}
