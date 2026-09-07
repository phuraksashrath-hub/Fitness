"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/api";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthToken(token);
    setReady(true);
  }, [router]);

  if (!ready) return <p style={{ padding: 24 }}>Checking auth...</p>;
  return <>{children}</>;
}