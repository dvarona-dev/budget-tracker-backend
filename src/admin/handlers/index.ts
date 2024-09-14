import { Income } from '@prisma/client'
import { Request, Response } from 'express'
import { prisma } from '../..'
import { UserModel } from '../../auth/types'
import logger from '../../logger'
import { prettifyObject } from '../../utils/format'
import { IncomeResponse, NewIncomeBody, UpdateIncomeBody } from '../types'

export const newIncome = async (
  req: Request<{}, {}, NewIncomeBody & UserModel>,
  res: Response<IncomeResponse>
) => {
  try {
    const { hourRate, additionals, user } = req.body

    const newIncome: Income = await prisma.income.create({
      data: {
        hourRate,
        userId: user.id.toString(),
        additionalIncomes: {
          create: additionals.map((item) => ({
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
  req: Request<{}, {}, UpdateIncomeBody>,
  res: Response<IncomeResponse>
) => {
  try {
    const { incomeId, hourRate, additionals } = req.body

    await Promise.all(
      additionals.map(async (item) => {
        const { id, description, amount } = item
        if (id) {
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
      where: { id: incomeId },
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
