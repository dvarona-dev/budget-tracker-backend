import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  isAuthenticated,
  validRouteRequest,
} from '../../middleware'
import { getExpenses, updateExpenses } from '../handlers/expense'
import { updateExpenseRules } from '../middleware/expense_rules'

const router = Router()

router.get(
  '/',
  accessingRoute,
  isAuthenticated,
  expressValidator,
  validRouteRequest,
  getExpenses
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
