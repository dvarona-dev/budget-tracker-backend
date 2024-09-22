import { Request, Response } from 'express'
import { UserModel } from '../../auth/types'
import { prisma } from '../..'
import logger from '../../logger'
import { prettifyObject } from '../../utils/format'
import {
  GetHolidaysResponse,
  UpdateHolidayBody,
  UpdateHolidayResponse,
} from '../types/holiday'

export const getHolidays = async (
  req: Request<{}, {}, UserModel>,
  res: Response<GetHolidaysResponse>
) => {
  try {
    const { user } = req.body

    const holidays = await prisma.holiday.findMany({
      where: {
        userId: user.id,
      },
    })

    logger.info(`Holidays fetched: ${prettifyObject(holidays)}`)

    res.send({
      message: 'success',
      holidays,
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'error in fetching holidays' })
  }
}

export const updateHolidays = async (
  req: Request<{}, {}, UpdateHolidayBody & UserModel>,
  res: Response<UpdateHolidayResponse>
) => {
  try {
    const { holidays, user } = req.body

    const holidayIds = holidays
      .filter((holiday) => holiday.id)
      .map((holiday) => holiday.id)

    const getDeletedIds = await prisma.holiday.findMany({
      where: {
        userId: user.id,
        id: { notIn: holidayIds },
      },
    })

    // delete holidays that are not in the request
    await Promise.all(
      getDeletedIds.map(async (holiday) => {
        await prisma.holiday.delete({ where: { id: holiday.id } })
        logger.info(`Holiday is deleted: ${prettifyObject(holiday)}`)
      })
    )

    await Promise.all(
      holidays.map(async (holiday) => {
        const { id, description, date } = holiday
        if (id) {
          // update holiday
          const updatedHoliday = await prisma.holiday.update({
            where: { id, userId: user.id },
            data: {
              description,
              date: new Date(date),
            },
          })

          logger.info(`Holiday is updated: ${prettifyObject(updatedHoliday)}`)
        } else {
          // create new holiday
          const newHoliday = await prisma.holiday.create({
            data: {
              description,
              date: new Date(date),
              userId: user.id,
            },
          })

          logger.info(`Holiday is created: ${prettifyObject(newHoliday)}`)
        }
      })
    )

    res.send({
      message: 'success',
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'failed' })
  }
}
