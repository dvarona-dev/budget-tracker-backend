import { User } from '@prisma/client'
import { prisma } from '../..'
import logger from '../../logger'
import { prettifyObject } from '../../utils/format'

export const checkUserByUsername = async (
  username: string
): Promise<User | null> => {
  const foundUser: User | null = await prisma.user.findUnique({
    where: { username },
  })

  logger.debug(
    `User found: ${foundUser ? prettifyObject(foundUser) : foundUser}`
  )

  return foundUser
}

export const checkUserById = async (id: string): Promise<User | null> => {
  const foundUser: User | null = await prisma.user.findUnique({ where: { id } })

  logger.debug(
    `User found: ${foundUser ? prettifyObject(foundUser) : foundUser}`
  )

  return foundUser
}
