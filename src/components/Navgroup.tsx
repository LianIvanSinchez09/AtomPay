import { useLocation, useNavigate } from "react-router-dom";

import NavItem from "./NavItem/NavItem";

import type { NavGroupProps } from "../types/types";

export default function NavGroup({
  items,
  layoutId,
  collapsed,
}: NavGroupProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-10">
        {items.map((item) => {
          const active = location.pathname === item.path;

          return (
            <NavItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              active={active}
              onClick={() => navigate(item.path)}
              layoutId={layoutId}
              collapsed={collapsed}
            />
          );
        })}
      </div>
    </div>
  );
}