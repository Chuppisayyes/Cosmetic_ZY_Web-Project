import { Router } from 'express'
import paymentController from '../../controllers/payment.controller'
import authMiddleware from '../../middleware/auth.middleware'
import helpersMiddleware from '../../middleware/helpers.middleware'
import { wrapAsync } from '../../utils/response'

const adminOrderRouter = Router()

adminOrderRouter.get(
  '',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  wrapAsync(paymentController.getAllOrders)
)
adminOrderRouter.put(
  '/:order_id/confirm',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule('order_id'),
  // helpersMiddleware.idValidator,
  wrapAsync(paymentController.updateOrderConfirm)
)
adminOrderRouter.put(
  '/:order_id/progress',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule('order_id'),
  // helpersMiddleware.idValidator,
  wrapAsync(paymentController.updateOrderProgress)
)
adminOrderRouter.put(
  '/:order_id/delivered',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule('order_id'),
  // helpersMiddleware.idValidator,
  wrapAsync(paymentController.updateOrderDelivered)
)
adminOrderRouter.put(
  '/:order_id/cancel',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule('order_id'),
  // helpersMiddleware.idValidator,
  wrapAsync(paymentController.updateOrderCancel)
)
adminOrderRouter.get(
  '/revenue/daily',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  wrapAsync(paymentController.getDailyRevenue)
)
adminOrderRouter.get(
  '/revenue/monthly',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  wrapAsync(paymentController.getMonthlyRevenue)
)

adminOrderRouter.get(
  '/top-selling-product/weekly',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  wrapAsync(paymentController.getTopSellingProductWeekly)
)
adminOrderRouter.get(
  '/top-selling-product/month',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  wrapAsync(paymentController.getTopSellingProductMonthly)
)

export default adminOrderRouter
