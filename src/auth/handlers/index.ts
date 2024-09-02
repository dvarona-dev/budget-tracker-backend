import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../..'
import logger from '../../logger'
import { prettifyObject } from '../../utils/format'
import { SIGNUP_REDIRECT_URL } from '../const'
import { AuthCredentials, SignInResponse, SignUpResponse } from '../dto/auth'

export const checkUserByUsername = async (
  username: string
): Promise<User | null> => {
  const foundUser = await prisma.user.findUnique({ where: { username } })

  logger.debug(
    `User found: ${foundUser ? prettifyObject(foundUser) : foundUser}`
  )

  return foundUser
}

export const signup = async (
  req: Request<{}, {}, AuthCredentials>,
  res: Response<SignUpResponse>
) => {
  const { username, password, members } = req.body
  logger.info(
    `Extracted 'username' and 'password': ${prettifyObject({
      username,
      password,
      members,
    })}`
  )

  // Check if the username is already taken
  const user = await checkUserByUsername(username)
  // If it is, return an error
  if (user) {
    logger.error(`Username already taken: ${username}`)
    return res.status(409).send({
      message: 'username is already taken',
    })
  }
  // If it's not, hash the password
  const hasedPassword = bcrypt.hashSync(password, 12)
  // Create a new user with id, createdAt, updatedAt, username and the hashed password
  await prisma.user.create({
    data: {
      username,
      password: hasedPassword,
      members: [...members, 'general'],
    },
  })
  logger.info(`User created: ${username}`)

  // Return a success message
  res.send({
    message: 'user created successfully!',
    redirect: SIGNUP_REDIRECT_URL,
  })
}

export const signin = async (
  req: Request<{}, {}, AuthCredentials>,
  res: Response<SignInResponse>
) => {
  const { username, password } = req.body
  logger.info(
    `Extracted 'username' and 'password': ${prettifyObject({
      username,
      password,
    })}`
  )

  // Check if the username exists
  const user = await checkUserByUsername(username)
  // If it doesn't, return an error
  if (!user) {
    logger.error(`User not found: ${username}`)
    return res.status(404).send({
      message: 'invalid username or password',
    })
  }
  // If it does, check if the password is correct compared to the hashed password
  const isPasswordValid = bcrypt.compareSync(password, user.password)
  // If it's not, return an error
  if (!isPasswordValid) {
    logger.error(`Invalid password for user: ${username}`)
    return res.status(404).send({
      message: 'invalid username or password',
    })
  }
  // If it is, create a JWT token and return it
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
  if (!JWT_SECRET_KEY) {
    logger.error('JWT_SECRET_KEY not found in environment variables')
    return res.status(500).send({
      message: 'internal server error',
    })
  }

  const token = jwt.sign(
    {
      _id: user.id.toString(),
      username: user.username,
    },
    JWT_SECRET_KEY,
    { expiresIn: '1h' }
  )
  logger.info(`User signed in: ${username} with token: ${token}`)

  // Return a success message
  res.send({ message: 'user found', access_token: token, expiresIn: '1h' })
}
