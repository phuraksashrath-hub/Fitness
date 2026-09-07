"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "24px auto" }}>
        <h1>Member Dashboard</h1>
        <p>Welcome to Fitness Center Management System</p>
      </div>
    </ProtectedRoute>
  );
}