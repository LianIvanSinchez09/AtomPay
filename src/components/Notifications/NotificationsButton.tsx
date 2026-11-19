import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

import NavItem from "../NavItem/NavItem";
import { useNotifications } from "../../hooks/useNotifications";
import { useAuth } from "../../context/AuthContext";

import type { NotificationItem } from "../../types/notification";

import {
  updateNotifications,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

const PATH = "/dashboard/notifications";

const NotificationsButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState<NotificationItem[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const unreadCount = items.filter((item) => !item.read).length;
  const badge = unreadCount > 99 ? "99+" : unreadCount;

  useNotifications(setItems, setLoading, setError);

  const handleCount = async () => {
    const previous = items;

    setItems((current) =>
      current.map((item) => ({ ...item, read: true }))
    );

    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      setItems(previous);
      console.error("Error al marcar notificaciones:", error);
    }

    navigate(PATH);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    const interval = setInterval(async () => {
      if (document.visibilityState !== "visible") return;

      try {
        const data = await updateNotifications();
        console.log("Scan result:", data);
      } catch (error) {
        console.error("Error running notification scan:", error);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <NavItem
        label="Notificaciones"
        icon={Bell}
        flexCol={false}
        active={location.pathname === PATH}
        onClick={handleCount}
        layoutId="active-nav-pill"
      />

      {badge > 0 && (
        <span
          aria-label={`${unreadCount} notificaciones sin leer`}
          className="pointer-events-none absolute left-5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#616F39] font-bold leading-none text-white"
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export default NotificationsButton;