import { api } from "./api";
import type { NotificationItem } from "../types/notification";
import axios from "axios";
import type { ScanNotificationsResponse } from "../types/types";


export async function getNotifications(
  options: { unread?: boolean; signal?: AbortSignal } = {},
): Promise<NotificationItem[]> {
  const { data } = await api.get<NotificationItem[]>("/notifications/list", {
    params: options.unread ? { unread: true } : undefined,
    signal: options.signal,
  });
  return data;
}

export async function updateNotifications() {
  try {
    const { data } = await api.post("/notifications/scan");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Status:", error.response?.status);
      console.error("Backend response:", error.response?.data);
    }

    throw error;
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

/** Devuelve cuántas se marcaron. */
export async function markAllNotificationsAsRead(): Promise<number> {
  const { data } = await api.patch<{ count: number }>(
    "/notifications/read-all",
  );

  return data.count;
}

export async function deleteNotification(id: string): Promise<void> {
  await api.delete(`/notifications/${id}`);
}
