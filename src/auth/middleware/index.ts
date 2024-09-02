import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import logger from '../../logger'
import { prettifyObject } from '../../utils/format'

export const expressValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    logger.error(
      `Request has failed in express validations: ${prettifyObject({
        errors: errors.array(),
      })}`
    )

    return res.status(400).json({ message: errors.array()[0].msg })
  }

  next()
}

export const accessingRoute = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.info(`Accessing POST [ ${req.originalUrl} ] route`)

  logger.debug(`Request headers: ${prettifyObject(req.headers)}`)
  logger.debug(`Request body: ${prettifyObject(req.body)}`)
  logger.debug(`Request query: ${prettifyObject(req.query)}`)
  logger.debug(`Request params: ${prettifyObject(req.params)}`)

  next()
}

export const successValidations = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.info('Request has passed validation')

  logger.debug(`Request headers: ${prettifyObject(req.headers)}`)
  logger.debug(`Request body: ${prettifyObject(req.body)}`)
  logger.debug(`Request query: ${prettifyObject(req.query)}`)
  logger.debug(`Request params: ${prettifyObject(req.params)}`)

  next()
}
