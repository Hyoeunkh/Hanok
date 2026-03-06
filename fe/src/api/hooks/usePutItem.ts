import { useMutation } from '@tanstack/react-query';
import { getFetchInstance, queryClient } from '@/api/instance';
import type { UpdateItemPayload, UpdateItemResponse } from '@/types';

const putItemPath = (itemId: number) => `/v1/items/${itemId}`;

export const usePutItem = () => {
  return useMutation<UpdateItemResponse, Error, { itemId: number; payload: UpdateItemPayload }>({
    mutationFn: async ({ itemId, payload }) => {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('description', payload.description);

      if (payload.existingImageUrls && payload.existingImageUrls.length > 0) {
        payload.existingImageUrls.forEach((url) => {
          formData.append('existingImageUrls', url);
        });
      }

      if (payload.newImages && payload.newImages.length > 0) {
        payload.newImages.forEach((file) => {
          formData.append('newImages', file);
        });
      }

      const response = await getFetchInstance().put(putItemPath(itemId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
