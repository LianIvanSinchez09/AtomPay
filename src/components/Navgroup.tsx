import NavItem from "./NavItem";
import { NavGroupProps } from "../types/types";

export default function NavGroup({
  items,
  activeLabel,
  onSelect,
  layoutId,
}: NavGroupProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col gap-10">
        {items.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            active={activeLabel === item.label}
            onClick={() => onSelect(item.label)}
            layoutId={layoutId}
          />
        ))}
      </div>
    </div>
  );
}