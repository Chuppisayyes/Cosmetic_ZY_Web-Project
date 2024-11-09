// Import các thư viện và component cần thiết
import { Breadcrumb, Modal, Switch } from 'antd'
import './styles.scss'
import 'src/Styles/Header.scss'
import { Link, useLocation } from 'react-router-dom'
import path from 'src/constants/path'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { AppContext } from 'src/contexts/app.contexts'
import { purchasesStatus } from 'src/constants/purchase'
import purchaseApi from 'src/apis/purchase.api'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import QuantityController from 'src/components/QuantityController'
import { Purchase } from 'src/types/purchase.type'
import 'src/Styles/CheckBoxBrand.scss'
import Payment from '../Payment'
import { toast } from 'react-toastify'

// Component Cart chính
export default function Cart() {
  // Lấy dữ liệu từ context AppContext
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)

  // Lấy dữ liệu về các sản phẩm trong giỏ hàng từ API
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })

  // Các mutation dùng để cập nhật và xóa sản phẩm trong giỏ hàng
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch() // Lấy lại dữ liệu sau khi cập nhật
    }
  })
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch() // Lấy lại dữ liệu sau khi xóa
    }
  })

  // Lấy thông tin vị trí hiện tại từ useLocation
  const location = useLocation()

  // Lấy danh sách các sản phẩm trong giỏ hàng
  const purchasesInCart = purchasesInCartData?.data.data
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId

  // Kiểm tra xem tất cả sản phẩm đã được chọn hay chưa
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchasesCount = checkedPurchases.length

  // Tính tổng giá trị của các sản phẩm đã chọn
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  // Cập nhật danh sách giỏ hàng khi có sự thay đổi về sản phẩm trong giỏ
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, choosenPurchaseIdFromLocation])

  // Xóa dữ liệu khỏi history khi component bị unmount
  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  // Các hàm xử lý hành động chọn sản phẩm và thay đổi số lượng
  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  // Hàm xử lý chọn hoặc bỏ chọn tất cả sản phẩm
  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  // Hàm thay đổi số lượng sản phẩm khi người dùng nhập vào
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  // Hàm xử lý khi thay đổi số lượng sản phẩm
  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseId])
  }

  // Quản lý modal thanh toán
  const [isModalVisible, setIsModalVisible] = useState(false)
  const handlePaymentSuccess = () => {
    setIsModalVisible(false)
  }

  // Hàm xử lý khi người dùng nhấn thanh toán
  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      let shouldRefetch = false
      checkedPurchases.forEach((purchase) => {
        if (purchase.buy_count > purchase.product.quantity) {
          shouldRefetch = true
          toast.error('Thanh toán thất bại do không đủ số lượng sản phẩm')
        }
      })
      if (shouldRefetch) {
        refetch() // Cập nhật lại giỏ hàng
      } else {
        setIsModalVisible(true) // Mở modal thanh toán
      }
    }
  }

  return (
    <section className='flex flex-col my-4 mx-2 xl:mx-16 font '>
      <Breadcrumb
        separator='>'
        items={[
          {
            title: <Link to={path.home}>Trang chủ</Link>
          },
          {
            title: <Link to={path.cart}>Trang giỏ hàng</Link>
          }
        ]}
        className='pl-[22px]'
      ></Breadcrumb>
      <div className='text-[14px] xl:text-[21px] pl-[22px] font-bold text-gray-700 w-[300px] xl:w-[750px] '>Trang giỏ hàng của bạn</div>
      <div className='mt-5 cart-table w-full '>
        <div className=' product-list p-1 xl:p-5 w-full max-h-[380px]  xl:max-h-[680px] overflow-y-auto border-2 border-gray-100 rounded-lg scrollable-container'>
          <div className='cart-table-section'>
            <table className='table-shop leading-4'>
              <thead>
                <tr className='font-medium '>
                  <th className='p-0'>
                    <Switch checked={isAllChecked} onChange={handleCheckAll} />
                  </th>
                  <th className='text-[10px] md:text-[14px] pr-0 w-[40%]'>Product Name</th>
                  <th className='text-[10px] md:text-[14px] px-0 ml-5  w-[15%] text-center '>Price</th>

                  <th className='text-[10px] md:text-[14px] px-0 ml-3  w-[10%] text-center'>Quantity</th>
                  <th className='text-[10px] md:text-[14px] ml-3 px-0 w-[15%] text-center'>Total</th>
                  <th className='ml-3 hidden md:inline-block px-0 w-[11%] text-center'>Remaining</th>
                </tr>
              </thead>
              {extendedPurchases.map((purchase, index) => (
                <tbody className='' key={purchase._id}>
                  <tr>
                    <td className='p-0 text-center'>
                      <input type='checkbox' checked={purchase.checked} onChange={handleCheck(index)}></input>
                    </td>
                    <td className='w-[40%] pr-0'>
                      <div className='flex flex-row items-center gap-x-[10px]'>
                        <div className='relative'>
                          <img
                            src={purchase.product.image}
                            alt=''
                            width={200}
                            height={200}
                            className='item-img max-w-[40px] md:max-w-[80px] object-cover'
                          />
                          <button className='absolute top-[-10px] right-[-6px] z-40' onClick={handleDelete(index)}>
                            <i className='fa fa-times' aria-hidden='true'></i>
                          </button>
                        </div>
                        <Link
                          to={`${path.home}${generateNameId({
                            name: purchase.product.name,
                            id: purchase.product._id
                          })}`}
                        >
                          <span className='pr-0 w-[full%] hidden md:inline-block'>{purchase.product.name}</span>
                        </Link>
                      </div>
                    </td>
                    <td className='p-0 pl-6 '>
                      <div className='flex items-center gap-x-[10px]'>
                        <span className='hidden xl:inline-block line-through text-gray-400 '>
                          {formatCurrency(purchase.product.price_before_discount)}
                        </span>
                        <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57] font-semibold'>
                          {formatCurrency(purchase.product.price)}
                        </span>
                      </div>
                    </td>
                    {/* <td className="text-center price-amount amount">
              </td> */}
                    <td className='pl-[10px] quantity'>
                      <QuantityController
                        max={purchase.product.quantity}
                        value={purchase.buy_count}
                        onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                        onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                        onType={handleTypeQuantity(index)}
                        onFocusOut={(value) =>
                          handleQuantity(
                            index,
                            value,
                            value >= 1 &&
                            value <= purchase.product.quantity &&
                            value !== (purchasesInCart as Purchase[])[index].buy_count
                          )
                        }
                        disabled={purchase.disabled}
                        classNameWrapper='w-[25px] h-[30px] md:w-[30px] md:h-[30px] text-[10px] md:text-[14px]'
                      />
                    </td>
                    <td className='p-0 pl-8'>
                      <span className=''>{formatCurrency(purchase.product.price * purchase.buy_count)} vnd</span>
                    </td>
                    <td className='pr-12'>
                      <span className='hidden md:inline-block text-black'>{purchase.product.quantity}</span>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
        <div className=' cart-totals w-full border border-gray-100 rounded-lg shadow-lg p-4'>
          <div className=' xl:h-[50px] m-3 text-[18px]'>
            <h4 className='text-center'>Tổng tiển thanh toán</h4>
          </div>
          <div className='wd-cart-totals w-full'>
            <div className='cart-totals-inner w-full'>
              <table className='table-shop w-full'>
                <tbody className='leading-6'>
                  <tr className=''>
                    <th  className='text-end pr-10'>Số lượng sản phẩm</th>
                    <td className=''>
                      <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57] font-semibold'>
                        {checkedPurchasesCount}
                      </span>
                    </td>
                  </tr>
                  <tr className=''>
                    <th className='text-end pr-10'>Tổng tiền</th>
                    <td>
                      <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57] font-semibold'>
                        {formatCurrency(totalCheckedPurchasePrice)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className='wc-proceed-to-checkout mt-3 text-center'>
                <button
                  className= 'py-3 px-5 rounded text-white checkout-button  bg-gradient-to-r from-[#f0a80e] via-[#c43131] to-[#671f57] font-semibold'
                  onClick={handleBuyPurchases}
                >
                  Thanh Toán Ngay
                </button>
                <Modal
                  title='Thanh toán'
                  open={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  footer={null}
                  width={1000}
                >
                  <Payment
                    checkedPurchases={checkedPurchases}
                    totalCheckedPurchasePrice={totalCheckedPurchasePrice}
                    onPaymentSuccess={handlePaymentSuccess}
                  />{' '}
                  {/* Thay thế bằng nội dung modal của bạn */}
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
