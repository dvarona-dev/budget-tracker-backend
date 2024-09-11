import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  successValidations,
} from '../../middleware'
import { signin, signup, verifyToken } from '../handlers'
import { signinRules, signupRules, verifyTokenRules } from '../middleware/rules'

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

router.post(
  '/verify-token',
  accessingRoute,
  ...verifyTokenRules,
  expressValidator,
  successValidations,
  verifyToken
)

export default router
