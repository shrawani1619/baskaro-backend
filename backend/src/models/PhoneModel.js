import mongoose from 'mongoose'

const phoneModelSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    // Base price used by pricing engine (sell/estimate).
    basePriceInr: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

phoneModelSchema.index({ brandId: 1, slug: 1 }, { unique: true })

export const PhoneModel = mongoose.model('PhoneModel', phoneModelSchema)
