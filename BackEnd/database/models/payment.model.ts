import mongoose, { Schema } from 'mongoose'
import { STATUS_ORDER } from '../../constants/purchase'

const PaymentSchema = new Schema(
  {
    purchases: [
      {
        product: {
          name: { type: String, required: true, maxlength: 160 },
          image: { type: String, required: true, maxlength: 1000 },
          price: { type: Number, default: 0 },
        },
        buy_count: { type: Number },
        price: { type: Number, default: 0 },
      },
    ],
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' },
    totalMoney: { type: Number, default: 0 },
    name: { type: String },
    street: { type: String },
    city: { type: String },
    phone: { type: String },
    paymentMethod: { type: Number, default: 0 },
    status: { type: Number, default: STATUS_ORDER.WAIT_FOR_CONFIRMATION },
    // 0: cash, 1: paypal
  },
  {
    timestamps: true,
  }
)
export const PaymentModel = mongoose.model('payments', PaymentSchema)
