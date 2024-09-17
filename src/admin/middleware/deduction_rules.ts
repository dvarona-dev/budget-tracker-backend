import { body } from 'express-validator'
import { prisma } from '../..'
import { TDeduction } from '../types/deduction'

export const updateDeductionRules = [
  body('deductions')
    .isArray({ min: 1 })
    .withMessage('deductions must be an array with at least one item')
    .custom(async (deductions: TDeduction[]) => {
      const validItems = await Promise.all(
        deductions.map(async (deduction) => {
          const { id, description, amount, period } = deduction
          if (
            !description ||
            !amount ||
            !period ||
            typeof period !== 'number' ||
            ![15, 30].includes(period) ||
            typeof amount !== 'number' ||
            amount <= 0
          ) {
            return false
          }

          if (id) {
            const expenseInDb = await prisma.deduction.findUnique({
              where: {
                id,
              },
            })

            if (!expenseInDb) {
              return false
            }
          }

          return true
        })
      )

      if (validItems.filter(Boolean).length !== deductions.length) {
        throw new Error('one or more deduction item is invalid')
      }

      return true
    }),
]
