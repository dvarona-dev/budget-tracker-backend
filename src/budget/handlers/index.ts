import { Budget } from '@prisma/client'
import { Request, Response } from 'express'
import { prisma } from '../..'
import { UserModel } from '../../auth/types'
import logger from '../../logger'
import { CreateBudgetBody, CreateResponse } from '../types/create'
import { ViewResponse } from '../types/view'
import { prettifyObject } from '../../utils/format'
import { getWorkDays } from '../../utils'
import { HOURS_PER_DAY } from '../constants'

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

    const generalUserMember = await prisma.userMember.findUniqueOrThrow({
      where: {
        userId: user.id,
        name: 'general',
      },
      select: {
        id: true,
      },
    })
    const expensesOfPeriod = await prisma.expense.findMany({
      where: {
        userId: user.id,
        period: budget.period,
      },
    })

    const mappedItems = items.map((item) => ({
      description: item.description,
      amount: item.amount,
      budgetId: budget.id,
      userMemberId: item.assignedTo,
    }))
    const mappedExpenses = expensesOfPeriod.map((expense) => ({
      description: expense.description,
      amount: expense.amount,
      budgetId: budget.id,
      userMemberId: generalUserMember.id,
    }))

    await prisma.budgetItem.createMany({
      data: [...mappedItems, ...mappedExpenses],
    })

    const newBudget = await prisma.budget.findUniqueOrThrow({
      where: { id: budget.id },
      include: {
        items: true,
      },
    })

    logger.info(`New budget created successfully: ${prettifyObject(newBudget)}`)

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
    const income = await prisma.income.findFirstOrThrow({
      where: {
        userId: user.id,
      },
    })
    const additionalIncomes = await prisma.additionalIncome.findMany({
      where: {
        incomeId: income.id,
      },
    })
    const totalAdditionalIncomes = additionalIncomes.reduce(
      (acc, additionalIncome) => acc + additionalIncome.amount,
      0
    )

    const formattedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const deductions = await prisma.deduction.findMany({
          where: {
            userId: user.id,
            period: budget.period,
          },
        })
        const totalDeductions = deductions.reduce(
          (acc, deduction) => acc + deduction.amount,
          0
        )

        const noOfWorkDays = await getWorkDays(
          budget.cutoff_start,
          budget.cutoff_end,
          user.id
        )

        const budgetItems = (
          await prisma.budgetItem.findMany({
            where: {
              budgetId: budget.id,
            },
            select: {
              id: true,
              description: true,
              amount: true,
              UserMember: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          })
        ).map((budgetItem) => {
          return {
            id: budgetItem.id,
            description: budgetItem.description,
            amount: budgetItem.amount,
            assignedTo: budgetItem.UserMember.name,
          }
        })
        const totalExpenses = budgetItems.reduce(
          (acc, expense) => acc + expense.amount,
          0
        )

        const noOfHours = noOfWorkDays * (HOURS_PER_DAY + budget.extraHours)
        const grossSalary = income.hourRate * noOfHours
        const netSalary = grossSalary - totalDeductions
        const netSalaryWithAdditionalIncomes =
          netSalary + totalAdditionalIncomes
        const remainingBudget = netSalaryWithAdditionalIncomes - totalExpenses

        return {
          id: budget.id,
          cutoff_start: budget.cutoff_start,
          cutoff_end: budget.cutoff_end,
          payout_date: budget.payout_date,
          noOfHours,
          grossSalary,
          netSalary,
          totalAdditionalIncomes,
          netSalaryWithAdditionalIncomes,
          totalExpenses,
          remainingBudget,
        }
      })
    )

    logger.info(
      `All budgets fetched successfully: ${prettifyObject(formattedBudgets)}`
    )

    res.send({
      message: 'success',
      budgets: formattedBudgets,
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'server error in fetching budgets' })
  }
}
