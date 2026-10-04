import { apiClient } from './client';

import type {
  ChangePasswordRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  Session,
  SignInRequest,
  UpdateProfileRequest,
  User,
} from './types';

export const authApi = {
  signIn: (body: SignInRequest) => apiClient.post<Session>('/auth/login', body).then((r) => r.data),
  register: (body: RegisterRequest) => apiClient.post<Session>('/auth/register', body).then((r) => r.data),
  requestPasswordReset: (email: string) => apiClient.post<MessageResponse>('/auth/password/forgot', { email }).then((r) => r.data),
  resetPassword: (body: ResetPasswordRequest) => apiClient.post<MessageResponse>('/auth/password/reset', body).then((r) => r.data),
  me: () => apiClient.get<User>('/auth/me').then((r) => r.data),
  updateProfile: (body: UpdateProfileRequest) => apiClient.patch<User>('/me', body).then((r) => r.data),
  changePassword: (body: ChangePasswordRequest) => apiClient.post<MessageResponse>('/me/password', body).then((r) => r.data),
};
