import { Router } from 'express'
import {
  getStructure,
  listBrands,
  listModels,
  listVariants,
} from '../controllers/catalog.controller.js'

const router = Router()

router.get('/brands', listBrands)
router.get('/models', listModels)
router.get('/variants', listVariants)
router.get('/structure', getStructure)

export default router
