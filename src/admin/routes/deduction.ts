import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  isAuthenticated,
  validRouteRequest,
} from '../../middleware'
import { getDeductions, updateDeductions } from '../handlers/deduction'
import { updateDeductionRules } from '../middleware/deduction_rules'

const router = Router()

router.get(
  '/',
  accessingRoute,
  isAuthenticated,
  expressValidator,
  validRouteRequest,
  getDeductions
)

router.put(
  '/',
  accessingRoute,
  isAuthenticated,
  ...updateDeductionRules,
  expressValidator,
  validRouteRequest,
  updateDeductions
)

export default router
