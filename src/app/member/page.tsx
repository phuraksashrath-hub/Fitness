import Link from "next/link";

export default function MemberPage() {
  return (
    <main className="detail-page-shell">
      <div className="detail-page-card">
        <div className="detail-page-topbar">
          <Link href="/" className="detail-back-link">← กลับหน้าแรก</Link>
          <span className="detail-badge">สมาชิก</span>
        </div>

        <div className="detail-hero">
          <div className="detail-hero-copy">
            <p className="eyebrow">Member benefits</p>
            <h1>สิทธิประโยชน์สำหรับสมาชิกทุกคน</h1>
          </div>
          <div className="detail-hero-visual member-hero-image">
            <div className="hero-panel">
              <strong>100%</strong>
              <span>เข้าถึงบริการหลักและคลาส</span>
            </div>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-box"><strong>20+</strong><span>คลาส/เดือน</span></div>
          <div className="stat-box"><strong>2x</strong><span>สิทธิ์เทรนเนอร์</span></div>
          <div className="stat-box"><strong>1</strong><span>แผนการฝึกส่วนตัว</span></div>
        </div>

        <div className="content-grid two-columns">
          <div className="content-panel">
            <h3>สิทธิพิเศษ</h3>
            <ul className="feature-list">
              <li>เข้ายิมและคลาสเต็มรูปแบบ</li>
              <li>ส่วนลดสินค้าและอุปกรณ์กีฬา</li>
              <li>อัปเดตโปรโมชั่นและสิทธิ์พิเศษ</li>
              <li>เช็คประวัติและความคืบหน้าผ่านระบบ</li>
            </ul>
          </div>

          <div className="content-panel accent">
            <h3>การใช้งาน</h3>
            <ul className="feature-list">
              <li>จองคอร์สออนไลน์ได้ทันที</li>
              <li>ติดตามสถิติการฝึกรายสัปดาห์</li>
              <li>ดูแผนการฝึกและการชำระเงิน</li>
              <li>ได้รับความช่วยเหลือจากแอดมิน</li>
            </ul>
          </div>
        </div>

        <div className="cta-bar">
          <span>เลือกสิทธิ์ที่เหมาะกับไลฟ์สไตล์ของคุณ</span>
          <Link href="/membership" className="primary-btn">สมัครสมาชิก</Link>
        </div>
      </div>
    </main>
  );
}
