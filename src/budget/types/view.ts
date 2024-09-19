import { Budget } from '@prisma/client'
import { GetBudgetsResponse } from './budget'

export type ViewAllResponse = {
  message: string
  budgets?: GetBudgetsResponse[]
}

export type IdAsParams = {
  id: string
}

export type ViewByIdResponse = {
  message: string
  budget?: Budget
}
