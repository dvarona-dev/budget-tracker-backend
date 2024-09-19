import { Request, Response } from 'express'
import logger from '../../logger'
import { UserModel } from '../../auth/types'
import {
  GetExpenseResponse,
  UpdateExpenseResponse,
  UpdateExpenseBody,
} from '../types/expense'
import { prisma } from '../..'
import { prettifyObject } from '../../utils/format'

export const getExpenses = async (
  req: Request<{}, {}, UserModel>,
  res: Response<GetExpenseResponse>
) => {
  try {
    const { user } = req.body

    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
      },
    })

    logger.info(`Expenses fetched: ${prettifyObject(expenses)}`)

    res.send({
      message: 'success',
      expenses,
    })
  } catch (error) {
    logger.error(error)
    res
      .status(500)
      .send({ message: 'error in fetching expenses', expenses: [] })
  }
}

export const updateExpenses = async (
  req: Request<{}, {}, UpdateExpenseBody & UserModel>,
  res: Response<UpdateExpenseResponse>
) => {
  try {
    const { expenses, user } = req.body

    const expenseIds = expenses
      .filter((expense) => expense.id)
      .map((expense) => expense.id)

    const willDeleteExpenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
        id: { notIn: expenseIds },
      },
    })

    await Promise.all(
      willDeleteExpenses.map(async (expense) => {
        await prisma.expense.delete({ where: { id: expense.id } })
        logger.info(`Expense is deleted: ${prettifyObject(expense)}`)
      })
    )

    await Promise.all(
      expenses.map(async (expense) => {
        // TODO: update budget items as well
        const { id, description, amount, period } = expense
        if (id) {
          const updatedExpense = await prisma.expense.update({
            where: { id, userId: user.id },
            data: {
              description,
              amount,
              period: period === 15 ? 'fifteen' : 'thirty',
            },
          })

          logger.info(`Expense is updated: ${prettifyObject(updatedExpense)}`)
        } else {
          // TODO: create budget items as well
          const newExpense = await prisma.expense.create({
            data: {
              description,
              amount,
              period: period === 15 ? 'fifteen' : 'thirty',
              userId: user.id,
            },
          })

          logger.info(`Expense is created: ${prettifyObject(newExpense)}`)
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
