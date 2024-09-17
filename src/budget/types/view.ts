import { GetBudgetsResponse } from './budget'

export type ViewResponse = {
  message: string
  budgets?: GetBudgetsResponse[]
}
