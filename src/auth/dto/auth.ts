export type SIGNUP_REDIRECT_URL = '/signin'

export interface AuthCredentials {
  username: string
  password: string
}

export interface SignUpResponse {
  message: string
  redirect?: SIGNUP_REDIRECT_URL
}

export interface SignInResponse {
  message: string
  access_token?: string
  expiresIn?: string
}
