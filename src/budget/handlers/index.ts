import { Budget } from '@prisma/client'
import { Request, Response } from 'express'
import { prisma } from '../..'
import { UserModel } from '../../auth/types'
import logger from '../../logger'
import { CreateBudgetBody, CreateResponse } from '../types/create'
import { ViewResponse } from '../types/view'

export const create = async (
  req: Request<{}, {}, CreateBudgetBody & UserModel>,
  res: Response<CreateResponse>
) => {
  try {
    const {
      user,
      cutoff_start,
      cutoff_end,
      payout_date,
      period,
      extraHours,
      items,
    } = req.body

    const budget: Budget = await prisma.budget.create({
      data: {
        cutoff_start: new Date(cutoff_start),
        cutoff_end: new Date(cutoff_end),
        payout_date: new Date(payout_date),
        extraHours,
        period: period === 15 ? 'fifteen' : 'thirty',
        userId: user.id,
      },
    })

    await prisma.budgetItem.createMany({
      data: items.map((item) => ({
        description: item.description,
        amount: item.amount,
        budgetId: budget.id,
        userMemberId: item.assignedTo,
      })),
    })

    const newBudget = await prisma.budget.findUniqueOrThrow({
      where: { id: budget.id },
      include: {
        items: true,
      },
    })

    logger.info('New budget created successfully: ', newBudget.id)

    res.send({ message: 'success', budget: newBudget })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'server error in creating budget' })
  }
}

export const getAll = async (
  req: Request<{}, {}, UserModel>,
  res: Response<ViewResponse>
) => {
  try {
    const user = req.body.user
    const budgets: Budget[] = await prisma.budget.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: {
          select: {
            description: true,
            amount: true,
            userMemberId: true,
          },
        },
      },
    })

    logger.info('All budgets fetched successfully: ', budgets)

    res.send({
      message: 'success',
      budgets,
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'server error in fetching budget' })
  }
}
