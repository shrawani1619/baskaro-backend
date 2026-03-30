import mongoose from 'mongoose'

const statusValues = [
  'Request Submitted',
  'Pickup Scheduled',
  'Device Received',
  'Payment Completed',
]

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true, enum: statusValues },
    at: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    ram: { type: String, required: true, trim: true }, // e.g. "8GB"
    storage: { type: String, required: true, trim: true }, // e.g. "128GB"

    // Pricing inputs
    basePriceInr: { type: Number, required: true, min: 0 },
    estimateInr: { type: Number, required: true, min: 0 },
    deductionPct: { type: Number, required: true, min: 0, max: 0.7 },
    screen: { type: String, required: true },
    body: { type: String, required: true },
    battery: { type: String, required: true },
    accessories: { type: String, required: true },

    // Pickup
    pickupDate: { type: String, required: true }, // yyyy-mm-dd (frontend uses string)
    pickupTime: { type: String, required: true }, // slot string

    address: {
      label: { type: String, default: 'Home' },
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      pincode: { type: String, required: true },
    },

    // Payment
    payMethod: { type: String, required: true, enum: ['UPI', 'Bank Transfer'] },
    paymentDetails: {
      upiId: { type: String, default: '' },
      accountNo: { type: String, default: '' },
      ifsc: { type: String, default: '' },
    },

    status: { type: String, required: true, enum: statusValues, default: 'Request Submitted' },
    statusHistory: { type: [statusHistorySchema], default: [] },

    // Optional metadata
    agentAssignment: { type: String, default: '' },
  },
  { timestamps: true },
)

orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

export const Order = mongoose.model('Order', orderSchema)
export const ORDER_STATUS_VALUES = statusValues

