import { Expense } from '@prisma/client'

export type TExpense = {
  id?: string
  description: string
  amount: number
  period: number
}

export type UpdateExpenseResponse = {
  message: 'success' | 'failed'
}

export type GetExpenseResponse = {
  message: string
  expenses: Expense[]
}

export type UpdateExpenseBody = {
  expenses: (Required<Pick<TExpense, 'id'>> & Omit<TExpense, 'id'>)[]
}
