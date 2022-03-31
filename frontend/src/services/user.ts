import request from './request'
import { User } from '@/types/user'
import { Meta } from '@/types/response'

export function userSignUp({ email, password }: { email: string, password: string }) {
  return request.post('/v1/signup', { email, password })
}

export function userLogin({ email, password }: { email: string, password: string }) {
  return request.post('/v1/login', { email, password })
}

export function userGoogleLogin({ accessToken }: { accessToken: string }) {
  return request.post('/v1/login/google', { accessToken })
}

export function userFacebookLogin({ accessToken }: { accessToken: string }) {
  return request.post('/v1/login/facebook', { accessToken })
}

export function userMe(): Promise<User> {
  return request.get('/v1/me')
}

export function usersGet({ page = 1 }): Promise<{ data: User[], meta: Meta }> {
  return request.get(`/v1/users?page=${page}`)
}

export function userUpdate({ username }: { username: string }) {
  return request.patch('/v1/me', { username })
}

export function userResetPassword({ oldPassword, newPassword, newPasswordConfirmation }: { oldPassword: string, newPassword: string, newPasswordConfirmation: string }) {
  return request.patch('/v1/me/reset-password', { oldPassword, newPassword, newPasswordConfirmation })
}

export function userResendVerifyEmail(): Promise<{ email: string }> {
  return request.post('/v1/email-verify', {})
}
