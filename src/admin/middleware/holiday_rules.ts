import { body } from 'express-validator'
import { THoliday } from '../types/holiday'
import { prisma } from '../..'

export const newHolidayRules = [
  body('holidays')
    .isArray({ min: 1 })
    .withMessage('holidays must be an array with at least one item')
    .custom(async (holidays: THoliday[]) => {
      const validItems = await Promise.all(
        holidays.map(async (holiday) => {
          const { id, description, date } = holiday
          if (!description || !date) {
            return false
          }

          if (id) {
            const holidayInDb = await prisma.holiday.findUnique({
              where: {
                id,
              },
            })

            if (!holidayInDb) {
              return false
            }
          }

          return true
        })
      )

      if (validItems.filter(Boolean).length !== holidays.length) {
        throw new Error('one or more holiday item is invalid')
      }

      return true
    }),
]
