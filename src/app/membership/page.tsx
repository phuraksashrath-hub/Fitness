"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Basic",
    price: 1550,
    perk: "เข้าใช้ฟิตเนส 24 ชั่วโมง พร้อมติดตามความก้าวหน้า",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Standard",
    price: 2490,
    perk: "ยืดเหยียดรายสัปดาห์ + คำปรึกษาจากเทรนเนอร์",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Premium",
    price: 3990,
    perk: "เทรนเนอร์ส่วนตัว 2 ครั้ง/เดือน + คลาสพิเศษ",
  },
];

export default function MembershipPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    setIsSuccess(false);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      setMsg("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    if (password !== confirmPassword) {
      setMsg("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      setLoading(true);
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await api.post("/auth/register", {
        fullName,
        email,
        password,
        phone,
      });

      setIsSuccess(true);
      setMsg("สมัครสมาชิกสำเร็จ กำลังพาไปล็อกอินเพื่อยืนยันแพ็กเกจ");
      setTimeout(() => {
        router.push(`/login?planId=${selectedPlan.id}`);
      }, 900);
    } catch (error: any) {
      setIsSuccess(false);
      setMsg(error?.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="detail-page-shell">
      <div className="detail-page-card detail-form-card">
        <div className="detail-page-topbar">
          <Link href="/" className="detail-back-link">← กลับหน้าแรก</Link>
          <span className="detail-badge">สมัครสมาชิก</span>
        </div>

        <div className="detail-hero compact">
          <div>
            <p className="eyebrow">Palm Fitness</p>
            <h1>สมัครวันนี้ แล้วต่อ flow ซื้อแพ็กเกจได้ทันที</h1>
          </div>
          <div className="mini-stat">
            <span>แพ็กเกจแนะนำ</span>
            <strong>{selectedPlan.price.toLocaleString()}</strong>
            <small>บาท/เดือน</small>
          </div>
        </div>

        <div className="plan-select-grid">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              className={`plan-option ${selectedPlan.id === plan.id ? "active" : ""}`}
              onClick={() => setSelectedPlan(plan)}
            >
              <strong>{plan.name}</strong>
              <span>{plan.price.toLocaleString()} บาท</span>
              <small>{plan.perk}</small>
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="membership-form-layout">
          <div className="membership-column form-column">
            <h3>รายละเอียดสมาชิก</h3>

            <div className="field-grid two-col">
              <label>
                <span>ชื่อ *</span>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="กรุณากรอกชื่อ" />
              </label>
              <label>
                <span>นามสกุล *</span>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="กรุณากรอกนามสกุล" />
              </label>
            </div>

            <div className="field-grid">
              <label>
                <span>อีเมล *</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="กรุณากรอกอีเมล" />
              </label>
            </div>

            <div className="field-grid">
              <label>
                <span>เบอร์โทร *</span>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0991234567" />
              </label>
            </div>

            <div className="field-grid two-col compact">
              <label>
                <span>รหัสผ่าน *</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="กรอกรหัสผ่าน" />
              </label>
              <label>
                <span>ยืนยันรหัสผ่าน *</span>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="ยืนยันรหัสผ่าน" />
              </label>
            </div>

            <div className="field-grid two-col compact">
              <label>
                <span>สาขา</span>
                <input type="text" value="Palm Fitness กรุงเทพ" readOnly />
              </label>
              <label>
                <span>สถานะสมาชิก</span>
                <input type="text" value="พร้อมเริ่มใช้งาน" readOnly />
              </label>
            </div>

            {msg && <p className={isSuccess ? "auth-success" : "auth-error"}>{msg}</p>}
          </div>

          <div className="membership-column summary-column">
            <h3>สรุป flow</h3>

            <div className="summary-list">
              <div className="summary-row">
                <span>แพ็กเกจที่เลือก</span>
                <strong>{selectedPlan.name}</strong>
              </div>
              <div className="summary-row">
                <span>ราคาเริ่มต้น</span>
                <strong>{selectedPlan.price.toLocaleString()} บาท</strong>
              </div>
              <div className="summary-row">
                <span>สิทธิ์เด่น</span>
                <strong>{selectedPlan.perk}</strong>
              </div>
              <div className="summary-row total">
                <span>ขั้นตอนถัดไป</span>
                <strong>Login → Confirm Plan → Payment</strong>
              </div>
            </div>

            <div className="summary-card">
              <div className="payment-box">
                <p style={{ margin: 0, fontWeight: 700 }}>สิ่งที่จะได้หลังสมัคร</p>
                <ul style={{ margin: "12px 0 0", paddingLeft: 18, lineHeight: 1.8 }}>
                  <li>บัญชีสมาชิกพร้อมใช้งาน</li>
                  <li>เลือกและยืนยันแพ็กเกจจริง</li>
                  <li>จองเทรนเนอร์หลังชำระเงิน</li>
                </ul>
              </div>
            </div>

            <button type="submit" className="membership-submit" disabled={loading}>
              {loading ? "กำลังยืนยัน..." : "สมัครสมาชิกและไปต่อ"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
