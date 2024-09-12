import { Income } from '@prisma/client'

export type AdditionalIncome = {
  id: string
  description: string
  amount: number
}

export type NewIncomeBody = {
  hourRate: number
  additionals: AdditionalIncome[]
}

export type UpdateIncomeBody = NewIncomeBody & {
  incomeId: string
}

export type IncomeResponse = {
  message: 'success' | 'failed'
  income?: Income | Income[]
}
