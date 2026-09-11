"use client";

import { useState } from "react";
import Link from "next/link";
import api, { decodeJwtPayload, setAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@palmfitness.com");
  const [password, setPassword] = useState("admin123");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

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

      router.push(role === "ADMIN" ? "/admin" : "/dashboard");
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
          <p>ออกกำลังกายต่อเนื่องกับระบบที่ติดตามความก้าวหน้าและการใช้งานจริง</p>
        </div>

        <div className="login-panel">
          <div className="login-header">
            <span>เข้าสู่ระบบ</span>
            <Link href="/" className="text-link">กลับหน้าหลัก</Link>
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