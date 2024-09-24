import { Request, Response } from 'express'
import logger from '../../logger'
import { UserModel } from '../../auth/types'
import { prisma } from '../..'
import { prettifyObject } from '../../utils/format'
import {
  GetDeductionResponse,
  UpdateDeductionBody,
  UpdateDeductionResponse,
} from '../types/deduction'

export const getDeductions = async (
  req: Request<{}, {}, UserModel>,
  res: Response<GetDeductionResponse>
) => {
  try {
    const { user } = req.body

    const deductions = await prisma.deduction.findMany({
      where: {
        userId: user.id,
      },
    })

    logger.info(`Deductions fetched: ${prettifyObject(deductions)}`)

    res.send({
      message: 'success',
      deductions,
    })
  } catch (error) {
    logger.error(error)
    res
      .status(500)
      .send({ message: 'error in fetching deductions', deductions: [] })
  }
}

export const updateDeductions = async (
  req: Request<{}, {}, UpdateDeductionBody & UserModel>,
  res: Response<UpdateDeductionResponse>
) => {
  try {
    const { deductions, user } = req.body

    const deductionIds = deductions
      .filter((deduction) => deduction.id)
      .map((deduction) => deduction.id)

    const geDeletedIds = await prisma.deduction.findMany({
      where: {
        userId: user.id,
        id: { notIn: deductionIds },
      },
    })

    // delete deductions that are not in the request
    await Promise.all(
      geDeletedIds.map(async (deduction) => {
        await prisma.deduction.delete({
          where: { id: deduction.id, userId: user.id },
        })
        logger.info(`Deduction is deleted: ${prettifyObject(deduction)}`)
      })
    )

    await Promise.all(
      deductions.map(async (deduction) => {
        const { id, description, amount, period } = deduction
        if (id) {
          // update existing deduction
          const updatedDeduction = await prisma.deduction.update({
            where: { id, userId: user.id },
            data: {
              description,
              amount,
              period: period === 15 ? 'fifteen' : 'thirty',
            },
          })

          logger.info(
            `Deduction is updated: ${prettifyObject(updatedDeduction)}`
          )
        } else {
          // create new deduction
          const newDeduction = await prisma.deduction.create({
            data: {
              description,
              amount,
              period: period === 15 ? 'fifteen' : 'thirty',
              userId: user.id,
            },
          })

          logger.info(`Deduction is created: ${prettifyObject(newDeduction)}`)
        }
      })
    )

    res.send({
      message: 'success',
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'failed' })
  }
}
