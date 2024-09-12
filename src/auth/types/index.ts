import { User } from '@prisma/client'

export type SIGNUP_REDIRECT_URL = '/signin'

export type UserModel = {
  user: User
}

export type SignInBody = {
  username: string
  password: string
}

export type SignInResponse = {
  message: string
  access_token?: string
  expiresIn?: string
  members?: {
    id: string
    name: string
  }[]
}

export type SignUpBody = SignInBody & {
  members: string[]
}

export type SignUpResponse = {
  message: string
  redirect?: SIGNUP_REDIRECT_URL
}

export type VerifyTokenBody = {
  token: string
}

export type VerifyTokenResponse = {
  message: 'invalid' | 'valid'
}
