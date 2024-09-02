import { body } from 'express-validator'

export const signupValidators = [
  body('username')
    .isLength({ min: 4 })
    .withMessage('username must be at least 4 characters long'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters long'),
]
