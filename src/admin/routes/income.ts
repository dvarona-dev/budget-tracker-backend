import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  isAuthenticated,
  validRouteRequest,
} from '../../middleware'
import {
  getIncome,
  getPerHourRate,
  newIncome,
  updateIncome,
} from '../handlers/income'
import { newIncomeRules, updateIncomeRules } from '../middleware/income_rules'

const router = Router()

router.get(
  '/',
  accessingRoute,
  isAuthenticated,
  expressValidator,
  validRouteRequest,
  getIncome
)

router.post(
  '/',
  accessingRoute,
  isAuthenticated,
  ...newIncomeRules,
  expressValidator,
  validRouteRequest,
  newIncome
)

router.put(
  '/',
  accessingRoute,
  isAuthenticated,
  ...updateIncomeRules,
  expressValidator,
  validRouteRequest,
  updateIncome
)

router.get(
  '/hourRate',
  accessingRoute,
  isAuthenticated,
  validRouteRequest,
  getPerHourRate
)

export default router
