"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getCurrentUserFromToken,
  getMemberPayments,
  getMemberSessions,
  getMemberSubscriptions,
  PaymentSummary,
  SessionSummary,
  setAuthToken,
  SubscriptionSummary,
} from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState<{ fullName: string; email: string; role: string; memberId: string } | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionSummary[]>([]);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [payments, setPayments] = useState<PaymentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUserFromToken();
    const token = localStorage.getItem("token");
    setUser(currentUser);

    if (!currentUser?.memberId) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    Promise.all([
      getMemberSubscriptions(currentUser.memberId),
      getMemberSessions(currentUser.memberId),
      getMemberPayments(currentUser.memberId),
    ])
      .then(([subscriptionRes, sessionRes, paymentRes]) => {
        setSubscriptions(subscriptionRes.data || []);
        setSessions(sessionRes.data || []);
        setPayments(paymentRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeSubscription = useMemo(
    () => subscriptions.find((item) => item.status === "ACTIVE") || subscriptions[0],
    [subscriptions]
  );
  const upcoming = useMemo(() => sessions.filter((s) => s.status === "BOOKED").length, [sessions]);
  const totalSpend = useMemo(() => payments.reduce((sum, payment) => sum + Number(payment.finalAmount || 0), 0), [payments]);
  const trainingHours = useMemo(
    () => Math.round(sessions.reduce((sum, s) => {
      const start = new Date(`2024-01-01T${s.startTime}`).getTime();
      const end = new Date(`2024-01-01T${s.endTime}`).getTime();
      return sum + Math.max(0, (end - start) / 3600000);
    }, 0) * 10) / 10,
    [sessions]
  );

  return (
    <ProtectedRoute roles={["MEMBER"]}>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-row">
            <div>
              <p className="eyebrow">Member dashboard</p>
              <h1 className="page-title">สวัสดี {user?.fullName || "สมาชิก"}</h1>
            </div>
            <div className="table-actions">
              <Link className="form-btn secondary" href="/subscriptions">Manage plan</Link>
              <Link className="form-btn" href="/sessions/book">Book now</Link>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-empty-state">กำลังโหลดข้อมูล...</div>
          ) : (
            <>
              <div className="metrics-grid">
                <div className="metric-card accent">
                  <span>Active plan</span>
                  <strong>{activeSubscription?.planName || "None"}</strong>
                  <small>{activeSubscription?.remainingSessions ?? 0} sessions left</small>
                </div>
                <div className="metric-card">
                  <span>Upcoming</span>
                  <strong>{upcoming}</strong>
                  <small>booked sessions</small>
                </div>
                <div className="metric-card">
                  <span>Total hours</span>
                  <strong>{trainingHours}</strong>
                  <small>hours trained</small>
                </div>
                <div className="metric-card">
                  <span>Total spend</span>
                  <strong>฿{totalSpend.toLocaleString()}</strong>
                  <small>payment history</small>
                </div>
              </div>

              <div className="journey-grid">
                <section className="table-card">
                  <div className="table-header">
                    <h2>Current membership</h2>
                    <span>{activeSubscription?.status || "NO PLAN"}</span>
                  </div>
                  {activeSubscription ? (
                    <div className="summary-card dashboard-summary-card">
                      <div className="summary-row"><span>Plan</span><strong>{activeSubscription.planName}</strong></div>
                      <div className="summary-row"><span>Period</span><strong>{activeSubscription.startDate} - {activeSubscription.endDate}</strong></div>
                      <div className="summary-row"><span>Sessions remaining</span><strong>{activeSubscription.remainingSessions}</strong></div>
                      <div className="summary-row total"><span>Price</span><strong>฿{Number(activeSubscription.price).toLocaleString()}</strong></div>
                    </div>
                  ) : (
                    <p>ยังไม่มีแพ็กเกจที่ใช้งานอยู่</p>
                  )}
                </section>

                <section className="table-card">
                  <div className="table-header">
                    <h2>Recent bookings</h2>
                    <Link href="/sessions">ดูทั้งหมด</Link>
                  </div>
                  <div className="history-list">
                    {sessions.slice(0, 4).map((session) => (
                      <article key={session.id} className="history-item">
                        <div>
                          <strong>{session.trainerName}</strong>
                          <p>{session.sessionDate} • {session.startTime.slice(0, 5)} - {session.endTime.slice(0, 5)}</p>
                        </div>
                        <span className={`status-chip ${session.status.toLowerCase()}`}>{session.status}</span>
                      </article>
                    ))}
                    {sessions.length === 0 && <p>ยังไม่มี session ล่าสุด</p>}
                  </div>
                </section>
              </div>

              <section className="table-card">
                <div className="table-header">
                  <h2>Payment history</h2>
                  <Link href="/payments">จัดการชำระเงิน</Link>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Amount</th>
                      <th>Discount</th>
                      <th>Final</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length > 0 ? payments.slice(0, 5).map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.method}</td>
                        <td>{Number(payment.amount).toLocaleString()}</td>
                        <td>{Number(payment.discountAmount).toLocaleString()}</td>
                        <td>{Number(payment.finalAmount).toLocaleString()}</td>
                        <td><span className="status-pill confirmed">{payment.status}</span></td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5}>ยังไม่มีประวัติการชำระเงิน</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
