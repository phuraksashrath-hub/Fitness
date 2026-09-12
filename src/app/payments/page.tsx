"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getCurrentUserFromToken,
  getMemberPayments,
  getMemberSubscriptions,
  PaymentSummary,
  processMemberPayment,
  setAuthToken,
  SubscriptionSummary,
} from "@/lib/api";

const discounts: Record<string, number> = {
  none: 0,
  student: 0.1,
  renewal: 0.15,
};

const paymentBadgeClass = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "paid") return "confirmed";
  if (normalized === "failed") return "cancelled";
  if (normalized === "pending") return "pending";
  return "completed";
};

export default function PaymentPage() {
  const [memberId, setMemberId] = useState("");
  const [subscriptions, setSubscriptions] = useState<SubscriptionSummary[]>([]);
  const [payments, setPayments] = useState<PaymentSummary[]>([]);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [method, setMethod] = useState("CREDIT_CARD");
  const [discountType, setDiscountType] = useState("none");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const requestedSubscriptionId =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("subscriptionId") : null;

  const loadData = async (currentMemberId: string, preselectedId?: string | null) => {
    const [subscriptionRes, paymentRes] = await Promise.all([
      getMemberSubscriptions(currentMemberId),
      getMemberPayments(currentMemberId),
    ]);

    const memberSubscriptions = (subscriptionRes.data || []).filter(
      (item) => item.status === "ACTIVE" || item.id === preselectedId
    );
    const currentSubscriptionId = preselectedId || memberSubscriptions[0]?.id || "";

    setSubscriptions(memberSubscriptions);
    setPayments(paymentRes.data || []);
    setSubscriptionId(currentSubscriptionId);
  };

  useEffect(() => {
    const user = getCurrentUserFromToken();
    const token = localStorage.getItem("token");
    if (!user?.memberId) return;

    setMemberId(user.memberId);
    setAuthToken(token);
    loadData(user.memberId, requestedSubscriptionId)
      .catch(() => setMsg("ไม่สามารถโหลดข้อมูลการชำระเงินได้"))
      .finally(() => setLoading(false));
  }, [requestedSubscriptionId]);

  const selectedSubscription = useMemo(
    () => subscriptions.find((item) => item.id === subscriptionId) || subscriptions[0],
    [subscriptionId, subscriptions]
  );

  const amount = Number(selectedSubscription?.price || 0);
  const discountAmount = Math.round(amount * (discounts[discountType] || 0));
  const finalAmount = Math.max(0, amount - discountAmount);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !selectedSubscription) return;

    setSubmitting(true);
    setMsg("");

    try {
      await processMemberPayment({
        memberId,
        subscriptionId: selectedSubscription.id,
        amount,
        method,
        discountType,
      });
      setMsg("ชำระเงินสำเร็จและอัปเดตประวัติเรียบร้อยแล้ว");
      await loadData(memberId, selectedSubscription.id);
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "ชำระเงินไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute roles={["MEMBER"]}>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-row">
            <div>
              <p className="eyebrow">Payments</p>
              <h1 className="page-title">Confirm membership payment</h1>
            </div>
          </div>

          {loading ? (
            <div className="form-card">กำลังโหลดข้อมูล...</div>
          ) : (
            <div className="journey-grid">
              <div className="form-card">
                <h2>Process Payment</h2>
                <p className="auth-subtitle">ผูกการชำระเงินเข้ากับแพ็กเกจจริงและคำนวณส่วนลดก่อนสรุปยอดสุทธิ</p>
                <form onSubmit={submit} className="form-grid">
                  <select className="select" value={subscriptionId} onChange={(e) => setSubscriptionId(e.target.value)}>
                    {subscriptions.map((subscription) => (
                      <option key={subscription.id} value={subscription.id}>
                        {subscription.planName} • เหลือ {subscription.remainingSessions} sessions
                      </option>
                    ))}
                  </select>

                  <div className="two-col">
                    <select className="select" value={method} onChange={(e) => setMethod(e.target.value)}>
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="PROMPTPAY">PromptPay</option>
                    </select>

                    <select className="select" value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                      <option value="none">No discount</option>
                      <option value="student">Student discount</option>
                      <option value="renewal">Renewal discount</option>
                    </select>
                  </div>

                  <div className="summary-card summary-inline-card">
                    <div className="summary-row"><span>ยอดก่อนลด</span><strong>{amount.toLocaleString()} บาท</strong></div>
                    <div className="summary-row"><span>ส่วนลด</span><strong>{discountAmount.toLocaleString()} บาท</strong></div>
                    <div className="summary-row total"><span>ยอดสุทธิ</span><strong>{finalAmount.toLocaleString()} บาท</strong></div>
                  </div>

                  <button className="form-btn" type="submit" disabled={submitting || !selectedSubscription}>
                    {submitting ? "กำลังประมวลผล..." : "ชำระเงินและบันทึกประวัติ"}
                  </button>
                </form>
                <div className={`notice ${msg ? (msg.includes("สำเร็จ") ? "success" : "error") : ""}`}>{msg}</div>
              </div>

              <div className="table-card">
                <div className="table-header">
                  <h2>Payment history</h2>
                  <span>{payments.length} รายการ</span>
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
                    {payments.length > 0 ? payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.method}</td>
                        <td>{Number(payment.amount).toLocaleString()}</td>
                        <td>{Number(payment.discountAmount).toLocaleString()}</td>
                        <td>{Number(payment.finalAmount).toLocaleString()}</td>
                        <td><span className={`status-pill ${paymentBadgeClass(payment.status)}`}>{payment.status}</span></td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5}>ยังไม่มีประวัติการชำระเงิน</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
