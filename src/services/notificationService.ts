import { api } from "./api";
import type { NotificationItem } from "../types/notification";

export async function getNotifications(
  options: { unread?: boolean; signal?: AbortSignal } = {}
): Promise<NotificationItem[]> {
  const { data } = await api.get<NotificationItem[]>("/notifications/list", {
    params: options.unread ? { unread: true } : undefined,
    signal: options.signal,
  });
  return data;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

/** Devuelve cuántas se marcaron. */
export async function markAllNotificationsAsRead(): Promise<number> {
  const { data } = await api.patch<{ count: number }>(
    "/notifications/read-all"
  );

  return data.count;
}

export async function deleteNotification(id: string): Promise<void> {
  await api.delete(`/notifications/${id}`);
}
