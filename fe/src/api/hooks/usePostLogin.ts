import { useMutation } from '@tanstack/react-query';

import { getFetchInstance } from '../instance';
import type { LoginPayload, ApiResponse } from '@/types';

export const getLoginPath = () => `/v1/auth/login`;

export const login = async (payload: LoginPayload) => {
  const response = await getFetchInstance().post<ApiResponse>(getLoginPath(), payload);

  const accessToken = response.headers['authorization']?.replace('Bearer ', '');
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  return response.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
};
