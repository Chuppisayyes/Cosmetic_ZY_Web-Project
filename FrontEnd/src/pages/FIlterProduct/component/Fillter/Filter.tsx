import FilterItem from 'src/components/FilterItem'

export default function Filter() {
  return (
    <div className='flex justify-around flex-wrap xl:flex-col '>
      <FilterItem index={1} label='Giá sản phẩm' />
      <FilterItem index={2} label='Danh mục' />
      <FilterItem index={3} label='Thương hiệu' />
      <FilterItem index={4} label='Đánh giá sản phẩm' />
    </div>
  )
}
