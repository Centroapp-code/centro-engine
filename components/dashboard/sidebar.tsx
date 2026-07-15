import { LayoutDashboard, Phone, Target, BarChart3, Settings } from "lucide-react";
import { NavLink } from "@/components/nav-link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { href: "/dashboard/calls", label: "Calls", icon: <Phone className="size-4" /> },
  { href: "/dashboard/opportunities", label: "Opportunities", icon: <Target className="size-4" /> },
  { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart3 className="size-4" /> },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings className="size-4" /> },
];

export function DashboardSidebar() {
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
