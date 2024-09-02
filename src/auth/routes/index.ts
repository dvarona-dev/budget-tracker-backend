import { Router } from 'express'
import { signin, signup } from '../handlers'
import { signupValidators } from '../middleware/validators'

const router = Router()

router.post('/signup', ...signupValidators, signup)

router.post('/signin', signin)

export default router
