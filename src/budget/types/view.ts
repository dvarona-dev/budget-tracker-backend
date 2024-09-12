import { Budget } from '@prisma/client'

export type ViewResponse = {
  message: string
  budgets?: Budget[]
}
