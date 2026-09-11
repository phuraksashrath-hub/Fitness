import Link from "next/link";

export default function VisitorPage() {
  return (
    <main className="detail-page-shell">
      <div className="detail-page-card">
        <div className="detail-page-topbar">
          <Link href="/" className="detail-back-link">← กลับหน้าแรก</Link>
          <span className="detail-badge">Visitor Pass</span>
        </div>

        <div className="detail-hero">
          <div className="detail-hero-copy">
            <p className="eyebrow">Visitor experience</p>
            <h1>สัมผัสประสบการณ์ก่อนตัดสินใจสมัครสมาชิก</h1>
          </div>
          <div className="detail-hero-visual visitor-hero-image">
            <div className="hero-panel">
              <strong>FREE</strong>
              <span>เข้าชมคลับและทดลองใช้บริการแบบง่าย ๆ</span>
            </div>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-box"><strong>1x</strong><span>เข้าชมคลับ</span></div>
          <div className="stat-box"><strong>24h</strong><span>เวลาใช้งาน</span></div>
          <div className="stat-box"><strong>3</strong><span>ขั้นตอนง่าย ๆ</span></div>
        </div>

        <div className="content-grid two-columns">
          <div className="content-panel">
            <h3>สำหรับผู้สนใจ</h3>
            <ul className="feature-list">
              <li>เข้าชมบรรยากาศและสภาพแวดล้อมของคลับ</li>
              <li>ทดลองใช้งานพื้นที่ออกกำลังกายและอุปกรณ์</li>
              <li>เรียนรู้สิทธิประโยชน์ก่อนตัดสินใจสมัคร</li>
              <li>พบกับทีมงานและคำแนะนำจากผู้เชี่ยวชาญ</li>
            </ul>
          </div>

          <div className="content-panel accent">
            <h3>ขั้นตอนการเข้าชม</h3>
            <ul className="feature-list">
              <li>ลงทะเบียนผ่านระบบเพื่อยืนยันข้อมูลเบื้องต้น</li>
              <li>รับการแนะนำและสรุปประสบการณ์ของคลับ</li>
              <li>เลือกแผนสมาชิกที่เหมาะกับไลฟ์สไตล์</li>
              <li>เริ่มต้นได้ทันทีโดยไม่ต้องใช้เวลาเยอะ</li>
            </ul>
          </div>
        </div>

        <div className="cta-bar">
          <span>พร้อมสัมผัสประสบการณ์ก่อนตัดสินใจสมัครสมาชิกแบบยาวต่อไป</span>
          <Link href="/membership" className="primary-btn">สมัครสมาชิก</Link>
        </div>
      </div>
    </main>
  );
}
