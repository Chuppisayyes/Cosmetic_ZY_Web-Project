import { Router } from 'express'
import paymentController from '../../controllers/payment.controller'
import authMiddleware from '../../middleware/auth.middleware'
import helpersMiddleware from '../../middleware/helpers.middleware'
// import purchaseMiddleware from '../../middleware/purchase.middleware'
import { wrapAsync } from '../../utils/response'

export const userPaymentRouter = Router()

userPaymentRouter.get(
  '/',
  helpersMiddleware.entityValidator,
  // purchaseMiddleware.identifyPurchase,
  authMiddleware.verifyAccessToken,
  wrapAsync(paymentController.getPayments)
)
