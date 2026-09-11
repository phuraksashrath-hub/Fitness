"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const plans = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Basic", price: 1550, perk: "เข้าฟิตได้ 24 ชั่วโมง" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Standard", price: 2490, perk: "คอร์สยืดเหยียด + คำปรึกษาเทรนเนอร์" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Premium", price: 3990, perk: "เทรนเนอร์ส่วนตัว + คลาสพิเศษ" },
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
      setMsg("สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ");

      setTimeout(() => {
        router.push("/login");
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
            <h1>เริ่มต้นการเปลี่ยนแปลงของคุณวันนี้</h1>
          </div>
          <div className="mini-stat">
            <span>ค่าเริ่มต้น</span>
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

            <div className="field-grid">
              <label>
                <span>รหัสผ่าน *</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="กรอกรหัสผ่าน" />
              </label>
            </div>

            <div className="field-grid">
              <label>
                <span>ยืนยันรหัสผ่าน *</span>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="ยืนยันรหัสผ่าน" />
              </label>
            </div>

            <div className="field-grid">
              <label>
                <span>สาขา *</span>
                <input type="text" value="สาขาเขตกรุงเทพ" readOnly />
              </label>
            </div>

            <div className="field-grid">
              <label>
                <span>รหัสบัตรประชาชน *</span>
                <input type="text" placeholder="กรุณากรอกรหัสบัตรประชาชน" />
              </label>
            </div>

            {msg && <p className={isSuccess ? "auth-success" : "auth-error"}>{msg}</p>}
          </div>

          <div className="membership-column summary-column">
            <h3>สรุป</h3>

            <div className="summary-list">
              <div className="summary-row">
                <span>แผนที่เลือก</span>
                <strong>{selectedPlan.name}</strong>
              </div>
              <div className="summary-row">
                <span>ค่าเริ่มต้น</span>
                <strong>{selectedPlan.price.toLocaleString()} บาท</strong>
              </div>
              <div className="summary-row">
                <span>ส่วนลด</span>
                <strong>0</strong>
              </div>
              <div className="summary-row total">
                <span>ยอดชำระ</span>
                <strong>{selectedPlan.price.toLocaleString()} บาท</strong>
              </div>
            </div>

            <div className="summary-card">
              <div className="payment-box">
                <label className="radio-row">
                  <input type="radio" name="payment" defaultChecked />
                  <span>บัตรเครดิต</span>
                </label>
                <label className="radio-row">
                  <input type="radio" name="payment" />
                  <span>พร้อมเพย์</span>
                </label>
              </div>

              <div className="payment-detail">
                <div className="field-grid">
                  <label>
                    <span>หมายเลขบัตร *</span>
                    <input type="text" placeholder="1234 5678 9012 3456" />
                  </label>
                </div>
                <div className="field-grid two-col compact">
                  <label>
                    <span>วันหมดอายุ *</span>
                    <input type="text" placeholder="MM/YY" />
                  </label>
                  <label>
                    <span>CVV *</span>
                    <input type="text" placeholder="***" />
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="membership-submit" disabled={loading}>
              {loading ? "กำลังยืนยัน..." : "ยืนยัน"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
