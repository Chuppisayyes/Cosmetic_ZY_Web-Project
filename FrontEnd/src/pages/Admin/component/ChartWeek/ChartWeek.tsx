import { DollarCircleOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Space, Statistic } from 'antd'
import { useEffect, useState } from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import TableOrder from '../TableOrder'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useQuery } from 'react-query'
import adminApi from 'src/apis/admin.api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement)

function ChartWeek() {
  const [lengthAccount, setLengthAccount] = useState(0)
  const [lengthProduct, setLengthProduct] = useState(0)
  const [lengthOrder, setLengthOrder] = useState(0)
  useEffect(() => {
    const handleGetAllProduct = async () => {
      const result = await adminApi.getAllProducts()
      if (result?.data?.data.length > 0) {
        setLengthProduct(result?.data?.data.length)
      }
    }
    const handleGetAllAccount = async () => {
      const result = await adminApi.getAllUser()
      if (result?.data?.data.length > 0) {
        setLengthAccount(result?.data?.data.length)
      }
    }
    const handleGetAllPayment = async () => {
      const result = await adminApi.getAllOrder()
      if (result?.data?.data.length > 0) {
        setLengthOrder(result?.data?.data.length)
      }
    }
    handleGetAllPayment()
    handleGetAllAccount()
    handleGetAllProduct()
  }, [])

  return (
    <Space size={20} direction='vertical' className=' pb-4'>
      <Space direction='horizontal' className='flex items-start gap-5'>
        <DashboardCard
          icon={
            <ShoppingCartOutlined
              style={{
                color: 'green',
                backgroundColor: 'rgba(0,255,0,0.25)',
                borderRadius: 20,
                fontSize: 24,
                padding: 8
              }}
            />
          }
          title={'Orders'}
          value={lengthOrder}
        />
        <DashboardCard
          icon={
            <ShoppingOutlined
              style={{
                color: 'blue',
                backgroundColor: 'rgba(0,0,255,0.25)',
                borderRadius: 20,
                fontSize: 24,
                padding: 8
              }}
            />
          }
          title={'Inventory'}
          value={lengthProduct}
        />
        <DashboardCard
          icon={
            <UserOutlined
              style={{
                color: 'purple',
                backgroundColor: 'rgba(0,255,255,0.25)',
                borderRadius: 20,
                fontSize: 24,
                padding: 8
              }}
            />
          }
          title={'Customer'}
          value={lengthAccount}
        />
        {/* <DashboardCard
          icon={
            <DollarCircleOutlined
              style={{
                color: 'red',
                backgroundColor: 'rgba(255,0,0,0.25)',
                borderRadius: 20,
                fontSize: 24,
                padding: 8
              }}
            />
          }
          title={'Revenue'}
          value='20'
        /> */}
      </Space>

      <div className='w-full'>
        <span className='font text-[16px] p-3'>Đơn hàng mới nhất</span>
        <TableOrder />
      </div>

      <Space>
        <DashboardChartDay />
        <DashboardChart />
      </Space>
    </Space>
  )
}

function DashboardCard({ title, value, icon }: any) {
  return (
    <Card className='w-[200px]'>
      <Space direction='horizontal'>
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  )
}

function DashboardChartDay() {
  const queryConfig = useQueryConfig()

  const { data: paymentData } = useQuery({
    queryKey: ['payment', queryConfig],
    queryFn: adminApi.getAllOrder
  })
  console.log(paymentData)
  const [revenueData, setRevenueData] = useState({
    labels: [], // Initialize with empty labels
    datasets: [
      {
        label: 'Weekly Revenue',
        data: [0, 0, 0, 0, 0, 0, 0], // Initialize with zeros
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(105, 135, 196, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(144, 166, 211)'
        ],
        borderWidth: 1
      }
    ]
  })

  useEffect(() => {
    if (paymentData?.data.data) {
      const payments = paymentData.data.data

      // Get today's date and the dates for the past 6 days
      const today = new Date()
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(today.getDate() - i)
        return date
      }).reverse()
      const formattedDays = days.map((date) => date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })) // Format dates as DD/MM/YYYY

      const revenueByDay = days.map((day) => {
        const dayString = day.toISOString().split('T')[0]
        const filteredPayments = payments.filter(
          (payment) => payment.createdAt.startsWith(dayString) && payment.status === 4
        )
        const totalRevenue = filteredPayments.reduce((sum, payment: any) => sum + payment.totalMoney, 0) // Sum only the totalMoney of filtered payments
        return totalRevenue
      })

      setRevenueData((prevData: any) => ({
        ...prevData,
        labels: formattedDays,
        datasets: [
          {
            ...prevData.datasets[0],
            data: revenueByDay
          }
        ]
      }))
    }
  }, [paymentData])

  return (
    <Card style={{ width: 500, height: 250 }}>
      <Bar data={revenueData} />
    </Card>
  )
}

interface Dataset {
  label: string
  data: number[]
  backgroundColor: string
  borderColor: string
  borderWidth: number
  fill: boolean
}

interface RevenueData {
  labels: string[]
  datasets: Dataset[]
}
function DashboardChart() {
  const queryConfig = useQueryConfig()

  const { data: paymentData } = useQuery({
    queryKey: ['payment', queryConfig],
    queryFn: adminApi.getAllOrder
  })

  const [revenueData, setRevenueData] = useState<RevenueData>({
    labels: [],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        fill: false // Ensure the line chart is not filled
      }
    ]
  })

  useEffect(() => {
    if (paymentData?.data?.data) {
      const payments = paymentData.data.data
      const currentYear = new Date().getFullYear() // Get the current year

      // Get months for the current year
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, i, 1)
        return date.toISOString().split('T')[0].slice(0, 7) // Format as YYYY-MM
      })

      const labels = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, i, 1)
        return date.toLocaleString('en-US', { month: 'long' }).slice(0, 3) // Only first three letters of the month
      })

      const revenueByMonth = months.map((month) => {
        const filteredPayments = payments.filter(
          (payment) => payment.createdAt.startsWith(month) && payment.status === 4
        )

        const totalRevenue = filteredPayments.reduce((sum, payment: any) => sum + payment.totalMoney, 0) // Use totalMoney field
        return totalRevenue
      })

      setRevenueData({
        labels: labels,
        datasets: [
          {
            label: 'Monthly Revenue',
            data: revenueByMonth,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            fill: false
          }
        ]
      })
    }
  }, [paymentData])

  return (
    <Card style={{ width: 500, height: 250 }}>
      <Line data={revenueData} />
    </Card>
  )
}

export default ChartWeek
