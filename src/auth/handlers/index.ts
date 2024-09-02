import { NextFunction, Request, Response } from 'express'
import { SIGNUP_REDIRECT_URL } from '../const'
import { AuthCredentials, SignInResponse, SignUpResponse } from '../dto/auth'

export const signup = (
  req: Request<{}, {}, AuthCredentials>,
  res: Response<SignUpResponse>,
  _next: NextFunction
) => {
  const { username, password } = req.body

  // Check if the username is already taken
  // If it is, return an error
  // If it's not, hash the password
  // Create a new user with id, createdAt, updatedAt, username and the hashed password

  res.send({
    message: 'User created successfully!',
    redirect: SIGNUP_REDIRECT_URL,
  })
}

export const signin = (
  req: Request<{}, {}, AuthCredentials>,
  res: Response<SignInResponse>,
  _next: NextFunction
) => {
  const { username, password } = req.body

  // Check if the username exists
  // If it doesn't, return an error
  // If it does, check if the password is correct compared to the hashed password
  // If it's not, return an error
  // If it is, create a JWT token and return it

  res.send({ access_token: 'token' })
}
