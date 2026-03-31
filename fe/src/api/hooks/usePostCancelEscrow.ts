import { useMutation } from '@tanstack/react-query';

import { getFetchInstance, queryClient } from '../instance';
import { patchEscrowStatusCaches } from '@/utils/escrowCache';

export const postCancelEscrowPath = (escrowId: string | number) => `/v1/escrows/${escrowId}/cancel`;

export const postCancelEscrow = async ({
  escrowId,
  cancelReason,
}: {
  escrowId: string | number;
  cancelReason: string;
}) => {
  const response = await getFetchInstance().post(postCancelEscrowPath(escrowId), {
    escrowId,
    cancelReason,
  });
  return response.data;
};

export const usePostCancelEscrow = () => {
  return useMutation({
    mutationFn: (params: { escrowId: string | number; cancelReason: string }) => postCancelEscrow(params),
    throwOnError: false,
    onSuccess: (_, variables) => {
      patchEscrowStatusCaches(queryClient, variables.escrowId, 'CANCELLED');
      queryClient.invalidateQueries({ queryKey: ['sellerProfile'] });
    },
  });
};
