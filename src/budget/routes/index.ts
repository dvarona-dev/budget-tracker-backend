import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  isAuthenticated,
  validRouteRequest,
} from '../../middleware'
import {
  create,
  deleteById,
  getAll,
  getById,
  toggleBudgetItem,
  updateBudgetItem,
} from '../handlers'
import {
  checkBudgetIdIfExisting,
  checkBudgetItemIdIfExisting,
  createBudgetRules,
  updateBudgetItemRules,
} from '../middleware/rules'

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
  ...checkBudgetIdIfExisting,
  expressValidator,
  validRouteRequest,
  getById
)

router.patch(
  '/toggle-item/:id',
  accessingRoute,
  isAuthenticated,
  ...checkBudgetItemIdIfExisting,
  expressValidator,
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

router.delete(
  '/delete-budget/:id',
  accessingRoute,
  isAuthenticated,
  ...checkBudgetIdIfExisting,
  expressValidator,
  validRouteRequest,
  deleteById
)

export default router
