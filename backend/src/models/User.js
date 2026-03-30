import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, sparse: true },
    phone: { type: String, trim: true, sparse: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // Local auth (email/password). For OTP-only users this can be null.
    passwordHash: { type: String, default: null },
  },
  { timestamps: true },
)

userSchema.index({ email: 1 }, { unique: true, sparse: true })
userSchema.index({ phone: 1 }, { unique: true, sparse: true })

export const User = mongoose.model('User', userSchema)
