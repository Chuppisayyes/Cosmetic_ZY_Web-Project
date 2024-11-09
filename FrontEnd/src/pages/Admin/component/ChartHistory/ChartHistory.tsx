import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip } from 'chart.js'
Chart.register(ArcElement, Tooltip)

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    hoverOffset: number
  }[]
}

interface ChartOptions {
  type: string
  data: ChartData
  plugins: {
    legend: {
      display: boolean
      position: 'top' | 'bottom' | 'left' | 'right'
      labels: {
        color: string
        font: {
          size: number
        }
      }
    }
    tooltip: {
      enabled: boolean
      callbacks: {
        label: (context: any) => string
      }
    }
    datalabels: {
      display: boolean
      color: string
      font: {
        size: number
      }
      formatter: (value: number, context: any) => string | undefined
    }
  }
}

function ChartHistory({ role }: any) {
  const data: ChartData = {
    labels: ['Đang chờ xác nhận', 'Đang chuẩn bị', 'Đang giao', 'Giao thành công', 'Hủy đơn hàng'],
    datasets: [
      {
        label: 'Total Order',
        data: [role.role1, role.role2, role.role3, role.role4, role.role5],
        backgroundColor: ['#d59723', '#7cd57c', '#ffd700', '#008000', '#eb7777'],
        hoverOffset: 4
        // rgb(75, 238, 157)
      }
    ]
  }

  const options: ChartOptions = {
    type: 'doughnut',
    data,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          color: 'black',
          font: {
            size: 16
          }
        }
      },
      tooltip: {
        enabled: true, // Enable the tooltip
        callbacks: {
          label: (context) => {
            const { dataset } = context
            const label = dataset.label || ''
            const value = dataset.data[context.dataIndex]
            const total = dataset.data.reduce((acc: number, curr: number) => acc + curr, 0)
            const percentage = ((value / total) * 100).toFixed(2)
            const city = data.labels[context.dataIndex]
            return `${label} ${city}: ${value} (${percentage}%)`
          }
        }
      },
      datalabels: {
        display: false, // Tắt hiển thị nhãn trên biểu đồ
        color: 'black',
        font: {
          size: 10
        },
        formatter: (value: number) => {
          // Custom formatting logic here
          return value.toFixed(2) + '%' // Example: Return a formatted percentage string
        }
      }
    }
  }

  return (
    <figure className='flex flex-col font'>
      <div className='w-full max-h-[200px] flex items-center justify-center'>
        <Doughnut data={data} options={options} />
      </div>
      <figcaption className='flex flex-wrap items-center gap-x-[15px] mt-[10px] gap-y-[10px]'>
        <div className='flex items-center gap-x-[10px] justify-center'>
          <div className='bg-[#d59723] w-[15px] h-[15px] rounded-full' />
          <span>Đang chờ xác nhận</span>
        </div>

        <div className='flex items-center gap-x-[10px] justify-center'>
          <div className='bg-[#7cd57c] w-[15px] h-[15px] rounded-full' />
          <span>Đang chuẩn bị</span>
        </div>

        <div className='flex items-center gap-x-[10px] justify-center'>
          <div className='bg-[#ffd700] w-[15px] h-[15px] rounded-full' />
          <span>Đang giao</span>
        </div>

        <div className='flex items-center gap-x-[10px] justify-center'>
          <div className='bg-[#008000] w-[15px] h-[15px] rounded-full' />
          <span>Giao thành công</span>
        </div>
        <div className='flex items-center gap-x-[10px] justify-center'>
          <div className='bg-[#eb7777] w-[15px] h-[15px] rounded-full' />
          <span>Hủy đơn hàng</span>
        </div>
      </figcaption>
    </figure>
  )
}
export default ChartHistory
