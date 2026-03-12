import { useMutation } from '@tanstack/react-query';

import { getFetchInstance } from '../instance';
import type { ApiResponse } from '@/types';

export const getRefreshTokenPath = () => `/v1/auth/refresh`;

export const refreshToken = async () => {
  const response = await getFetchInstance().post<ApiResponse>(getRefreshTokenPath());

  const accessToken = response.headers['authorization']?.replace('Bearer ', '');
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  return response.data;
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () => refreshToken(),
  });
};
