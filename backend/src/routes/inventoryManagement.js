import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import * as inventoryManagementController from '../controllers/inventoryManagement.controller.js'

const router = Router()

// All routes require authentication
router.use(requireAuth)

// Public routes (view inventory)
router.get('/', inventoryManagementController.getAllInventory)
router.get('/:inventoryId', inventoryManagementController.getInventoryById)

// Admin-only routes
router.post('/', requireAdmin, inventoryManagementController.addToInventory)
router.patch('/:inventoryId/stock', requireAdmin, inventoryManagementController.updateInventoryStock)
router.patch('/:inventoryId/price', requireAdmin, inventoryManagementController.updateInventoryPrice)
router.patch('/:inventoryId/mark-sold', requireAdmin, inventoryManagementController.markAsSold)

export default router
