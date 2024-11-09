import { Purchase } from './purchase.type'

export type OrderStatus = 1 | 2 | 3 | 4 | 5

export type OrderListStatus = OrderStatus | 0

export interface Payment {
  _id: string
  status: OrderListStatus
  purchase: Purchase
  street: string
  city: string
  name: string
  phone: string
  createdAt: string
  updatedAt: string
}
