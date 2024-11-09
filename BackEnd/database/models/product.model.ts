import mongoose, { Schema } from 'mongoose'

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 160 },
    image: { type: String, required: true, maxlength: 1000 },
    images: [{ type: String, maxlength: 1000 }],
    description: { type: String },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: 'categories' },
    brand: { type: mongoose.SchemaTypes.ObjectId, ref: 'brands' },
    price: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    price_before_discount: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    uses: { type: String },
    madeIn: { type: String },
    comment: [
      {
        user: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' },
        rating: { type: Number, default: 0 },
        commentItem: { type: String },
        date: { type: Date },
      },
      {
        timestamps: true,
      },
    ],
    sold: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
)
export const ProductModel = mongoose.model('products', ProductSchema)
