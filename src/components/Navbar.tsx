"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuthToken } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    clearAuthToken();
    router.push("/login");
  };

  return (
    <div style={{ display: "flex", gap: 12, padding: 16, borderBottom: "1px solid #ddd", flexWrap: "wrap" }}>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/subscriptions">Subscriptions</Link>
      <Link href="/sessions">Sessions</Link>
      <Link href="/sessions/book">Book Session</Link>
      <Link href="/payments">Payments</Link>
      <button onClick={logout}>Logout</button>
    </div>
  );
}