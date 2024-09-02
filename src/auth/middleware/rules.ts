import { body } from 'express-validator'

export const authCredentialsRules = [
  body('username')
    .isLength({ min: 4 })
    .withMessage('username must be at least 4 characters long'),
  body('password')
    .isLength({ min: 7 })
    .withMessage('password must be at least 7 characters long'),
]
