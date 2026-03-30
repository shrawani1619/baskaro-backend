import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null
  if (!token) return res.status(401).json({ error: 'Missing auth token' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    req.user = payload
    return next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid auth token' })
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user?.role || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' })
  }
  return next()
}

