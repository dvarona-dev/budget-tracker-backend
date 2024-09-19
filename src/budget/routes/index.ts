import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  isAuthenticated,
  validRouteRequest,
} from '../../middleware'
import { create, getAll, getById, toggleBudgetItem } from '../handlers'
import { createBudgetRules } from '../middleware/rules'

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

export default router
