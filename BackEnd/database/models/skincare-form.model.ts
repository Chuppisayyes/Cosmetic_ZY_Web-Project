import mongoose, { Schema } from 'mongoose'

const SkincareFormSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    sex: { type: String },
    desired_routine: { type: String }, // Chu trình mong muốn
    // makeup remover + cleanser + toner + serum + moisturizer: Cơ bản
    // makeup remover + cleanser + moisturizer: Nâng cao

    skin_type: { type: String }, // Loại da
    skin_condition: [{ type: String }], // Tình trạng da
    desired_improv: [{ type: String }], // Mong muốn cải thiện
    aiRecommendation: [{ type: String }],
    additionalData: { type: String },
    reasoning: { type: String },
  },
  {
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  }
)

export const SkincareFormModel = mongoose.model(
  'skincare_forms',
  SkincareFormSchema
)
