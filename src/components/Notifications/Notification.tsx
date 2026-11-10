import { Link } from "react-router-dom";
import {
  CreditCard,
  Droplets,
  FileText,
  Flame,
  Tv,
  ShoppingBag,
  Wifi,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { NotificationItem, NotificationCard } from "../../types/types";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Luz: Zap,
  Gas: Flame,
  Agua: Droplets,
  Internet: Wifi,
  Multimedia: Tv,
  Compras: ShoppingBag,
  Pagos: CreditCard,
};

/**
 * ⚠️ Ajustá esto a las rutas reales de tu app: es el único lugar donde se
 * decide a qué sección lleva el link ("Luz" -> "/dashboard/luz").
 */
const SECTIONS_BASE = "/dashboard";

function categoryPath(category: string): string {
  const slug = category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return `${SECTIONS_BASE}/${slug}`;
}

function timeAgo(iso: string): string {
  const date = new Date(iso);
  const diffSeconds = (date.getTime() - Date.now()) / 1000;

  // Pasado el mes, la fecha completa se entiende mejor que "hace 40 días".
  if (Math.abs(diffSeconds) > 30 * 86400) {
    return date.toLocaleDateString("es-AR");
  }

  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(Math.round(diffSeconds / seconds), unit);
    }
  }

  return "ahora";
}



export default function NotificationCard({
  notification,
  onRead,
  onDelete,
}: Props) {
  const { id, title, message, read, createdAt, service } = notification;
  const category = service.category.name;
  const Icon = CATEGORY_ICONS[category] ?? FileText;

  return (
    <li
      className={`flex gap-3 rounded-xl border p-3 transition-colors ${
        read
          ? "border-transparent opacity-70"
          : "border-[#CDE8E5] bg-[#CDE8E5]/30 dark:border-[#616F39] dark:bg-[#616F39]/20"
      }`}
    >
      <Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold">{title}</p>

          <div className="flex shrink-0 items-center gap-2">
            {!read && (
              <span
                role="img"
                aria-label="No leída"
                className="h-2 w-2 rounded-full bg-[#616F39]"
              />
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(id)}
                aria-label="Eliminar notificación"
                className="rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm">{message}</p>

        <div className="mt-1 flex items-center gap-3 text-xs">
          <span className="opacity-70">{timeAgo(createdAt)}</span>

          <Link
            to={categoryPath(category)}
            // Entrar a la sección cuenta como "visto".
            onClick={() => {
              if (!read) onRead(id);
            }}
            className="font-semibold underline-offset-2 hover:underline"
          >
            Ver en {category}
          </Link>
        </div>
      </div>
    </li>
  );
}