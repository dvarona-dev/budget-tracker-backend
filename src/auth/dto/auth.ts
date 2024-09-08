import { User } from '@prisma/client'

export type SIGNUP_REDIRECT_URL = '/signin'

export type AuthCredentials = {
  username: string
  password: string
  members: string[]
}

export type SignUpResponse = {
  message: string
  redirect?: SIGNUP_REDIRECT_URL
}

export type SignInResponse = {
  message: string
  access_token?: string
  expiresIn?: string
}

export type UserModel = {
  user: User
}
