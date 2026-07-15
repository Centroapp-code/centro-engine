import { requireRole } from "@/lib/auth";
import { AppHeader } from "@/components/auth/app-header";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("ADMIN");

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader label="Admin" />
      {children}
    </div>
  );
}
