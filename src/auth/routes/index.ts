import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  validRouteRequest,
} from '../../middleware'
import { signin, signup, verifyToken } from '../handlers'
import { signinRules, signupRules, verifyTokenRules } from '../middleware/rules'

const router = Router()

router.post(
  '/signup',
  accessingRoute,
  ...signupRules,
  expressValidator,
  validRouteRequest,
  signup
)

router.post(
  '/signin',
  accessingRoute,
  ...signinRules,
  expressValidator,
  validRouteRequest,
  signin
)

router.post(
  '/verify-token',
  accessingRoute,
  ...verifyTokenRules,
  expressValidator,
  validRouteRequest,
  verifyToken
)

export default router
