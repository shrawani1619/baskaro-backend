import express from 'express'
import cors from 'cors'

import catalogRouter from './routes/catalog.js'
import authRouter from './routes/auth.js'
import pricingRouter from './routes/pricing.js'
import ordersRouter from './routes/orders.js'
import addressesRouter from './routes/addresses.js'
import adminRouter from './routes/admin.js'

export const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => res.json({ ok: true }))
// Also expose under /api to match documented base URL.
app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/catalog', catalogRouter)
app.use('/api/auth', authRouter)
app.use('/api/pricing', pricingRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/addresses', addressesRouter)
app.use('/api/admin', adminRouter)

