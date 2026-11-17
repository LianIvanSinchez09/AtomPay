import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import NavItem from "../NavItem/NavItem";
import { useNotifications } from "../../hooks/useNotifications";
import type { NotificationItem } from "../../types/notification";

const PATH = "/dashboard/notifications";

const NotificationsButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [items, setItems] = useState<NotificationItem[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useNotifications(setItems, setLoading, setError);

  const unreadCount = items.filter((item) => !item.read).length;
  const badge = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <div className="relative">
      <NavItem
        label="Notificaciones"
        icon={Bell}
        flexCol={false}
        active={location.pathname === PATH}
        onClick={() => navigate(PATH)}
        layoutId="active-nav-pill"
      />

      {unreadCount > 0 && (
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