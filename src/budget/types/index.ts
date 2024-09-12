import { UserMember } from '@prisma/client'

export type BudgetPeriod = 15 | 30

export type BudgetItem = {
  description: string
  amount: number
  assignedTo: UserMember['id']
}
