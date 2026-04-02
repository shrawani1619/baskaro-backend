import mongoose from 'mongoose'

const phoneModelSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    modelName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    storageVariants: [
      {
        label: { type: String, required: true }, // e.g., "128GB", "256GB"
        basePrice: { type: Number, required: true, min: 0 },
        ram: { type: String, required: true }, // e.g., "6GB", "8GB"
      }
    ],
    basePrice: { type: Number, required: true, min: 0 }, // Base price for the model
    image: { type: String, default: '' },
    specifications: {
      display: { type: String, default: '' },
      processor: { type: String, default: '' },
      camera: { type: String, default: '' },
      battery: { type: String, default: '' },
      os: { type: String, default: '' },
    },
    releaseYear: { type: Number },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

phoneModelSchema.index({ brandId: 1 })
phoneModelSchema.index({ slug: 1 })

export const PhoneModel = mongoose.model('PhoneModel', phoneModelSchema)
