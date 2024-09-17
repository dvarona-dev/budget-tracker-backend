import { Deduction } from '@prisma/client'

export type TDeduction = {
  id?: string
  description: string
  amount: number
  period: number
}

export type UpdateDeductionResponse = {
  message: 'success' | 'failed'
}

export type GetDeductionResponse = {
  message: string
  deductions: Deduction[]
}

export type UpdateDeductionBody = {
  deductions: (Required<Pick<TDeduction, 'id'>> & Omit<TDeduction, 'id'>)[]
}
