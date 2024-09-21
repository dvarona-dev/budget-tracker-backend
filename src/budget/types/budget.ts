import { UserMember } from '@prisma/client'

export type BudgetPeriod = 15 | 30

export type BudgetItem = {
  description: string
  amount: number
  assignedTo: UserMember['id']
}

export type GetBudgetResponse = {
  id: string
  payout_date: Date
  cutoff_start: Date
  cutoff_end: Date
  noOfHours: number
  grossSalary: number
  netSalary: number
  remainingBudget: number
  netSalaryWithAdditionalIncomes?: number
  totalAdditionalIncomes?: number
  totalExpenses?: number
}

export type UpdateBudgetItemBody = {
  id: string
  description: string
  amount: number
}
