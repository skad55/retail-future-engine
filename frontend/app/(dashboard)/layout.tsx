"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { getToken } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [router, token]);

  if (!token) {
    return null;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
