import { body } from 'express-validator'

export const verifyTokenRules = [
  body('token').notEmpty().withMessage('token is required'),
]
