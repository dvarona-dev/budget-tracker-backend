import { body } from 'express-validator'
import { TExpense } from '../types/expense'
import { prisma } from '../..'

export const newExpenseRules = [
  body('expenses')
    .isArray({ min: 1 })
    .withMessage('expenses must be an array with at least one item')
    .custom(async (expenses: TExpense[]) => {
      const validItems = expenses.filter((expense) => {
        const { description, amount, period } = expense
        if (
          !description ||
          !amount ||
          !period ||
          typeof period !== 'number' ||
          ![15, 30].includes(period) ||
          typeof amount !== 'number' ||
          amount <= 0
        ) {
          throw new Error('one or more additionals are invalid')
        }

        return true
      })

      if (validItems.length !== expenses.length) {
        throw new Error('one or more additionals are invalid')
      }

      return true
    }),
]

export const updateExpenseRules = [
  body('expenses')
    .isArray({ min: 1 })
    .withMessage('expenses must be an array with at least one item')
    .custom(async (expenses: TExpense[]) => {
      const validItems = await Promise.all(
        expenses.map(async (expense) => {
          const { id, description, amount, period } = expense
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
            const expenseInDb = await prisma.expense.findUnique({
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

      if (validItems.filter(Boolean).length !== expenses.length) {
        throw new Error('one or more additionals are invalid')
      }

      return true
    }),
]
