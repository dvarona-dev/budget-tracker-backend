import { body } from 'express-validator'
import { prisma } from '../..'
import logger from '../../logger'
import { BudgetItem, BudgetPeriod } from '../types/budget'

const checkIfValidDates = async (date: Date) => {
  if (isNaN(date.getTime())) {
    throw new Error('cutoff_start must be a valid date')
  }
}

// TODO: Add types in request
export const createBudgetRules = [
  body('cutoff_start').custom(async (value: Date, { req }) => {
    try {
      const cutoff_start = new Date(value)
      const cutoff_end = new Date(req.body.cutoff_end)
      const payout_date = new Date(req.body.payout_date)

      await checkIfValidDates(cutoff_start)

      if (cutoff_start > cutoff_end) {
        throw new Error('cutoff_start must be a valid date')
      }
      if (cutoff_start > payout_date) {
        throw new Error('cutoff_start must be a valid date')
      }
    } catch (error) {
      throw new Error('cutoff_start must be a valid date')
    }
  }),
  body('cutoff_end').custom(async (value: Date, { req }) => {
    try {
      const cutoff_start = new Date(req.body.cutoff_start)
      const cutoff_end = new Date(value)
      const payout_date = new Date(req.body.payout_date)

      await checkIfValidDates(cutoff_end)

      if (cutoff_end < cutoff_start) {
        throw new Error('cutoff_end must be a valid date')
      }
      if (cutoff_end > payout_date) {
        throw new Error('cutoff_end must be a valid date')
      }
    } catch (error) {
      throw new Error('cutoff_end must be a valid date')
    }
  }),
  body('payout_date').custom(async (value: Date, { req }) => {
    try {
      const cutoff_start = new Date(req.body.cutoff_start)
      const cutoff_end = new Date(req.body.cutoff_end)
      const payout_date = new Date(value)

      await checkIfValidDates(payout_date)

      if (payout_date < cutoff_start) {
        throw new Error('payout_date must be a valid date')
      }
      if (payout_date < cutoff_end) {
        throw new Error('payout_date must be a valid date')
      }
    } catch (error) {
      throw new Error('payout_date must be a valid date')
    }
  }),
  body('period').custom(async (value: BudgetPeriod) => {
    if (![15, 30].includes(value))
      throw new Error('period must be numeric 15 or 30')
  }),
  body('extraHours').isNumeric().withMessage('hours must be numeric'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('items must be an array with at least one item')
    .custom(async (value: BudgetItem[]) => {
      const items = value
      const validItems = items.filter((item) => {
        const { description, amount, assignedTo } = item
        if (
          !description ||
          !amount ||
          !assignedTo ||
          typeof amount !== 'number'
        ) {
          return false
        }

        if (
          assignedTo.trim() === '' ||
          description.trim() === '' ||
          amount <= 0
        ) {
          return false
        }

        return true
      })

      try {
        const assignedToIds = validItems.map((item) => item.assignedTo)
        const userMembers = await prisma.userMember.findMany({
          where: {
            id: {
              in: assignedToIds,
            },
          },
        })
        const validAssignedToIds = [
          ...new Set(userMembers.map((userMember) => userMember.id)),
        ]

        if (
          validItems.length !== items.length ||
          validAssignedToIds.length < 0
        ) {
          throw new Error('invalid items')
        }
      } catch (error) {
        logger.error(error)
        throw new Error('invalid items')
      }
    }),
]
