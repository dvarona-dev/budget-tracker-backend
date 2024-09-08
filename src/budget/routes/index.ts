import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  isAuthenticated,
  successValidations,
} from '../../middleware'
import { create } from '../handlers'
import { createBudgetRules } from '../middleware/rules'

const router = Router()

router.post(
  '/create',
  accessingRoute,
  isAuthenticated,
  ...createBudgetRules,
  expressValidator,
  successValidations,
  create
)

export default router
