import mongoose, { Schema } from 'mongoose'

const PurchaseSchema = new Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' },
    product: { type: mongoose.SchemaTypes.ObjectId, ref: 'products' },
    buy_count: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    // 1: inCart   0: outCart
    price_before_discount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)
declare global {
  namespace Express {
    interface Request {
      purchase?: string
    }
  }
}
export const PurchaseModel = mongoose.model('purchases', PurchaseSchema)
