export interface ScanNotificationsResponse {
  skipped: boolean;
  created: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  invoiceId: string;
  serviceId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
  service: {
    id: string;
    name: string;
    category: { name: string };
  };
}

export type NotificationCard = {
  notification: NotificationItem;
  onRead: (id: string) => void;
  onDelete?: (id: string) => void;
};

export type NotificationsContextValue = {
  items: NotificationItem[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
};
