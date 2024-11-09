export type PurchaseStatus = 0 | 1

export interface Purchase {
  _id: string
  buy_count: number
  product: Product
  price: number
  price_before_discount: number
  status: PurchaseStatus
  user: string
  createdAt: string
  updatedAt: string
}
