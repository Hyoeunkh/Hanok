import { useMutation } from '@tanstack/react-query';

import { getFetchInstance } from '../instance';

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: number;
    email: string;
    phone: string;
  };
};

export const getLoginPath = () => `/v1/auth/login`;

export const login = async (payload: LoginPayload) => {
  const response = await getFetchInstance().post<LoginResponse>(getLoginPath(), payload);
  return response.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
};
