import { Request, Response } from 'express'
import { VerifyTokenBody, VerifyTokenResponse } from '../types'
import { verifyJWT } from '../../utils/jwt'
import logger from '../../logger'

export const verifyToken = async (
  req: Request<{}, {}, VerifyTokenBody>,
  res: Response<VerifyTokenResponse>
) => {
  const { token } = req.body

  try {
    const verifyToken = verifyJWT(token)

    if (verifyToken) {
      logger.info(`Token verified: ${token}`)

      res.send({
        message: 'valid',
      })
    } else {
      throw new Error('invalid')
    }
  } catch (error) {
    logger.error(error)
    res.send({
      message: 'invalid',
    })
  }
}
