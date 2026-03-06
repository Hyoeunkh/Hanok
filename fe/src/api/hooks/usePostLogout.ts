import { useMutation } from '@tanstack/react-query';

import { getFetchInstance } from '../instance';

export type LogoutPayload = {
  refreshToken: string;
};

export type LogoutResponse = {
  success: boolean;
};

export const getLogoutPath = () => `/v1/auth/logout`;

export const logout = async (payload: LogoutPayload) => {
  const response = await getFetchInstance().post<LogoutResponse>(getLogoutPath(), payload);
  return response.data;
};

export const useLogout = () => {
  return useMutation({
    mutationFn: (payload: LogoutPayload) => logout(payload),
  });
};
