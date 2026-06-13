"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth.store";
import DashboardPage from "@/components/Dashboard/DashboardPage";

export default function UserDashboard() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/auth"); return; }
    if (user && user.role !== "user") {
      if (user.role === "superadmin") router.replace("/superadmin/dashboard");
      else router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || (user && user.role !== "user")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-(--secondary) border-t-transparent animate-spin" />
      </div>
    );
  }

  return <DashboardPage />;
}
