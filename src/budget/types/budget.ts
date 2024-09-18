import { UserMember } from '@prisma/client'

export type BudgetPeriod = 15 | 30

export type BudgetItem = {
  description: string
  amount: number
  assignedTo: UserMember['id']
}

export type GetBudgetsResponse = {
  id: string
  cutoff_start: Date
  cutoff_end: Date
  payout_date: Date
  noOfHours: number
  grossSalary: number
  netSalary: number
  totalAdditionalIncomes: number
  netSalaryWithAdditionalIncomes: number
  totalExpenses: number
  remainingBudget: number
  allExpenses: {
    id: string
    description: string
    amount: number
    assignedTo: string
  }[]
}
