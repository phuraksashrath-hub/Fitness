import Link from "next/link";

export default function ManagementPage() {
  return (
    <main className="detail-page-shell">
      <div className="detail-page-card">
        <div className="detail-page-topbar">
          <Link href="/" className="detail-back-link">← กลับหน้าแรก</Link>
          <span className="detail-badge">สั่งการ</span>
        </div>

        <div className="detail-hero">
          <div className="detail-hero-copy">
            <p className="eyebrow">Operations hub</p>
            <h1>ควบคุมทุกการใช้งานภายในระบบได้อย่างมีประสิทธิภาพ</h1>
          </div>
          <div className="detail-hero-visual management-hero-image">
            <div className="hero-panel">
              <strong>Live</strong>
              <span>จัดการสมาชิก คอร์ส และการชำระเงินแบบเรียลไทม์</span>
            </div>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-box"><strong>100%</strong><span>เข้าถึงข้อมูลจริง</span></div>
          <div className="stat-box"><strong>24/7</strong><span>ระบบพร้อมให้บริการ</span></div>
          <div className="stat-box"><strong>Fast</strong><span>ติดตามและตอบสนองรวดเร็ว</span></div>
        </div>

        <div className="content-grid two-columns">
          <div className="content-panel">
            <h3>การจัดการ</h3>
            <ul className="feature-list">
              <li>จัดการข้อมูลสมาชิกและสิทธิประโยชน์</li>
              <li>ติดตามคอร์สและการเข้าร่วมคลาส</li>
              <li>ตรวจสอบการชำระเงินและสรุปธุรกรรม</li>
              <li>ดูภาพรวมการใช้งานและประสิทธิภาพของระบบ</li>
            </ul>
          </div>

          <div className="content-panel accent">
            <h3>ผลลัพธ์</h3>
            <ul className="feature-list">
              <li>ลดความซ้ำซ้อนในการทำงาน</li>
              <li>ลดเวลาในการตอบสนองและบริหารทีม</li>
              <li>ตัดสินใจด้วยข้อมูลที่ชัดเจนและทันเวลา</li>
              <li>ยกระดับประสบการณ์การให้บริการให้ดีขึ้น</li>
            </ul>
          </div>
        </div>

        <div className="cta-bar">
          <span>บริหารความเป็นระเบียบและประสิทธิภาพของคลับได้แบบเรียลไทม์</span>
          <Link href="/membership" className="primary-btn">สมัครสมาชิก</Link>
        </div>
      </div>
    </main>
  );
}
