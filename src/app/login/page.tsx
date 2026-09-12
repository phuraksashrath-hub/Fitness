"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import api, { decodeJwtPayload, setAuthToken } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@palmfitness.com");
  const [password, setPassword] = useState("admin123");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedPlanId = searchParams.get("planId");

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.accessToken;
      localStorage.setItem("token", token);
      setAuthToken(token);

      const payload = decodeJwtPayload(token);
      const role = payload?.role || payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "MEMBER";

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "TRAINER") {
        router.push("/trainer");
      } else if (selectedPlanId) {
        router.push(`/subscriptions?planId=${selectedPlanId}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <div className="login-card">
        <div className="login-visual">
          <div className="login-badge">PALM FITNESS</div>
          <h1>Welcome back</h1>
          <p>ล็อกอินเพื่อซื้อแพ็กเกจ จองเทรนเนอร์ เปิดหน้าควบคุม หรือดู trainer dashboard</p>
        </div>

        <div className="login-panel">
          <div className="login-header">
            <span>เข้าสู่ระบบ</span>
            <Link href="/" className="text-link">กลับหน้าหลัก</Link>
          </div>

          {selectedPlanId && (
            <p className="auth-success" style={{ marginBottom: 16 }}>
              สมัครสมาชิกแล้ว เหลือเพียงล็อกอินเพื่อยืนยันแพ็กเกจและชำระเงิน
            </p>
          )}

          <div className="quick-credential-bar">
            <button type="button" className="quick-credential-btn" onClick={() => { setEmail("admin@palmfitness.com"); setPassword("admin123"); }}>
              Admin demo
            </button>
            <button type="button" className="quick-credential-btn" onClick={() => { setEmail("member@palmfitness.com"); setPassword("member123"); }}>
              Member demo
            </button>
            <button type="button" className="quick-credential-btn" onClick={() => { setEmail("coach.palm@palmfitness.com"); setPassword("trainer123"); }}>
              Trainer demo
            </button>
          </div>

          <form onSubmit={onLogin} className="login-form">
            <label>
              <span>อีเมล</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@palmfitness.com" />
            </label>

            <label>
              <span>รหัสผ่าน</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </label>

            <button type="submit" className="membership-submit" disabled={loading}>
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>

            {msg && <p className="auth-error login-error-box">{msg}</p>}
          </form>

          <div className="login-footer">
            <span>ยังไม่มีสมาชิก?</span>
            <Link href="/membership" className="text-link">สมัครสมาชิก</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>กำลังโหลด...</div>}>
      <LoginContent />
    </Suspense>
  );
}
