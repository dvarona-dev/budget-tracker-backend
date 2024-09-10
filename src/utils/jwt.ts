import jwt from 'jsonwebtoken'
import logger from '../logger'

export const signJWT = (payload: object, expiresIn: string | number) => {
  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
    if (!JWT_SECRET_KEY) {
      logger.error('JWT_SECRET_KEY not found in environment variables')
      throw new Error('JWT_SECRET_KEY not found in environment variables')
    }

    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn })
  } catch (error) {
    throw new Error('error in signing token')
  }
}

export const verifyJWT = (token: string) => {
  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
    if (!JWT_SECRET_KEY) {
      logger.error('JWT_SECRET_KEY not found in environment variables')
      throw new Error('JWT_SECRET_KEY not found in environment variables')
    }

    return jwt.verify(token, JWT_SECRET_KEY)
  } catch (error) {
    throw new Error('error in verifying token')
  }
}
