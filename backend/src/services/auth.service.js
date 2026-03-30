import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { User } from '../models/User.js'
import { OtpChallenge } from '../models/OtpChallenge.js'

function generateOtp6() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function requestOtpForPhone({ phone }) {
  const normalized = String(phone || '').replace(/\D/g, '')
  if (normalized.length !== 10) {
    return { error: 'Phone must be a valid 10-digit number (without country code).' }
  }

  // For OTP-based login we keep passwordHash optional.
  let user = await User.findOne({ phone: normalized }).lean()
  if (!user) {
    user = await User.create({ phone: normalized, name: '', role: 'user' })
  }

  const code = generateOtp6()
  const otpHash = await bcrypt.hash(code, 10)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 min

  await OtpChallenge.create({
    userId: user._id,
    phone: normalized,
    otpHash,
    expiresAt,
    consumedAt: null,
  })

  // For dev/demo we return the OTP. Frontend currently mocks OTP anyway.
  return { ok: true, otp: code }
}

export async function verifyPhoneOtp({ phone, otp }) {
  const normalized = String(phone || '').replace(/\D/g, '')
  const code = String(otp || '')

  const challenge = await OtpChallenge.findOne({
    phone: normalized,
    expiresAt: { $gt: new Date() },
    consumedAt: null,
  }).sort({ createdAt: -1 })

  if (!challenge) return { error: 'OTP expired or invalid.' }
  const match = await bcrypt.compare(code, challenge.otpHash)
  if (!match) return { error: 'OTP expired or invalid.' }

  await OtpChallenge.updateOne({ _id: challenge._id }, { $set: { consumedAt: new Date() } })

  const user = await User.findOne({ phone: normalized })
  const token = signAuthToken(user)

  return {
    ok: true,
    token,
    user: { id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role },
  }
}

export function signAuthToken(user) {
  return jwt.sign(
    { userId: String(user._id), role: user.role, email: user.email || '', phone: user.phone || '' },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' },
  )
}

export async function emailRegister({ name, email, phone, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail || !normalizedEmail.includes('@')) return { error: 'Invalid email.' }
  if (!password || String(password).length < 6) return { error: 'Password must be at least 6 characters.' }

  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) return { error: 'Email already registered.' }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    name: name || '',
    email: normalizedEmail,
    phone: phone ? String(phone).replace(/\D/g, '') : '',
    role: 'user',
    passwordHash,
  })

  const token = signAuthToken(user)
  return { ok: true, token, user: { id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role } }
}

export async function emailLogin({ email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail || !normalizedEmail.includes('@')) return { error: 'Invalid email.' }

  const user = await User.findOne({ email: normalizedEmail })
  if (!user || !user.passwordHash) return { error: 'Invalid credentials.' }

  const match = await bcrypt.compare(String(password || ''), user.passwordHash)
  if (!match) return { error: 'Invalid credentials.' }

  const token = signAuthToken(user)
  return { ok: true, token, user: { id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role } }
}

export async function updateProfile(userId, { name, email, phone }) {
  const updates = {}
  if (typeof name === 'string') updates.name = name
  if (typeof email === 'string' && email.trim()) updates.email = email.trim().toLowerCase()
  if (typeof phone === 'string') updates.phone = phone.replace(/\D/g, '')

  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).lean()
  if (!user) return { error: 'User not found.' }
  return { ok: true, user }
}

