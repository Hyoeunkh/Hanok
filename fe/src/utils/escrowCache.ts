import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { ApiResponse, EscrowDetailResponse, EscrowItem, EscrowState, Notification, NotificationPage } from '@/types';

const normalizeEscrowId = (escrowId: string | number) => String(escrowId);

const patchEscrowItems = (
  items: EscrowItem[],
  escrowId: string | number,
  patch: Partial<EscrowItem>,
) => {
  const targetEscrowId = normalizeEscrowId(escrowId);
  let changed = false;

  const nextItems = items.map((item) => {
    if (normalizeEscrowId(item.escrowId ?? '') !== targetEscrowId) {
      return item;
    }

    changed = true;
    return { ...item, ...patch };
  });

  return changed ? nextItems : items;
};

const patchEscrowListResponse = (
  response: ApiResponse<EscrowItem[]> | undefined,
  escrowId: string | number,
  patch: Partial<EscrowItem>,
) => {
  if (!response) {
    return response;
  }

  const nextItems = patchEscrowItems(response.data, escrowId, patch);

  if (nextItems === response.data) {
    return response;
  }

  return {
    ...response,
    data: nextItems,
  };
};

export const patchEscrowStatusCaches = (
  queryClient: QueryClient,
  escrowId: string | number,
  escrowStatus: EscrowState,
) => {
  const patch = { escrowStatus };

  queryClient.setQueryData<ApiResponse<EscrowItem[]> | undefined>(['escrowsBuyer'], (prev) =>
    patchEscrowListResponse(prev, escrowId, patch),
  );
  queryClient.setQueryData<ApiResponse<EscrowItem[]> | undefined>(['escrowsSeller'], (prev) =>
    patchEscrowListResponse(prev, escrowId, patch),
  );
};

export const patchEscrowTrackingCaches = (
  queryClient: QueryClient,
  escrowId: string | number,
  delivery: NonNullable<EscrowDetailResponse['delivery']>,
) => {
  patchEscrowStatusCaches(queryClient, escrowId, 'SHIPPED');
  queryClient.setQueryData<ApiResponse<EscrowDetailResponse> | undefined>(['escrowDetail', escrowId], (prev) => {
    if (!prev) {
      return prev;
    }

    return {
      ...prev,
      data: {
        ...prev.data,
        delivery,
      },
    };
  });
};

export const getEscrowStatusFromNotification = (notification: Notification): EscrowState | null => {
  const { type } = notification;

  if (type.startsWith('ESCROW_STARTED_')) {
    return 'DEPOSITED';
  }

  if (type.startsWith('ESCROW_SHIPPED_')) {
    return 'SHIPPED';
  }

  if (type.startsWith('ESCROW_COMPLETED_') || type.startsWith('ESCROW_AUTO_COMPLETED_')) {
    return 'COMPLETED';
  }

  if (type.startsWith('ESCROW_CANCELLED_')) {
    return 'CANCELLED';
  }

  return null;
};

export const applyEscrowNotificationPatch = (queryClient: QueryClient, notification: Notification) => {
  const escrowId = notification.routingField?.escrowId;

  if (escrowId == null) {
    return;
  }

  const nextStatus = getEscrowStatusFromNotification(notification);

  if (nextStatus) {
    patchEscrowStatusCaches(queryClient, escrowId, nextStatus);
  }

  queryClient.invalidateQueries({ queryKey: ['escrowDetail', escrowId] });

  if (nextStatus === 'COMPLETED') {
    queryClient.invalidateQueries({ queryKey: ['nftReceipt', escrowId] });
  }
};

export const prependIncomingNotification = (
  previous: InfiniteData<NotificationPage, string | undefined> | undefined,
  notification: Notification,
) => {
  if (!previous) {
    return {
      pageParams: [undefined],
      pages: [
        {
          items: [notification],
          unreadCount: notification.isRead ? 0 : 1,
          hasNext: false,
          nextCursor: null,
        },
      ],
    } satisfies InfiniteData<NotificationPage, string | undefined>;
  }

  const exists = previous.pages.some((page) => page.items.some((item) => item.id === notification.id));

  if (exists) {
    return previous;
  }

  const [firstPage, ...restPages] = previous.pages;

  if (!firstPage) {
    return previous;
  }

  return {
    ...previous,
    pages: [
      {
        ...firstPage,
        items: [notification, ...firstPage.items],
        unreadCount: firstPage.unreadCount + (notification.isRead ? 0 : 1),
      },
      ...restPages,
    ],
  };
};
