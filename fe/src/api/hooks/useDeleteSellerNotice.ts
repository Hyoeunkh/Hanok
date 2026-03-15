import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getFetchInstance } from '../instance';
import type { DeleteSellerNoticeResponse } from '@/types';

export const deleteSellerNoticePath = (sellerId: number, notiecId: number) =>
  `/v1/sellers/${sellerId}/notices/${notiecId}`;

export const deleteSellerNotice = async (sellerId: number, noticeId: number) => {
  const response = await getFetchInstance().delete<DeleteSellerNoticeResponse>(
    deleteSellerNoticePath(sellerId, noticeId),
  );
  return response.data;
};

export const useDeleteSellerNotice = (sellerId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: number) => deleteSellerNotice(sellerId, noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sellerNotice', sellerId],
      });
    },
  });
};
