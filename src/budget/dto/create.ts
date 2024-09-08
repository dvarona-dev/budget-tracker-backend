export type BudgetPeriod = 15 | 30

export type CreateBudgetBody = {
  cutoff_start: Date
  cutoff_end: Date
  payout_date: Date
  period: BudgetPeriod
  items: BudgetItem[]
}

export type BudgetItem = {
  description: string
  amount: number
}
