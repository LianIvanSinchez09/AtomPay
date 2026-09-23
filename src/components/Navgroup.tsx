import { useLocation, useNavigate } from "react-router-dom";

import NavItem from "./NavItem/NavItem";

import type { NavGroupProps } from "../types/types";

export default function NavGroup({
  itemsCenter,
  items,
  layoutId,
}: NavGroupProps) {
  const location = useLocation();
  const navigate = useNavigate();


  
  return (
    <div className="flex h-full flex-col gap-2">
      {itemsCenter ? (
        <div
          className={`flex h-full items-center justify-center flex-col gap-10 text-sm`}
        >
          {items.map((item) => {
            const active = location.pathname === item.path;

            return (
              <NavItem
                itemsCenter={itemsCenter}
                key={item.label}
                flexCol={true}
                label={item.label}
                icon={item.icon}
                active={active}
                onClick={() => navigate(item.path)}
                layoutId={layoutId}
              />
            );
          })}
        </div>
      ) : (
        <div className={`flex flex-col gap-10 h-full text-sm`}>
          {items.map((item) => {
            const active = location.pathname === item.path;

            return (
              <NavItem
                itemsCenter={itemsCenter}
                key={item.label}
                flexCol={false}
                label={item.label}
                icon={item.icon}
                active={active}
                onClick={() => navigate(item.path)}
                layoutId={layoutId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
