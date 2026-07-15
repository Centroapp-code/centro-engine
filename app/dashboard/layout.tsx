import { requireAuth } from "@/lib/auth";
import { AppHeader } from "@/components/auth/app-header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader label="Dashboard" />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
