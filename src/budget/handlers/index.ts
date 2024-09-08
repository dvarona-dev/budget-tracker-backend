import { Request, Response } from 'express'
import { UserModel } from '../../auth/dto/auth'
import { CreateBudgetBody } from '../dto/create'

export const create = async (
  req: Request<{}, {}, CreateBudgetBody & UserModel>,
  res: Response
) => {
  const { user, cutoff_start, cutoff_end, payout_date, period, items } =
    req.body

  console.log({ user, cutoff_start, cutoff_end, payout_date, period, items })

  res.send({ message: 'success' })
}
