import { Building2 } from "lucide-react";
import { NavLink } from "@/components/nav-link";

const NAV_ITEMS = [
  { href: "/admin", label: "Companies", icon: <Building2 className="size-4" /> },
];

export function AdminSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border/60 p-4 md:block">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} href={item.href} icon={item.icon}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
