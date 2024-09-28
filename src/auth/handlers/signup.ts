import { Request, Response } from 'express'
import { SignUpBody, SignUpResponse } from '../types'
import logger from '../../logger'
import { prettifyObject } from '../../utils/format'
import bcrypt from 'bcryptjs'
import { prisma } from '../..'

export const signup = async (
  req: Request<{}, {}, SignUpBody>,
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

    const hashedPassword = bcrypt.hashSync(password, 12)

    // add new user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    })

    // add new members
    await prisma.userMember.createMany({
      data: [...members.map((name) => name.toLowerCase())].map((name) => {
        return {
          name,
          userId: newUser.id,
        }
      }),
    })

    // add new members to user
    const newMembers = await prisma.userMember.findMany({
      where: {
        name: { in: members.map((name) => name.toLowerCase()) },
        userId: newUser.id,
      },
      select: {
        id: true,
      },
    })

    await prisma.user.update({
      where: { id: newUser.id },
      data: {
        members: {
          connect: newMembers.map((member) => ({ id: member.id })),
        },
      },
    })

    logger.info(`User created: ${username}`)

    res.send({
      message: 'success',
    })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ message: 'server error in creating user' })
  }
}
