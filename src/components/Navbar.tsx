"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuthToken } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    clearAuthToken();
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand">FitFlow</div>

        <div className="nav-links">
          <Link className="nav-link" href="/dashboard">Dashboard</Link>
          <Link className="nav-link" href="/subscriptions">Subscriptions</Link>
          <Link className="nav-link" href="/sessions">Sessions</Link>
          <Link className="nav-link" href="/sessions/book">Book Session</Link>
          <Link className="nav-link" href="/payments">Payments</Link>
          <button className="nav-btn" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}