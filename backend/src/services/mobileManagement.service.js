import { Brand } from '../models/Brand.js'
import { PhoneModel } from '../models/PhoneModel.js'
import { AppError, errorCodes } from '../utils/errorHandler.js'
import { getPagination, formatPaginationResponse } from '../utils/helpers.js'

// ==================== BRAND SERVICES ====================

// Get all brands
export async function getAllBrands({ page = 1, limit = 10, active = true }) {
  const { skip } = getPagination(page, limit)
  
  const query = {}
  if (active !== null) {
    query.active = active
  }
  
  const [brands, total] = await Promise.all([
    Brand.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Brand.countDocuments(query),
  ])
  
  return formatPaginationResponse(brands, total, page, limit)
}

// Get brand by ID
export async function getBrandById(brandId) {
  const brand = await Brand.findById(brandId)
  
  if (!brand) {
    throw new AppError('Brand not found', 404, errorCodes.NOT_FOUND)
  }
  
  return brand
}

// Create brand
export async function createBrand(brandData) {
  // Check if slug already exists
  const existingBrand = await Brand.findOne({ slug: brandData.slug })
  if (existingBrand) {
    throw new AppError('Brand with this slug already exists', 409, errorCodes.CONFLICT)
  }
  
  const brand = await Brand.create(brandData)
  return brand
}

// Update brand
export async function updateBrand(brandId, updateData) {
  const brand = await Brand.findByIdAndUpdate(
    brandId,
    updateData,
    { new: true, runValidators: true }
  )
  
  if (!brand) {
    throw new AppError('Brand not found', 404, errorCodes.NOT_FOUND)
  }
  
  return brand
}

// Delete brand
export async function deleteBrand(brandId) {
  const brand = await Brand.findByIdAndDelete(brandId)
  
  if (!brand) {
    throw new AppError('Brand not found', 404, errorCodes.NOT_FOUND)
  }
  
  // Optionally check if any models reference this brand
  const modelCount = await PhoneModel.countDocuments({ brandId })
  if (modelCount > 0) {
    throw new AppError(`Cannot delete brand. ${modelCount} phone models are associated with it.`, 400, errorCodes.BAD_REQUEST)
  }
  
  return { success: true, message: 'Brand deleted successfully' }
}

// ==================== PHONE MODEL SERVICES ====================

// Get all phone models
export async function getAllPhoneModels({ brandId, page = 1, limit = 10, active = true }) {
  const { skip } = getPagination(page, limit)
  
  const query = {}
  if (brandId) {
    query.brandId = brandId
  }
  if (active !== null) {
    query.active = active
  }
  
  const [models, total] = await Promise.all([
    PhoneModel.find(query)
      .populate('brandId', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    PhoneModel.countDocuments(query),
  ])
  
  return formatPaginationResponse(models, total, page, limit)
}

// Get phone model by ID
export async function getPhoneModelById(modelId) {
  const model = await PhoneModel.findById(modelId).populate('brandId', 'name slug')
  
  if (!model) {
    throw new AppError('Phone model not found', 404, errorCodes.NOT_FOUND)
  }
  
  return model
}

// Create phone model
export async function createPhoneModel(modelData) {
  // Check if slug already exists for this brand
  const existingModel = await PhoneModel.findOne({ 
    slug: modelData.slug,
    brandId: modelData.brandId 
  })
  
  if (existingModel) {
    throw new AppError('Phone model with this slug already exists for this brand', 409, errorCodes.CONFLICT)
  }
  
  const model = await PhoneModel.create(modelData)
  return model.populate('brandId', 'name slug')
}

// Update phone model
export async function updatePhoneModel(modelId, updateData) {
  const model = await PhoneModel.findByIdAndUpdate(
    modelId,
    updateData,
    { new: true, runValidators: true }
  ).populate('brandId', 'name slug')
  
  if (!model) {
    throw new AppError('Phone model not found', 404, errorCodes.NOT_FOUND)
  }
  
  return model
}

// Delete phone model
export async function deletePhoneModel(modelId) {
  const model = await PhoneModel.findByIdAndDelete(modelId)
  
  if (!model) {
    throw new AppError('Phone model not found', 404, errorCodes.NOT_FOUND)
  }
  
  return { success: true, message: 'Phone model deleted successfully' }
}
