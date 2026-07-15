import { currentUser } from "@/lib/auth";

export default async function AdminPage() {
  const user = await currentUser();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 p-8">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-muted-foreground">
        Signed in as {user?.primaryEmailAddress?.emailAddress ?? "unknown"}
      </p>
    </main>
  );
}
