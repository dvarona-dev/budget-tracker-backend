import { Router } from 'express'
import {
  accessingRoute,
  expressValidator,
  validRouteRequest,
} from '../../middleware'
import { verifyTokenRules } from '../middleware/verifyTokenRules'
import { signup } from '../handlers/signup'
import { signupRules } from '../middleware/signupRules'
import { signinRules } from '../middleware/signinRules'
import { signin } from '../handlers/signin'
import { verifyToken } from '../handlers/verifyToken'

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
