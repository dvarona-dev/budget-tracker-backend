import { Router } from 'express'
import { signin, signup } from '../handlers'
import {
  accessingRoute,
  expressValidator,
  successValidations,
} from '../middleware'
import { signinRules, signupRules } from '../middleware/rules'

const router = Router()

router.post(
  '/signup',
  accessingRoute,
  ...signupRules,
  expressValidator,
  successValidations,
  signup
)

router.post(
  '/signin',
  accessingRoute,
  ...signinRules,
  expressValidator,
  successValidations,
  signin
)

export default router
