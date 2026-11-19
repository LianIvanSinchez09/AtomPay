import { useCallback, useEffect, useMemo, useState } from "react";
import NotificationCard from "./Notification";
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";
import { errorMessage } from "../../services/apiError";
import type { NotificationItem } from "../types/notification";
import { useNotifications } from "../../hooks/useNotifications";

export default function NotificationsLoader() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlyUnread, setOnlyUnread] = useState(false);
  
  const [items, setItems] = useState<NotificationItem[]>([]);

  useNotifications(setItems, setLoading, setError, error)
  
  const unreadCount = useMemo(
    () => items.filter((item) => !item.read).length,
    [items]
  );

  const visible = useMemo(
    () => (onlyUnread ? items.filter((item) => !item.read) : items),
    [items, onlyUnread]
  );

  const handleRead = useCallback(async (id: string) => {
    setItems((current) => {
      current.map((item) => (item.id === id ? { ...item, read: true } : item))
      console.log(current);
    }
    
    );

    try {
      await markNotificationAsRead(id);
    } catch (err) {
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, read: false } : item
        )
      );
      setError(errorMessage(err));
    }
  }, []);

  const handleReadAll = useCallback(async () => {

  }, [items]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteNotification(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  if (loading) {
    return <p className="p-4 text-sm opacity-70">Cargando notificaciones…</p>;
  }

  

  return (
    <section aria-label="Notificaciones" className="space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">
          Notificaciones
          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-[#616F39] px-2 py-0.5 text-xs font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </h2>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setOnlyUnread((value) => !value)}
            aria-pressed={onlyUnread}
            className="underline-offset-2 hover:underline"
          >
            {onlyUnread ? "Ver todas" : "Solo no leídas"}
          </button>
        </div>
      </header>

      {error && (
        <p role="alert" className="rounded-lg bg-red-100 p-2 text-sm text-red-800">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="p-4 text-center text-sm opacity-70">
          {onlyUnread ? "No tenés notificaciones sin leer." : "Todavía no tenés notificaciones."}
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onRead={handleRead}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
