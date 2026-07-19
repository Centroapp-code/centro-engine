import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { resolveOnboardingCompleted } from "@/lib/db/onboarding-status";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { OnboardingRedirect } from "@/components/onboarding/onboarding-redirect";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const company = user.companyMemberships[0].company;

  const completed = await resolveOnboardingCompleted({
    clerkId: user.clerkId,
    userId: user.id,
    onboardingCompleted: user.onboardingCompleted,
    email: user.email,
    company,
  });

  if (completed) {
    return <OnboardingRedirect to="/dashboard" />;
  }

  return <OnboardingWizard initialCompanyName={company.name} />;
}
