import { successResponse } from '../utils/helpers.js'
import * as mobileManagementService from '../services/mobileManagement.service.js'

// ==================== BRAND CONTROLLERS ====================

export async function getAllBrands(req, res) {
  const { page = 1, limit = 10, active = true } = req.query
  const data = await mobileManagementService.getAllBrands({ page, limit, active })
  return successResponse(res, data, 'Brands retrieved successfully')
}

export async function getBrandById(req, res) {
  const { brandId } = req.params
  const brand = await mobileManagementService.getBrandById(brandId)
  return successResponse(res, brand, 'Brand retrieved successfully')
}

export async function createBrand(req, res) {
  const brandData = req.body
  const brand = await mobileManagementService.createBrand(brandData)
  return successResponse(res, brand, 'Brand created successfully', 201)
}

export async function updateBrand(req, res) {
  const { brandId } = req.params
  const updateData = req.body
  const brand = await mobileManagementService.updateBrand(brandId, updateData)
  return successResponse(res, brand, 'Brand updated successfully')
}

export async function deleteBrand(req, res) {
  const { brandId } = req.params
  const result = await mobileManagementService.deleteBrand(brandId)
  return successResponse(res, result, 'Brand deleted successfully')
}

// ==================== PHONE MODEL CONTROLLERS ====================

export async function getAllPhoneModels(req, res) {
  const { brandId, page = 1, limit = 10, active = true } = req.query
  const data = await mobileManagementService.getAllPhoneModels({ brandId, page, limit, active })
  return successResponse(res, data, 'Phone models retrieved successfully')
}

export async function getPhoneModelById(req, res) {
  const { modelId } = req.params
  const model = await mobileManagementService.getPhoneModelById(modelId)
  return successResponse(res, model, 'Phone model retrieved successfully')
}

export async function createPhoneModel(req, res) {
  const modelData = req.body
  const model = await mobileManagementService.createPhoneModel(modelData)
  return successResponse(res, model, 'Phone model created successfully', 201)
}

export async function updatePhoneModel(req, res) {
  const { modelId } = req.params
  const updateData = req.body
  const model = await mobileManagementService.updatePhoneModel(modelId, updateData)
  return successResponse(res, model, 'Phone model updated successfully')
}

export async function deletePhoneModel(req, res) {
  const { modelId } = req.params
  const result = await mobileManagementService.deletePhoneModel(modelId)
  return successResponse(res, result, 'Phone model deleted successfully')
}
