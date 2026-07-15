import { LayoutDashboard, Bot, Phone, Users } from "lucide-react";
import { NavLink } from "@/components/nav-link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { href: "/dashboard/agent", label: "AI Agent", icon: <Bot className="size-4" /> },
  { href: "/dashboard/calls", label: "Calls", icon: <Phone className="size-4" /> },
  { href: "/dashboard/leads", label: "Leads", icon: <Users className="size-4" /> },
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
