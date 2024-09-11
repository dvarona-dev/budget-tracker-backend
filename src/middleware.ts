import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { checkUserById } from './auth/handlers'
import logger from './logger'
import { prettifyObject } from './utils/format'
import { verifyJWT } from './utils/jwt'

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
  logger.info(
    `Accessing ${req.method.toUpperCase()} [ ${req.originalUrl} ] route`
  )

  logger.debug(`Request headers: ${prettifyObject(req.headers)}`)
  logger.debug(`Request body: ${prettifyObject(req.body)}`)
  logger.debug(`Request query: ${prettifyObject(req.query)}`)
  logger.debug(`Request params: ${prettifyObject(req.params)}`)

  next()
}

export const validRouteRequest = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.info('Request has passed route process')

  logger.debug(`Request headers: ${prettifyObject(req.headers)}`)
  logger.debug(`Request body: ${prettifyObject(req.body)}`)
  logger.debug(`Request query: ${prettifyObject(req.query)}`)
  logger.debug(`Request params: ${prettifyObject(req.params)}`)

  next()
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).send({ message: 'unauthorized' })
  }

  const token = authorization.split(' ')[1]
  if (!token) {
    return res.status(401).send({ message: 'unauthorized' })
  }

  try {
    const { _id } = verifyJWT(token) as { _id: string }
    const user = await checkUserById(_id)

    if (!user) {
      return res.status(401).send({ message: 'unauthorized' })
    }

    req.body.user = user
  } catch (err) {
    logger.error(`JWT Token Verification failed:`, err)
    return res.status(401).send({ message: 'unauthorized' })
  }

  next()
}
