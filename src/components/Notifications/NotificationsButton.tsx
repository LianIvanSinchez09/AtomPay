import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import NavItem from "../NavItem/NavItem";
import { useNotifications } from "../../hooks/useNotifications";
import type { NotificationItem } from "../../types/notification";
import {
  updateNotifications,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

const PATH = "/dashboard/notifications";

const SCAN_INTERVAL_MS = 35 * 60 * 1000;
const CHECK_EVERY_MS = 30 * 1000;

const NotificationsButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [items, setItems] = useState<NotificationItem[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const lastScan = useRef<Date>(new Date());
  const scanning = useRef(false);

  const refetchNotifications = useNotifications(setItems, setLoading, setError);

  const unreadCount = items.filter((item) => !item.read).length;
  const badge = unreadCount > 99 ? "99+" : unreadCount;

  const handleCount = async () => {
    const previous = items;

    setItems((current) => current.map((item) => ({ ...item, read: true })));

    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      setItems(previous);
      console.error("Error al marcar notificaciones:", error);
    }

    navigate(PATH);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!localStorage.getItem("token")) return;
      if (document.visibilityState !== "visible") return;
      if (scanning.current) return;
      if (lastScan.current.getTime() < SCAN_INTERVAL_MS) return;
      if (!JSON.parse(localStorage.getItem("user")).googleId) return;
      console.log("Running scan");
      
      scanning.current = true;
      try {
        const data = await updateNotifications();
        console.log("scan result:", data);
        await refetchNotifications();
        lastScan.current = new Date();
      } catch (error) {
        console.error("Error running notification scan:", error);
      } finally {
        scanning.current = false;
      }
    }, CHECK_EVERY_MS);

    return () => clearInterval(interval);
  }, [refetchNotifications]);

  return (
    <div className="flex gap-3">
      <NavItem
        label="Notificaciones"
        icon={Bell}
        flexCol={false}
        active={location.pathname === PATH}
        onClick={handleCount}
        layoutId="active-nav-pill"
        gap={2}
      >
      {/* {unreadCount > 0 && ( */}
      <span
        aria-label={`${unreadCount} notificaciones sin leer`}
        className="pointer-events-none flex rounded-4xl justify-center absolute min-w-4 items-center bg-[#616F39] font-bold leading-none text-white"
      >
        {badge}
      </span>
      {/* )} */}
      </NavItem>
    </div>
  );
};

export default NotificationsButton;
