import jwt from 'jsonwebtoken'
import logger from '../logger'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const signJWT = (
  payload: object,
  expiresIn: string | number
): string | null => {
  try {
    if (!JWT_SECRET_KEY) {
      logger.error('JWT_SECRET_KEY not found in environment variables')
      throw new Error('JWT_SECRET_KEY not found in environment variables')
    }

    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn })
  } catch (error) {
    return null
  }
}

export const verifyJWT = (token: string): string | jwt.JwtPayload | null => {
  try {
    if (!JWT_SECRET_KEY) {
      logger.error('JWT_SECRET_KEY not found in environment variables')
      return null
    }

    return jwt.verify(token, JWT_SECRET_KEY)
  } catch (error) {
    return null
  }
}
