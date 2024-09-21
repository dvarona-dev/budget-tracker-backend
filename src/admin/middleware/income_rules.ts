import { body } from 'express-validator'
import { AdditionalIncome } from '../types/income'
import { Request } from 'express'

const incomeRules = [
  body('hourRate')
    .notEmpty()
    .withMessage('hourRate is required')
    .isFloat({ gt: 0 })
    .withMessage('hourRate must be greater than 0'),
  body('additionals')
    .isArray({ min: 1 })
    .withMessage('additionals must be an array with at least one member')
    .custom(async (additionals: AdditionalIncome[], meta) => {
      const req = meta.req as unknown as Request

      const validItems = additionals.filter((item) => {
        const { id, description, amount } = item
        if (
          (req.body.incomeId ? !id : false) ||
          !description ||
          !amount ||
          typeof amount !== 'number' ||
          amount <= 0
        ) {
          return false
        }

        return true
      })

      if (validItems.length !== additionals.length) {
        throw new Error('one or more additionals are invalid')
      }
    }),
]

export const newIncomeRules = [...incomeRules]

export const updateIncomeRules = [
  body('incomeId')
    .notEmpty()
    .withMessage('incomeId is required')
    .isLength({ min: 1 })
    .withMessage('incomeId must be at least one characters long'),
  ...incomeRules,
]
