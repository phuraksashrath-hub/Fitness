"use client";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

const sessions = [
  { day: "Mon", time: "06:30", coach: "Coach Natt", type: "Strength" },
  { day: "Tue", time: "18:00", coach: "Coach Palm", type: "HIIT" },
  { day: "Wed", time: "09:00", coach: "Coach Aom", type: "Yoga" },
  { day: "Thu", time: "17:30", coach: "Coach Alex", type: "Boxing" },
  { day: "Fri", time: "07:00", coach: "Coach Mint", type: "Cycle" },
  { day: "Sat", time: "10:00", coach: "Coach Jet", type: "Functional" },
];

export default function SessionsPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-row">
            <div>
              <p className="eyebrow">Training schedule</p>
              <h1 className="page-title">Sessions</h1>
            </div>
            <button className="form-btn secondary">+ Book a session</button>
          </div>

          <div className="metrics-grid">
            <div className="metric-card accent">
              <span>Booked today</span>
              <strong>18</strong>
            </div>
            <div className="metric-card">
              <span>Available slots</span>
              <strong>42</strong>
            </div>
            <div className="metric-card">
              <span>Trainer online</span>
              <strong>06</strong>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h2>Weekly schedule</h2>
              <span>Next 7 days</span>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Coach</th>
                  <th>Class</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={`${session.day}-${session.time}`}>
                    <td>{session.day}</td>
                    <td>{session.time}</td>
                    <td>{session.coach}</td>
                    <td>{session.type}</td>
                    <td><span className="status-pill confirmed">Confirmed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}