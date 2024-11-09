import { Router } from 'express'
import authMiddleware from '../../middleware/auth.middleware'
import helpersMiddleware from '../../middleware/helpers.middleware'
import { wrapAsync } from '../../utils/response'
import SkincareController from '../../controllers/skincare.controller'

export const userSkincareRouter = Router()

userSkincareRouter.get(
  '',
  authMiddleware.verifyAccessToken,
  helpersMiddleware.idValidator,
  wrapAsync(SkincareController.getSkincareFormData)
)
userSkincareRouter.post(
  '/add-form',
  authMiddleware.verifyAccessToken,
  helpersMiddleware.idValidator,
  wrapAsync(SkincareController.createSkincareForm)
)
userSkincareRouter.get(
  '/:skincare_id',
  // helpersMiddleware.idRule('health_id'),
  authMiddleware.verifyAccessToken,
  wrapAsync(SkincareController.getSkincareFormById)
)
