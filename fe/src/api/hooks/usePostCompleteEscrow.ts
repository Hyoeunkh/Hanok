import { useMutation } from '@tanstack/react-query';

import { getFetchInstance, queryClient } from '../instance';
import { patchEscrowStatusCaches } from '@/utils/escrowCache';

export const postCompleteEscrowPath = (escrowId: string | number) => `/v1/escrows/${escrowId}/complete`;

export const postCompleteEscrow = async (escrowId: string | number) => {
  const response = await getFetchInstance().post(postCompleteEscrowPath(escrowId));
  return response.data;
};

export const usePostCompleteEscrow = () => {
  return useMutation({
    mutationFn: postCompleteEscrow,
    onSuccess: (_, escrowId) => {
      patchEscrowStatusCaches(queryClient, escrowId, 'COMPLETED');
      queryClient.invalidateQueries({ queryKey: ['nftReceipt', escrowId] });
    },
  });
};
