import { Budget } from '@prisma/client'
import { GetBudgetResponse } from './budget'

export type ViewAllResponse = {
  message: string
  budgets?: GetBudgetResponse[]
}

export type IdAsParams = {
  id: string
}

export type ViewByIdResponse = {
  message: string
  budget?: Budget & GetBudgetResponse
}

export type MessageResponse = {
  message: string
}
