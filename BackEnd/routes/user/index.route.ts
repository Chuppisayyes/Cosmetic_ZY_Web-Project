import { userPurchaseRouter } from './purchase.route'
import { userUserRouter } from './user-user.route'
import { userPaymentRouter } from './payment.route'
import { userSkincareRouter } from './skin.route'

const userRoutes = {
  prefix: '/',
  routes: [
    {
      path: 'user',
      route: userUserRouter,
    },
    {
      path: 'purchases',
      route: userPurchaseRouter,
    },
    {
      path: 'skincare',
      route: userSkincareRouter,
    },
    {
      path: 'payment',
      route: userPaymentRouter,
    },
  ],
}

export default userRoutes
