import { Suspense } from "react";
import { SettingsContent } from "@/components/dashboard/settings-content";
import { SettingsSkeleton } from "@/components/dashboard/settings-skeleton";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your company profile, phone number, and AI gatekeeper
          configuration.
        </p>
      </div>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}
