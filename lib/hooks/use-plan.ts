"use client";

import { useSession } from "next-auth/react";
import type { PlanType } from "@/lib/plans";

export function usePlan() {
  const { data: session, status } = useSession();

  const plan = ((session?.user as Record<string, unknown>)?.plan as PlanType) || "FREE";
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isPro = plan === "PRO" || plan === "TEAM";
  const isTeam = plan === "TEAM";
  const isFree = plan === "FREE";

  return {
    plan,
    isLoading,
    isAuthenticated,
    isPro,
    isTeam,
    isFree,
    user: session?.user,
  };
}
