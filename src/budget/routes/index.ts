import { Router } from 'express'
import { create } from '../handlers'

const router = Router()

router.post('/create', create)

export default router
