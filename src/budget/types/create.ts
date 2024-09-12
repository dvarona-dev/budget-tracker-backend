import { Budget } from '@prisma/client'
import { BudgetItem, BudgetPeriod } from './budget'

export type CreateBudgetBody = {
  cutoff_start: Date
  cutoff_end: Date
  payout_date: Date
  period: BudgetPeriod
  items: BudgetItem[]
}

export type CreateResponse = {
  message: string
  budget?: Budget
}
