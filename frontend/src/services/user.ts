import request from './request'
import { User } from '@/types/user'
import { Meta } from '@/types/response'

export function userSignUp({ email, password }: { email: string, password: string }) {
  return request.post('/v1/signup', { email, password }, { withCredentials: true })
}

export function userLogin({ email, password }: { email: string, password: string }) {
  return request.post('/v1/login', { email, password }, { withCredentials: true })
}

export function userGoogleLogin({ accessToken }: { accessToken: string }) {
  return request.post('/v1/login/google', { accessToken }, { withCredentials: true })
}

export function userFacebookLogin({ accessToken }: { accessToken: string }) {
  return request.post('/v1/login/facebook', { accessToken }, { withCredentials: true })
}

export function userMe(): Promise<User> {
  return request.get('/v1/me', { withCredentials: true })
}

export function usersGet({ page = 1 }): Promise<{ data: User[], meta: Meta }> {
  return request.get(`/v1/users?page=${page}`, { withCredentials: true })
}

export function userUpdate({ username }: { username: string }) {
  return request.patch('/v1/me', { username }, { withCredentials: true })
}

export function userResetPassword({ oldPassword, newPassword, newPasswordConfirmation }: { oldPassword: string, newPassword: string, newPasswordConfirmation: string }) {
  return request.patch('/v1/me/reset-password', { oldPassword, newPassword, newPasswordConfirmation }, { withCredentials: true })
}

export function userResendVerifyEmail(): Promise<{ email: string }> {
  return request.post('/v1/email-verify', {}, { withCredentials: true })
}
