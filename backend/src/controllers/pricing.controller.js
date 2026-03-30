import { estimateSellingPrice } from '../services/pricing.service.js'

export async function estimate(req, res) {
  const {
    brand,
    model,
    ram,
    storage,
    screenCondition,
    bodyCondition,
    batteryHealth,
    accessories,
  } = req.body || {}

  const result = await estimateSellingPrice({
    brand,
    model,
    ram,
    storage,
    screenCondition,
    bodyCondition,
    batteryHealth,
    accessories,
  })

  return res.json(result)
}

