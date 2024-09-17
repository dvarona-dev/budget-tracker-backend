import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  isAuthenticated,
  validRouteRequest,
} from '../../middleware'
import { getHolidays, updateHolidays } from '../handlers/holiday'
import { newHolidayRules } from '../middleware/holiday_rules'

const router = Router()

router.get(
  '/',
  accessingRoute,
  isAuthenticated,
  expressValidator,
  validRouteRequest,
  getHolidays
)

router.put(
  '/',
  accessingRoute,
  isAuthenticated,
  ...newHolidayRules,
  expressValidator,
  validRouteRequest,
  updateHolidays
)

export default router
