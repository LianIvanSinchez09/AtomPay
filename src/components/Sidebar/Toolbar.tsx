import {
  BarChart3,
  Receipt,
  Settings2,
  Sparkles,
  Settings,
  LogOut,
  Building2,
  Upload,
  Settings2Icon,
  UserCircle,
  SlidersHorizontal,
} from "lucide-react";
import Sidepanel from "../Sidepanel/Sidepanel";
import NavGroup from "../Navgroup";
import NavDropdown, { type NavDropdownChild } from "../NavDropdown.tsx";
import { useAuth } from "../../context/AuthContext";
import { usePreferences } from "../../context/PreferencesContext";
import type { serviceItems, ToolBarProps } from "../../types/types";
import NotificationsButton from "../Notifications/NotificationsButton.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import NavItem from "../NavItem/NavItem";

const ADMIN_BASE = "/dashboard/admin-servicios";

export default function ToolBar({ collapsed }: ToolBarProps) {
  const { user, logout } = useAuth();
  const { t } = usePreferences();
  const location = useLocation();
  const navigate = useNavigate();
  const SETTINGS_PATH = "/dashboard/settings";

  const serviceItems: serviceItems[] = [
    { label: t("nav.analysis"), icon: BarChart3, path: "/dashboard/analysis" },
    {
      label: t("nav.simulator"),
      icon: SlidersHorizontal,
      path: "/dashboard/simulator",
    },
    { label: t("nav.billing"), icon: Receipt, path: "/dashboard/billing" },
  ];

  const adminServiceChildren: NavDropdownChild[] = [
    {
      label: t("nav.addService"),
      icon: Building2,
      path: `${ADMIN_BASE}/agregar`,
    },
    {
      label: t("nav.manageInvoices"),
      icon: Settings2,
      path: `${ADMIN_BASE}/comprobantes`,
    },
    {
      label: t("nav.uploadInvoice"),
      icon: Upload,
      path: `${ADMIN_BASE}/cargar`,
    },
  ];

  const serviceItemsSecondary: serviceItems[] = [
    { label: t("nav.atomcito"), icon: Sparkles, path: "/dashboard/atomcito" },
  ];

  return (
    <div className="flex h-screen shrink-0 self-start">
      <Sidepanel width="sm" hoverExpand={true}>
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-2">
            <NotificationsButton />
            <NavGroup
              items={serviceItemsSecondary}
              layoutId="active-nav-pill"
              gap="gap-2"
            />
          </div>

          <NavItem
            label={t("nav.settings")}
            icon={Settings}
            flexCol={false}
            active={location.pathname === SETTINGS_PATH}
            onClick={() => navigate(SETTINGS_PATH)}
            layoutId="active-nav-pill"
          />
        </div>
      </Sidepanel>

      <Sidepanel mainTitle={true} width="sm">
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-4">
            <NavGroup
              items={serviceItems}
              layoutId="active-nav-pill"
              fill={false}
              gap="gap-4"
            />

            <NavDropdown
              label={t("nav.adminServices")}
              icon={Settings2Icon}
              basePath={ADMIN_BASE}
              items={adminServiceChildren}
            />
          </div>

          {user && (
            <div className="mt-auto border-t border-[#CDE8E5] p-4 dark:border-[#616F39]">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl ?? undefined}
                    alt={user.name}
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserCircle className="h-10 w-10 shrink-0 dark:text-[#CDE8E5]" />
                )}

                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>
                    <p className="truncate text-xs opacity-70">{user.email}</p>
                  </div>
                )}

                <button
                  onClick={logout}
                  title={t("nav.logout")}
                  className="shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-100/50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Sidepanel>
    </div>
  );
}
