import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  isAuthenticated,
  validRouteRequest,
} from '../../middleware'
import {
  create,
  getAll,
  getById,
  toggleBudgetItem,
  updateBudgetItem,
} from '../handlers'
import { createBudgetRules, updateBudgetItemRules } from '../middleware/rules'

const router = Router()

router.post(
  '/create',
  accessingRoute,
  isAuthenticated,
  ...createBudgetRules,
  expressValidator,
  validRouteRequest,
  create
)

router.get(
  '/get-budgets',
  accessingRoute,
  isAuthenticated,
  validRouteRequest,
  getAll
)

router.get(
  '/get-budget/:id',
  accessingRoute,
  isAuthenticated,
  validRouteRequest,
  getById
)

router.patch(
  '/toggle-item/:id',
  accessingRoute,
  isAuthenticated,
  validRouteRequest,
  toggleBudgetItem
)

router.patch(
  '/update-item',
  accessingRoute,
  isAuthenticated,
  ...updateBudgetItemRules,
  expressValidator,
  validRouteRequest,
  updateBudgetItem
)

export default router
