import { Router } from 'express'
import { signin, signup } from '../handlers'
import {
  accessingRoute,
  expressValidator,
  successValidations,
} from '../middleware'
import { authCredentialsRules } from '../middleware/rules'

const router = Router()

router.post(
  '/signup',
  accessingRoute,
  ...authCredentialsRules,
  expressValidator,
  successValidations,
  signup
)

router.post(
  '/signin',
  accessingRoute,
  ...authCredentialsRules,
  expressValidator,
  successValidations,
  signin
)

export default router
