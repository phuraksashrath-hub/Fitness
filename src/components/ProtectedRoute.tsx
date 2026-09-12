"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeJwtPayload, setAuthToken } from "@/lib/api";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = decodeJwtPayload(token);
    if (!payload || !payload.exp || Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("token");
      router.replace("/login");
      return;
    }

    const role = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "MEMBER";
    if (roles?.length && !roles.includes(role)) {
      router.replace(role === "ADMIN" ? "/admin" : "/dashboard");
      return;
    }

    setAuthToken(token);
    setReady(true);
  }, [roles, router]);

  if (!ready) return <p style={{ padding: 24 }}>Checking auth...</p>;
  return <>{children}</>;
}
