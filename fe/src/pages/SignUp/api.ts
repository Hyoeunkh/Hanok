import { getFetchInstance } from '@/api/instance';

const api = getFetchInstance();

export const checkEmailDuplicate = async (email: string) => {
  // Mock endpoint, replace with real URL
  const { data } = await api.get<{ isDuplicated: boolean }>('/members/check-email', {
    params: { email },
  });
  return data;
};

export const requestSmsCode = async (phone: string) => {
  const { data } = await api.post<{ expireAt: string }>('/auth/sms/send', { phone });
  return data;
};

export const verifySmsCode = async (phone: string, code: string) => {
  const { data } = await api.post<{ verified: boolean; sessionToken: string }>('/auth/sms/verify', {
    phone,
    code,
  });
  return data;
};

export const signUp = async (payload: {
  email: string;
  nickname: string;
  password: string;
  phone: string;
  smsToken: string;
}) => {
  const { data } = await api.post('/members/signup', payload);
  return data;
};
