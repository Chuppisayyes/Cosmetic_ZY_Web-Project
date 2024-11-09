import { body } from 'express-validator'
import { STATUS_PURCHASE } from '../constants/purchase'
import { STATUS } from '../constants/status'
import { PurchaseModel } from '../database/models/purchase.model'
import { ErrorHandler } from '../utils/response'
import { isMongoId } from '../utils/validate'

export const buyProductsRules = () => {
  return [
    body()
      .isArray()
      .withMessage('body phải là array')
      .custom((value) => {
        if (value.length === 0) {
          return false
        }
        const isPassed = value.every((item) => {
          if (isMongoId(item.product_id) && Number.isInteger(item.buy_count)) {
            return true
          }
          return false
        })
        return isPassed
      })
      .withMessage('body không đúng định dạng'),
  ]
}

export const addToCartRules = () => {
  return [
    body('product_id')
      .exists({ checkFalsy: true })
      .withMessage('product_id không được để trống')
      .isMongoId()
      .withMessage('product_id không đúng định dạng'),
    body('buy_count')
      .exists({ checkFalsy: true })
      .withMessage('buy_count không được để trống')
      .custom((value) => {
        if (
          typeof value !== 'number' ||
          value < 1 ||
          !Number.isInteger(value)
        ) {
          return false
        }
        return true
      })
      .withMessage('buy_count phải là số nguyên lớn hơn 0'),
  ]
}

export const updatePurchaseRules = addToCartRules

export const deletePurchasesRules = () => {
  return [
    body()
      .isArray()
      .withMessage('body phải là array')
      .custom((value) => {
        if (value.length === 0) {
          return false
        }
        return value.every((id) => isMongoId(id))
      })
      .withMessage('body phải là array id'),
  ]
}
// const identifyPurchase = async (req, res, next) => {
//   try {
//     const purchase = await PurchaseModel.findOne({
//       user: req.jwtDecoded.id,
//       status: STATUS_PURCHASE.IN_CART,
//     })
//     if (!purchase) {
//       throw new ErrorHandler(STATUS.NOT_FOUND, 'Purchase not found')
//     }
//     // Thêm thông tin về đơn hàng vào request object để sử dụng trong hàm xử lý chính
//     req.purchase = purchase
//     next()
//   } catch (error) {
//     console.error('Error identifying purchase:', error)
//     return res.status(500).json({ message: 'Internal server error' })
//   }
// }
// const purchaseMiddleware = {
//   identifyPurchase,
// }
// export default purchaseMiddleware
