import Link from "next/link";

export default function PalmAppPage() {
  return (
    <main className="detail-page-shell">
      <div className="detail-page-card">
        <div className="detail-page-topbar">
          <Link href="/" className="detail-back-link">← กลับหน้าแรก</Link>
          <span className="detail-badge">Palm App</span>
        </div>

        <div className="detail-hero">
          <div className="detail-hero-copy">
            <p className="eyebrow">Mobile experience</p>
            <h1>ใช้งานง่ายทุกที่ ด้วยแอปที่ช่วยจัดการคลับของคุณ</h1>
          </div>
          <div className="detail-hero-visual app-hero-image">
            <div className="hero-panel">
              <strong>iOS / Android</strong>
              <span>ทุกแพลตฟอร์มพร้อมใช้งาน</span>
            </div>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-box"><strong>24/7</strong><span>เช็คข้อมูลทุกเวลา</span></div>
          <div className="stat-box"><strong>Fast</strong><span>การจองคลาสที่เร็ว</span></div>
          <div className="stat-box"><strong>Live</strong><span>ติดตามความก้าวหน้า</span></div>
        </div>

        <div className="content-grid two-columns">
          <div className="content-panel">
            <h3>ฟีเจอร์</h3>
            <ul className="feature-list">
              <li>จองเวลาเข้ายิมและคลาสได้ทันที</li>
              <li>ดูสถิติการฝึกและแผนการออกกำลังกาย</li>
              <li>รับโปรโมชั่นและแจ้งเตือนสิทธิพิเศษ</li>
              <li>ติดตามการชำระเงินและใบแจ้งหนี้</li>
            </ul>
          </div>

          <div className="content-panel accent">
            <h3>ประสบการณ์ที่ดี</h3>
            <ul className="feature-list">
              <li>หน้าจอที่อ่านง่ายและใช้งานสะดวก</li>
              <li>รองรับทุกอุปกรณ์</li>
              <li>เชื่อมต่อข้อมูลแบบเรียลไทม์</li>
              <li>สามารถเข้าถึงบริการได้จากมือถือ</li>
            </ul>
          </div>
        </div>

        <div className="cta-bar">
          <span>จัดการประสบการณ์การออกกำลังกายของคุณได้ทุกที่</span>
          <Link href="/membership" className="primary-btn">สมัครสมาชิก</Link>
        </div>
      </div>
    </main>
  );
}
