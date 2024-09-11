import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  isAuthenticated,
  validRouteRequest,
} from '../../middleware'
import { create, getAll } from '../handlers'
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

export default router
