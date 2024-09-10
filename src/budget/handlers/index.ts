import { Budget } from '@prisma/client'
import { Request, Response } from 'express'
import { prisma } from '../..'
import { UserModel } from '../../auth/dto/auth'
import { CreateBudgetBody, CreateResponse } from '../dto/create'

export const create = async (
  req: Request<{}, {}, CreateBudgetBody & UserModel>,
  res: Response<CreateResponse>
) => {
  try {
    const { user, cutoff_start, cutoff_end, payout_date, period, items } =
      req.body

    console.log({ user, cutoff_start, cutoff_end, payout_date, period, items })

    const budget: Budget = await prisma.budget.create({
      data: {
        cutoff_start: new Date(cutoff_start),
        cutoff_end: new Date(cutoff_end),
        payout_date: new Date(payout_date),
        period: period === 15 ? 'fifteen' : 'thirty',
        userId: user.id,
      },
    })

    await prisma.budgetItem.createMany({
      data: items.map((item) => ({
        description: item.description,
        amount: item.amount,
        budgetId: budget.id,
        userMemberId: user.id,
      })),
    })

    const newBudget = await prisma.budget.findUniqueOrThrow({
      where: { id: budget.id },
      include: {
        items: true,
      },
    })

    res.send({ message: 'budget is successfully created', budget: newBudget })
  } catch (error) {
    res.status(500).send({ message: 'server error in creating budget' })
  }
}
