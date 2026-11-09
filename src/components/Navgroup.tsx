import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import NavItem from "./NavItem/NavItem";

import type { NavGroupProps } from "../types/types";

export default function NavGroup({
  itemsCenter,
  items,
  layoutId,
  fill = true,
  gap = "gap-10",
}: NavGroupProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const height = fill ? "h-full" : "";

  return (
    <div className={`flex ${height} flex-col gap-2`}>
      {itemsCenter ? (
        <div
          className={`flex ${height} flex-col items-center justify-center ${gap} text-sm`}
        >
          {items.map((item) => (
            <NavItem
              key={item.label}
              itemsCenter={itemsCenter}
              flexCol={true}
              label={item.label}
              icon={item.icon}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              layoutId={layoutId}
            />
          ))}
        </div>
      ) : (
        <div className={`flex ${height} flex-col ${gap} text-sm`}>
          {items.map((item) => (
            <NavItem
              key={item.label}
              itemsCenter={itemsCenter}
              flexCol={false}
              label={item.label}
              icon={item.icon}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              layoutId={layoutId}
            />
          ))}
        </div>
      )}
    </div>
  );
}