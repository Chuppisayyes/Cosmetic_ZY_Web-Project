import mongoose, { Schema } from 'mongoose'
import { ROLE } from '../../constants/role.enum'

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, minlength: 5, maxlength: 160 },
    name: { type: String, maxlength: 160 },
    password: { type: String, minlength: 6, maxlength: 160 },
    date_of_birth: { type: Date, maxlength: 160, default: Date.now },
    address: { type: String },
    phone: { type: String, maxlength: 20 },
    roles: { type: [String], required: true, default: [ROLE.ADMIN] },
    avatar: { type: String, maxlength: 1000 },
    type: { type: Number, default: 0 },
    // 0: web, 1: google
  },
  {
    timestamps: true,
  }
)

export const UserModel = mongoose.model('users', AdminSchema)
