import { body } from 'express-validator'

export const signupRules = [
  body('username')
    .isLength({ min: 4 })
    .withMessage('username must be at least 4 characters long'),
  body('password')
    .isLength({ min: 7 })
    .withMessage('password must be at least 7 characters long'),
  body('confirmPassword').custom(async (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('passwords do not match')
    }
  }),
  body('members')
    .isArray({ min: 1 })
    .withMessage('members must be an array with at least one member'),
]

export const signinRules = [
  body('username')
    .isLength({ min: 4 })
    .withMessage('username must be at least 4 characters long'),
  body('password')
    .isLength({ min: 7 })
    .withMessage('password must be at least 7 characters long'),
]
