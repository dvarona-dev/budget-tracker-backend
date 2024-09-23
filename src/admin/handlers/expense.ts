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

    const getDeletedIds = await prisma.expense.findMany({
      where: {
        userId: user.id,
        id: { notIn: expenseIds },
      },
    })

    // delete expenses that are not in the request
    await Promise.all(
      getDeletedIds.map(async (expense) => {
        await prisma.expense.delete({ where: { id: expense.id } })

        // also delete the expenses that are already added in the budget items
        await prisma.budgetItem.deleteMany({
          where: {
            referenceId: expense.id,
          },
        })

        logger.info(`Expense is deleted: ${prettifyObject(expense)}`)
      })
    )

    await Promise.all(
      expenses.map(async (expense) => {
        const { id, description, amount, period } = expense
        if (id) {
          // update expense
          const updatedExpense = await prisma.expense.update({
            where: { id, userId: user.id },
            data: {
              description,
              amount,
              period: period === 15 ? 'fifteen' : 'thirty',
            },
          })

          // also update the expenses that are already added in the budget items
          const expenseOnABudget = await prisma.budgetItem.findMany({
            where: {
              referenceId: id,
            },
            select: {
              id: true,
            },
          })

          // update budget items
          await Promise.all(
            expenseOnABudget.map(async (budgetItem) => {
              await prisma.budgetItem.update({
                where: {
                  id: budgetItem.id,
                },
                data: {
                  description,
                  amount,
                },
              })
            })
          )

          logger.info(`Expense is updated: ${prettifyObject(updatedExpense)}`)
        } else {
          // create new expense
          const periodText = period === 15 ? 'fifteen' : 'thirty'
          const newExpense = await prisma.expense.create({
            data: {
              description,
              amount,
              period: periodText,
              userId: user.id,
            },
          })

          const generalUserMember = await prisma.userMember.findUniqueOrThrow({
            where: {
              userId: user.id,
              name: 'general',
            },
            select: {
              id: true,
            },
          })

          // find budgets with the same period (15/30)
          const budgetWithSamePeriod = await prisma.budget.findMany({
            where: {
              userId: user.id,
              period: periodText,
              payout_date: {
                gte: new Date(),
              },
            },
            select: {
              id: true,
            },
          })

          // create budget items on each found budget with the new expense details
          await Promise.all(
            budgetWithSamePeriod.map(async (budget) => {
              await prisma.budgetItem.create({
                data: {
                  description,
                  amount,
                  budgetId: budget.id,
                  userMemberId: generalUserMember.id,
                  referenceId: newExpense.id,
                },
              })
            })
          )

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
