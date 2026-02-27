/**
 * Manager Onboarding Page
 * Production-level multi-step wizard for canteen setup
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ManagerOnboardingPage from "./page-wizard";

export async function generateMetadata() {
  return {
    title: "Manager Onboarding - E-Canteen",
    description: "Complete your canteen setup in a few simple steps",
  };
}

export default async function OnboardingLayout() {
  const { userId } = await auth();

  // Not logged in
  if (!userId) {
    redirect("/login");
  }

  // Return the wizard component
  return <ManagerOnboardingPage />;
}
