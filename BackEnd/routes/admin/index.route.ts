import adminUserRouter from './admin-user.route'
import adminAuthRouter from './admin-auth.route'
import adminCategoryRouter from './admin-category.route'
import adminProductRouter from './admin-product.route'
import adminOrderRouter from './admin-order.route'
import adminBrandRouter from './admin-brand.route'

const adminRoutes = {
  prefix: '/admin/',
  routes: [
    {
      path: 'users',
      route: adminUserRouter,
    },
    {
      path: 'products',
      route: adminProductRouter,
    },
    {
      path: 'categories',
      route: adminCategoryRouter,
    },
    {
      path: 'brands',
      route: adminBrandRouter,
    },
    {
      path: 'orders',
      route: adminOrderRouter,
    },

    {
      path: '',
      route: adminAuthRouter,
    },
  ],
}

export default adminRoutes
