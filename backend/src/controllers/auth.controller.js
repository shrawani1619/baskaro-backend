import {
  emailLogin,
  emailRegister,
  requestOtpForPhone,
  updateProfile,
  verifyPhoneOtp,
} from '../services/auth.service.js'

import { User } from '../models/User.js'

export async function requestOtp(req, res) {
  const { phone } = req.body || {}
  const result = await requestOtpForPhone({ phone })
  if (result.error) return res.status(400).json(result)
  return res.json(result)
}

export async function verifyOtp(req, res) {
  const { phone, otp } = req.body || {}
  const result = await verifyPhoneOtp({ phone, otp })
  if (result.error) return res.status(400).json(result)
  return res.json(result)
}

export async function registerEmail(req, res) {
  const { name, email, phone, password } = req.body || {}
  const result = await emailRegister({ name, email, phone, password })
  if (result.error) return res.status(400).json(result)
  return res.json(result)
}

export async function loginEmail(req, res) {
  const { email, password } = req.body || {}
  const result = await emailLogin({ email, password })
  if (result.error) return res.status(400).json(result)
  return res.json(result)
}

export async function me(req, res) {
  const userId = req.user?.userId
  if (!userId) return res.status(401).json({ error: 'Unauthenticated' })
  const user = await User.findById(userId).lean()
  if (!user) return res.status(404).json({ error: 'User not found' })
  return res.json({ id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role })
}

export async function updateMe(req, res) {
  const userId = req.user?.userId
  if (!userId) return res.status(401).json({ error: 'Unauthenticated' })

  const result = await updateProfile(userId, req.body || {})
  if (result.error) return res.status(400).json(result)
  return res.json(result)
}

