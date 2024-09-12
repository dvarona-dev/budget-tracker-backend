import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  isAuthenticated,
  validRouteRequest,
} from '../../middleware'
import { getIncome, newIncome, updateIncome } from '../handlers'
import { newIncomeRules, updateIncomeRules } from '../middleware/rules'

const router = Router()

router.get(
  '/income',
  accessingRoute,
  isAuthenticated,
  expressValidator,
  validRouteRequest,
  getIncome
)

router.post(
  '/income',
  accessingRoute,
  isAuthenticated,
  ...newIncomeRules,
  expressValidator,
  validRouteRequest,
  newIncome
)

router.put(
  '/income',
  accessingRoute,
  isAuthenticated,
  ...updateIncomeRules,
  expressValidator,
  validRouteRequest,
  updateIncome
)

export default router
