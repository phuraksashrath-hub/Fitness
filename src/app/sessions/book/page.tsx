"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  bookMemberSession,
  getCurrentUserFromToken,
  getMemberSubscriptions,
  getTrainers,
  setAuthToken,
  SubscriptionSummary,
  TrainerSummary,
} from "@/lib/api";
import { useRouter } from "next/navigation";

const defaultDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export default function BookSessionPage() {
  const router = useRouter();
  const [memberId, setMemberId] = useState("");
  const [subscriptions, setSubscriptions] = useState<SubscriptionSummary[]>([]);
  const [trainers, setTrainers] = useState<TrainerSummary[]>([]);
  const [form, setForm] = useState({
    trainerId: "",
    subscriptionId: "",
    sessionDate: defaultDate,
    startTime: "09:00",
    endTime: "10:00",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = getCurrentUserFromToken();
    const token = localStorage.getItem("token");
    if (!user?.memberId) return;

    setMemberId(user.memberId);
    setAuthToken(token);

    Promise.all([getMemberSubscriptions(user.memberId), getTrainers()])
      .then(([subscriptionRes, trainerRes]) => {
        const activeSubscriptions = (subscriptionRes.data || []).filter((item) => item.status === "ACTIVE");
        const trainerList = trainerRes.data || [];

        setSubscriptions(activeSubscriptions);
        setTrainers(trainerList);
        setForm((prev) => ({
          ...prev,
          subscriptionId: activeSubscriptions[0]?.id || "",
          trainerId: trainerList[0]?.id || "",
        }));
      })
      .catch(() => setMsg("ไม่สามารถโหลดข้อมูลการจองได้"))
      .finally(() => setLoading(false));
  }, []);

  const selectedSubscription = useMemo(
    () => subscriptions.find((item) => item.id === form.subscriptionId),
    [form.subscriptionId, subscriptions]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !form.subscriptionId || !form.trainerId) return;

    setSubmitting(true);
    setMsg("");

    try {
      await bookMemberSession({
        memberId,
        trainerId: form.trainerId,
        subscriptionId: form.subscriptionId,
        sessionDate: form.sessionDate,
        startTime: form.startTime,
        endTime: form.endTime,
      });
      setMsg("จอง session สำเร็จ กำลังพาไปหน้ารายการนัด");
      setTimeout(() => router.push("/sessions"), 700);
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute roles={["MEMBER"]}>
      <Navbar />
      <main className="page-shell">
        <div className="container narrow-container">
          <div className="form-card">
            <h2>Book Trainer Session</h2>
            <p className="auth-subtitle">เลือกแพ็กเกจที่ใช้งานอยู่และจับคู่กับเทรนเนอร์จริงจากระบบ</p>
            {loading ? (
              <p>กำลังโหลดข้อมูล...</p>
            ) : (
              <form onSubmit={submit} className="form-grid">
                <input className="input" value={memberId} readOnly />

                <select className="select" value={form.subscriptionId} onChange={(e) => setForm({ ...form, subscriptionId: e.target.value })}>
                  {subscriptions.map((subscription) => (
                    <option key={subscription.id} value={subscription.id}>
                      {subscription.planName} • เหลือ {subscription.remainingSessions} sessions
                    </option>
                  ))}
                </select>

                <select className="select" value={form.trainerId} onChange={(e) => setForm({ ...form, trainerId: e.target.value })}>
                  {trainers.map((trainer) => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.fullName} • {trainer.specialty}
                    </option>
                  ))}
                </select>

                <div className="two-col">
                  <input className="input" type="date" value={form.sessionDate} onChange={(e) => setForm({ ...form, sessionDate: e.target.value })} />
                  <div className="two-col compact">
                    <input className="input" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                    <input className="input" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                  </div>
                </div>

                <div className="summary-card summary-inline-card">
                  <div className="summary-row"><span>แพ็กเกจ</span><strong>{selectedSubscription?.planName || "-"}</strong></div>
                  <div className="summary-row"><span>คงเหลือ</span><strong>{selectedSubscription?.remainingSessions ?? 0} sessions</strong></div>
                  <div className="summary-row total"><span>วันหมดอายุ</span><strong>{selectedSubscription?.endDate || "-"}</strong></div>
                </div>

                <button className="form-btn" type="submit" disabled={submitting || !selectedSubscription}>
                  {submitting ? "กำลังจอง..." : "จอง session"}
                </button>
              </form>
            )}
            <div className={`notice ${msg ? (msg.includes("สำเร็จ") ? "success" : "error") : ""}`}>{msg}</div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
