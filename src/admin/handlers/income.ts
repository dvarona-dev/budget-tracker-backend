import { Income } from '@prisma/client'
import { Request, Response } from 'express'
import { prisma } from '../..'
import { UserModel } from '../../auth/types'
import logger from '../../logger'
import { prettifyObject } from '../../utils/format'
import {
  IncomeResponse,
  NewIncomeBody,
  PerHourRateResponse,
  UpdateIncomeBody,
} from '../types/income'

export const newIncome = async (
  req: Request<{}, {}, NewIncomeBody & UserModel>,
  res: Response<IncomeResponse>
) => {
  try {
    const { hourRate, additionals, user } = req.body

    const newIncome: Income = await prisma.income.create({
      data: {
        hourRate,
        userId: user.id,
        additionalIncomes: {
          create: additionals
            .filter((item) => {
              const { description, amount } = item
              if (description && amount > 0) {
                return true
              }

              return false
            })
            .map((item) => ({
              description: item.description,
              amount: item.amount,
            })),
        },
      },
      include: {
        additionalIncomes: true,
      },
    })

    logger.info(`New income budget saved: ${prettifyObject(newIncome)}`)

    res.send({
      message: 'success',
      income: newIncome,
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'failed' })
  }
}

export const updateIncome = async (
  req: Request<{}, {}, UpdateIncomeBody & UserModel>,
  res: Response<IncomeResponse>
) => {
  try {
    const { incomeId, hourRate, additionals, user } = req.body

    // update additional incomes
    await Promise.all(
      additionals.map(async (item) => {
        const { id, description, amount } = item
        if (id) {
          // update additional income (for now only 1 entry)
          const updatedAdditionalIncome = await prisma.additionalIncome.update({
            where: { id },
            data: {
              description,
              amount,
            },
          })

          logger.info(
            `Additional income budget updated: ${prettifyObject(
              updatedAdditionalIncome
            )}`
          )
        }
      })
    )

    const updatedIncome: Income = await prisma.income.update({
      where: { id: incomeId, userId: user.id },
      data: {
        hourRate,
      },
      include: {
        additionalIncomes: true,
      },
    })

    logger.info(`Income budget updated: ${prettifyObject(updatedIncome)}`)

    res.send({
      message: 'success',
      income: updatedIncome,
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'failed' })
  }
}

export const getIncome = async (
  req: Request<{}, {}, UserModel>,
  res: Response<IncomeResponse>
) => {
  try {
    const { user } = req.body

    try {
      const income: Income = await prisma.income.findFirstOrThrow({
        where: {
          userId: user.id,
        },
        include: {
          additionalIncomes: true,
        },
      })

      logger.info(`Income budget fetched: ${prettifyObject(income)}`)

      res.send({
        message: 'success',
        income,
      })
    } catch (error) {
      logger.error(error)
      res.send({
        message: 'success',
      })
    }
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'failed' })
  }
}

export const getPerHourRate = async (
  req: Request<{}, {}, UserModel>,
  res: Response<PerHourRateResponse>
) => {
  try {
    const { user } = req.body

    const ratePerHour = await prisma.income.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        hourRate: true,
      },
    })

    if (!ratePerHour) {
      return res.send({
        message: 'success',
        perHourRate: 0,
      })
    }

    res.send({
      message: 'success',
      perHourRate: ratePerHour.hourRate,
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'failed', perHourRate: 0 })
  }
}
