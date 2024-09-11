import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { prisma } from '../..'
import logger from '../../logger'
import { prettifyObject } from '../../utils/format'
import { signJWT, verifyJWT } from '../../utils/jwt'
import { SIGNUP_REDIRECT_URL } from '../const'
import {
  AuthCredentials,
  SignInResponse,
  SignUpResponse,
  VerifyTokenBody,
  VerifyTokenResponse,
} from '../dto/auth'

export const checkUserByUsername = async (username: string): Promise<User> => {
  const foundUser: User = await prisma.user.findUniqueOrThrow({
    where: { username },
  })

  logger.debug(
    `User found: ${foundUser ? prettifyObject(foundUser) : foundUser}`
  )

  return foundUser
}

export const checkUserById = async (id: string): Promise<User> => {
  const foundUser: User = await prisma.user.findFirstOrThrow({ where: { id } })

  logger.debug(
    `User found: ${foundUser ? prettifyObject(foundUser) : foundUser}`
  )

  return foundUser
}

export const signup = async (
  req: Request<{}, {}, AuthCredentials>,
  res: Response<SignUpResponse>
) => {
  try {
    const { username, password, members } = req.body
    logger.info(
      `Extracted 'username' and 'password': ${prettifyObject({
        username,
        password,
        members,
      })}`
    )

    const user = await checkUserByUsername(username)

    if (user) {
      logger.error(`Username already taken: ${username}`)
      return res.status(409).send({
        message: 'username is already taken',
      })
    }

    const hasedPassword = bcrypt.hashSync(password, 12)

    await prisma.user.create({
      data: {
        username,
        password: hasedPassword,
        members: {
          create: [...members.map((name) => name.toLowerCase()), 'general'].map(
            (name) => {
              return {
                name,
              }
            }
          ),
        },
      },
    })
    logger.info(`User created: ${username}`)

    res.send({
      message: 'user created successfully!',
      redirect: SIGNUP_REDIRECT_URL,
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'server error in creating user' })
  }
}

export const signin = async (
  req: Request<{}, {}, AuthCredentials>,
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
      return res.status(404).send({
        message: 'invalid username or password',
      })
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)

    if (!isPasswordValid) {
      logger.error(`Invalid password for user: ${username}`)
      return res.status(404).send({
        message: 'invalid username or password',
      })
    }

    const token = signJWT(
      {
        _id: user.id.toString(),
        username: user.username,
      },
      '15m'
    )

    logger.info(`User signed in: ${username} with token: ${token}`)

    res.send({ message: 'user found', access_token: token, expiresIn: '1h' })
  } catch (error) {
    logger.error(error)
    res.send({ message: 'server error in signing in' })
  }
}

export const verifyToken = async (
  req: Request<{}, {}, VerifyTokenBody>,
  res: Response<VerifyTokenResponse>
) => {
  const { token } = req.body

  try {
    const verifyToken = verifyJWT(token)

    if (verifyToken) {
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
