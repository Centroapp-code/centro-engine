import { requireAuth } from "@/lib/auth";
import { AppHeader } from "@/components/auth/app-header";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader label="Dashboard" />
      {children}
    </div>
  );
}
