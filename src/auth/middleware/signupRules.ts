import { body } from 'express-validator'
import { prisma } from '../..'
import { User } from '@prisma/client'
import logger from '../../logger'
import { Request } from 'express'
import { prettifyObject } from '../../utils/format'

export const signupRules = [
  body('username')
    .isLength({ min: 4 })
    .withMessage('username must be at least 4 characters long')
    .custom(async (username: string) => {
      try {
        const foundUser: User | null = await prisma.user.findUnique({
          where: { username },
        })

        if (foundUser) {
          logger.info(`User found: ${prettifyObject(foundUser)}`)
          throw new Error('username is already taken')
        }
      } catch (error) {
        logger.error(error)
        throw new Error('username is already taken')
      }
    }),
  body('password')
    .isLength({ min: 7 })
    .withMessage('password must be at least 7 characters long'),
  body('confirmPassword').custom(async (confirmPassword: string, meta) => {
    const req = meta.req as unknown as Request
    const password: string = req.body.password

    if (confirmPassword.trim() !== password.trim()) {
      logger.error('passwords do not match')
      throw new Error('passwords do not match')
    }
  }),
  body('members')
    .isArray({ min: 1 })
    .withMessage('members must be an array with at least one member')
    .custom(async (members: any[]) => {
      const isValidMembers = members.every(
        (member) => typeof member === 'string' && member.trim() !== ''
      )

      if (!isValidMembers) {
        logger.error('one or more members are invalid')
        throw new Error('one or more members are invalid')
      }
    }),
]
