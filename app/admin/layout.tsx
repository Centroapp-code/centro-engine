import { requireRole } from "@/lib/auth";
import { AppHeader } from "@/components/auth/app-header";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("ADMIN");

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader label="Admin" />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
