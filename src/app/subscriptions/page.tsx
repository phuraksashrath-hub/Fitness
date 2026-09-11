"use client";

import { useEffect, useState } from "react";
import api, { getCurrentUserFromToken, setAuthToken } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

const planCatalog = [
  { id: "11111111-1111-1111-1111-111111111111", label: "Basic", price: 1550 },
  { id: "22222222-2222-2222-2222-222222222222", label: "Standard", price: 2490 },
  { id: "33333333-3333-3333-3333-333333333333", label: "Premium", price: 3990 },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [memberId, setMemberId] = useState("");
  const [planId, setPlanId] = useState(planCatalog[0].id);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getCurrentUserFromToken();
    if (!user?.memberId) {
      router.push("/login");
      return;
    }
    setMemberId(user.memberId);
    setAuthToken(localStorage.getItem("token") || "");
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const token = localStorage.getItem("token");
      if (token) setAuthToken(token);

      const res = await api.post("/subscriptions", { memberId, planId });
      setMsg(`สมัครสมาชิกสำเร็จ: ${res.data.planName || "Membership"} • ${res.data.id}`);
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="detail-page-shell">
        <div className="detail-page-card detail-form-card">
          <div className="detail-page-topbar">
            <button className="detail-back-link" type="button" onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer" }}>
              ← กลับหน้าแรก
            </button>
            <span className="detail-badge">สมัครแพ็กเกจ</span>
          </div>

          <div className="detail-hero compact">
            <div>
              <p className="eyebrow">Membership</p>
              <h1>เลือกแผนที่เหมาะกับไลฟ์สไตล์ของคุณ</h1>
            </div>
            <div className="mini-stat">
              <span>สมาชิก</span>
              <strong>{memberId ? "พร้อม" : "..."}</strong>
              <small>ยืนยันตัวตนแล้ว</small>
            </div>
          </div>

          <form onSubmit={submit} className="membership-form-layout">
            <div className="membership-column form-column">
              <h3>แผนสมาชิก</h3>

              <div className="field-grid">
                <label>
                  <span>Member ID</span>
                  <input value={memberId} onChange={(e) => setMemberId(e.target.value)} placeholder="กรอก member id" />
                </label>
              </div>

              <div className="field-grid">
                <label>
                  <span>เลือกแผน</span>
                  <select value={planId} onChange={(e) => setPlanId(e.target.value)}>
                    {planCatalog.map((plan) => (
                      <option key={plan.id} value={plan.id}>{plan.label} • {plan.price.toLocaleString()} บาท</option>
                    ))}
                  </select>
                </label>
              </div>

              {msg && <p className={msg.includes("สำเร็จ") ? "auth-success" : "auth-error"}>{msg}</p>}
            </div>

            <div className="membership-column summary-column">
              <h3>สรุปแผน</h3>
              <div className="summary-list">
                <div className="summary-row">
                  <span>แผน</span>
                  <strong>{planCatalog.find((p) => p.id === planId)?.label || "Basic"}</strong>
                </div>
                <div className="summary-row">
                  <span>ราคา</span>
                  <strong>{planCatalog.find((p) => p.id === planId)?.price.toLocaleString() || "1,550"} บาท</strong>
                </div>
              </div>

              <button className="membership-submit" type="submit" disabled={loading}>
                {loading ? "กำลังสมัคร..." : "ยืนยันสมัครสมาชิก"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}