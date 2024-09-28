import { Request, Response } from 'express'
import { SignInBody, SignInResponse } from '../types'
import logger from '../../logger'
import { prettifyObject } from '../../utils/format'
import { checkUserByUsername } from '.'
import bcrypt from 'bcryptjs'
import { prisma } from '../..'
import { signJWT } from '../../utils/jwt'

export const signin = async (
  req: Request<{}, {}, SignInBody>,
  res: Response<SignInResponse>
) => {
  try {
    const { username, password } = req.body

    logger.info(
      `Extracted 'username' and 'password': ${prettifyObject({
        username,
        password,
      })}`
    )

    const user = await checkUserByUsername(username)

    if (!user) {
      logger.error(`User not found: ${username}`)
      res.status(404).send({
        message: 'invalid username or password',
      })
      return
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)

    if (!isPasswordValid) {
      logger.error(`Invalid password for user: ${username}`)
      res.status(404).send({
        message: 'invalid username or password',
      })
      return
    }

    const members = await prisma.userMember.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    })

    const token = signJWT(
      {
        _id: user.id.toString(),
        username: user.username,
      },
      '30m'
    )

    if (!token) {
      logger.error('Token signing failed')
      res.status(404).send({
        message: 'token signing failed',
      })
      return
    }

    logger.info(`User signed in: ${username} with token: ${token}`)

    res.send({
      message: 'success',
      data: {
        access_token: token,
        expiresIn: '30m',
        members,
      },
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'server error in signing in' })
  }
}
