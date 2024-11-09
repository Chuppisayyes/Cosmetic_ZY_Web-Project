import mongoose, { Schema } from 'mongoose'

const BrandSchema = new Schema({
  name: String,
  image: String,
  description: String,
})

export const BrandModel = mongoose.model('brands', BrandSchema)
