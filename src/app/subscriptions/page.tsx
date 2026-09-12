"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  createMemberSubscription,
  getCurrentUserFromToken,
  getMemberSubscriptions,
  getPublicPlans,
  MembershipPlan,
  setAuthToken,
  SubscriptionSummary,
} from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const router = useRouter();
  const [memberId, setMemberId] = useState("");
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionSummary[]>([]);
  const [planId, setPlanId] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const requestedPlanId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("planId") : null;

  useEffect(() => {
    const user = getCurrentUserFromToken();
    const token = localStorage.getItem("token");

    if (!user?.memberId) {
      router.push("/login");
      return;
    }

    setMemberId(user.memberId);
    setAuthToken(token);

    Promise.all([getPublicPlans(), getMemberSubscriptions(user.memberId)])
      .then(([plansRes, subscriptionRes]) => {
        const planData = plansRes.data || [];
        const currentPlanId = requestedPlanId || planData[0]?.id || "";
        setPlans(planData);
        setPlanId(currentPlanId);
        setSubscriptions(subscriptionRes.data || []);
      })
      .catch(() => setMsg("ไม่สามารถโหลดข้อมูลแพ็กเกจได้"))
      .finally(() => setLoading(false));
  }, [requestedPlanId, router]);

  const selectedPlan = useMemo(() => plans.find((item) => item.id === planId) || plans[0], [planId, plans]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !planId) return;

    setSubmitting(true);
    setMsg("");

    try {
      const res = await createMemberSubscription({ memberId, planId });
      setMsg("เปิดใช้งานแพ็กเกจสำเร็จ กำลังพาไปหน้าชำระเงิน");
      router.push(`/payments?subscriptionId=${res.data.id}`);
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "สมัครแพ็กเกจไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute roles={["MEMBER"]}>
      <main className="detail-page-shell">
        <div className="detail-page-card detail-form-card">
          <div className="detail-page-topbar">
            <button className="detail-back-link" type="button" onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer" }}>
              ← กลับแดชบอร์ด
            </button>
            <span className="detail-badge">เลือกแพ็กเกจ</span>
          </div>

          <div className="detail-hero compact">
            <div>
              <p className="eyebrow">Subscription</p>
              <h1>ยืนยันแพ็กเกจเพื่อเริ่มต้นเส้นทางการฝึกของคุณ</h1>
            </div>
            <div className="mini-stat">
              <span>สถานะ</span>
              <strong>{subscriptions.some((item) => item.status === "ACTIVE") ? "ACTIVE" : "NEW"}</strong>
              <small>พร้อมเปิดสิทธิ์ทันที</small>
            </div>
          </div>

          {loading ? (
            <p style={{ padding: 24 }}>กำลังโหลดแพ็กเกจ...</p>
          ) : (
            <>
              <div className="plan-select-grid">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    className={`plan-option ${planId === plan.id ? "active" : ""}`}
                    onClick={() => setPlanId(plan.id)}
                  >
                    <strong>{plan.planName}</strong>
                    <span>{Number(plan.price).toLocaleString()} บาท / {plan.durationDays} วัน</span>
                    <small>{plan.maxSessionsPerMonth} session ต่อรอบบิล</small>
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="membership-form-layout">
                <div className="membership-column form-column">
                  <h3>ข้อมูลสมาชิก</h3>

                  <div className="field-grid">
                    <label>
                      <span>Member ID</span>
                      <input value={memberId} readOnly />
                    </label>
                  </div>

                  <div className="field-grid">
                    <label>
                      <span>แพ็กเกจที่เลือก</span>
                      <input value={selectedPlan?.planName || "-"} readOnly />
                    </label>
                  </div>

                  {msg && <p className={msg.includes("สำเร็จ") ? "auth-success" : "auth-error"}>{msg}</p>}
                </div>

                <div className="membership-column summary-column">
                  <h3>สรุปแพ็กเกจ</h3>
                  <div className="summary-list">
                    <div className="summary-row">
                      <span>ชื่อแพ็กเกจ</span>
                      <strong>{selectedPlan?.planName || "-"}</strong>
                    </div>
                    <div className="summary-row">
                      <span>ราคา</span>
                      <strong>{selectedPlan ? Number(selectedPlan.price).toLocaleString() : "0"} บาท</strong>
                    </div>
                    <div className="summary-row">
                      <span>ระยะเวลา</span>
                      <strong>{selectedPlan?.durationDays || 0} วัน</strong>
                    </div>
                    <div className="summary-row total">
                      <span>สิทธิ์ session</span>
                      <strong>{selectedPlan?.maxSessionsPerMonth || 0} ครั้ง</strong>
                    </div>
                  </div>

                  <button className="membership-submit" type="submit" disabled={submitting || !selectedPlan}>
                    {submitting ? "กำลังเปิดใช้งาน..." : "ยืนยันแพ็กเกจและไปชำระเงิน"}
                  </button>
                </div>
              </form>

              <section className="history-panel">
                <div className="history-panel-header">
                  <h3>แพ็กเกจที่เคยใช้งาน</h3>
                  <span>{subscriptions.length} รายการ</span>
                </div>
                <div className="history-list">
                  {subscriptions.length > 0 ? subscriptions.map((subscription) => (
                    <article key={subscription.id} className="history-item">
                      <div>
                        <strong>{subscription.planName}</strong>
                        <p>{subscription.startDate} - {subscription.endDate}</p>
                      </div>
                      <div>
                        <span className={`status-chip ${subscription.status.toLowerCase()}`}>{subscription.status}</span>
                        <small>{subscription.remainingSessions} sessions left</small>
                      </div>
                    </article>
                  )) : <p>ยังไม่มีประวัติแพ็กเกจ</p>}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
