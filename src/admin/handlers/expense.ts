import { Request, Response } from 'express'
import logger from '../../logger'
import { UserModel } from '../../auth/types'
import {
  GetExpenseResponse,
  NewExpenseBody,
  NewExpenseResponse,
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

export const newExpenses = async (
  req: Request<{}, {}, NewExpenseBody & UserModel>,
  res: Response<NewExpenseResponse>
) => {
  try {
    const { expenses, user } = req.body

    await Promise.all(
      expenses.map(async (expense) => {
        const { description, amount, period } = expense
        const newExpense = await prisma.expense.create({
          data: {
            description,
            amount,
            period: period === 15 ? 'fifteen' : 'thirty',
            userId: user.id,
          },
        })

        logger.info(`Expense is created: ${prettifyObject(newExpense)}`)
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

export const updateExpenses = async (
  req: Request<{}, {}, UpdateExpenseBody & UserModel>,
  res: Response<NewExpenseResponse>
) => {
  try {
    const { expenses, user } = req.body

    await Promise.all(
      expenses.map(async (expense) => {
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
