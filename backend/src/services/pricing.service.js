import { Brand } from '../models/Brand.js'
import { PhoneModel } from '../models/PhoneModel.js'
import { Variant } from '../models/Variant.js'

const screenDeductionByOption = {
  Excellent: 0,
  Good: 0.08,
  Fair: 0.18,
  'Bad / Cracked': 0.35,
}

const bodyDeductionByOption = {
  Excellent: 0,
  Good: 0.06,
  Fair: 0.14,
  'Bad / Scratched': 0.3,
}

const batteryDeductionByOption = {
  '90% - 100%': 0,
  '80% - 89%': 0.1,
  '60% - 79%': 0.25,
  'Below 60%': 0.45,
}

const accessoriesDeductionByOption = {
  'Original box + all accessories': 0,
  'Original charger only': 0.03,
  'No charger / no box': 0.08,
  'No accessories': 0.12,
}

const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

function parseGbLabelToNumber(v) {
  // frontend passes "12GB" or "128GB"
  const s = String(v ?? '')
  const num = Number(s.replace(/[^0-9.]/g, ''))
  return Number.isFinite(num) ? num : NaN
}

export async function estimateSellingPrice({
  brand,
  model,
  ram,
  storage,
  screenCondition,
  bodyCondition,
  batteryHealth,
  accessories,
}) {
  if (!brand || !model || !ram || !storage) {
    return { finalPrice: 0, breakdown: {} }
  }

  const brandDoc = await Brand.findOne({
    $or: [
      { name: { $regex: `^${brand}$`, $options: 'i' } },
      { slug: { $regex: String(brand).toLowerCase(), $options: 'i' } },
    ],
    active: true,
  }).lean()

  if (!brandDoc) return { finalPrice: 0, breakdown: {} }

  const modelDoc = await PhoneModel.findOne({
    brandId: brandDoc._id,
    active: true,
    $or: [
      { name: { $regex: `^${model}$`, $options: 'i' } },
      { slug: { $regex: String(model).toLowerCase().replace(/\\s+/g, '-'), $options: 'i' } },
      { slug: { $regex: String(model).toLowerCase(), $options: 'i' } },
    ],
  }).lean()

  if (!modelDoc) return { finalPrice: 0, breakdown: {} }

  const ramGb = parseGbLabelToNumber(ram)
  const storageGb = parseGbLabelToNumber(storage)

  const variant = await Variant.findOne({
    phoneModelId: modelDoc._id,
    active: true,
    ramGb,
    storageGb,
  }).lean()

  const variantDelta = variant?.priceDeltaInr ?? 0

  const screenPct = screenDeductionByOption[screenCondition] ?? 0
  const bodyPct = bodyDeductionByOption[bodyCondition] ?? 0
  const batteryPct = batteryDeductionByOption[batteryHealth] ?? 0
  const accessoriesPct = accessoriesDeductionByOption[accessories] ?? 0

  const totalPct = clamp(screenPct + bodyPct + batteryPct + accessoriesPct, 0, 0.7)
  const base = (modelDoc.basePriceInr ?? 0) + variantDelta
  const final = Math.max(500, Math.round(base * (1 - totalPct)))

  return {
    finalPrice: final,
    breakdown: {
      basePrice: modelDoc.basePriceInr ?? 0,
      variantDelta,
      totalDeductionPct: totalPct,
      deductions: {
        screenPct,
        bodyPct,
        batteryPct,
        accessoriesPct,
      },
    },
  }
}

