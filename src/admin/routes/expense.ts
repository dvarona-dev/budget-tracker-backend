import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  isAuthenticated,
  validRouteRequest,
} from '../../middleware'
import { getExpenses, newExpenses, updateExpenses } from '../handlers/expense'
import {
  newExpenseRules,
  updateExpenseRules,
} from '../middleware/expense_rules'

const router = Router()

router.get(
  '/',
  accessingRoute,
  isAuthenticated,
  expressValidator,
  validRouteRequest,
  getExpenses
)

router.post(
  '/',
  accessingRoute,
  isAuthenticated,
  ...newExpenseRules,
  expressValidator,
  validRouteRequest,
  newExpenses
)

router.put(
  '/',
  accessingRoute,
  isAuthenticated,
  ...updateExpenseRules,
  expressValidator,
  validRouteRequest,
  updateExpenses
)

export default router
