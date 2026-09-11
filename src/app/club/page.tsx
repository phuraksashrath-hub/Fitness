import Link from "next/link";

export default function ClubPage() {
  return (
    <main className="detail-page-shell">
      <div className="detail-page-card">
        <div className="detail-page-topbar">
          <Link href="/" className="detail-back-link">← กลับหน้าแรก</Link>
          <span className="detail-badge">คลับ</span>
        </div>

        <div className="detail-hero">
          <div className="detail-hero-copy">
            <p className="eyebrow">Club experience</p>
            <h1>เพลย์กราวด์สำหรับการออกกำลังกายแบบครบวงจร</h1>
          </div>
          <div className="detail-hero-visual club-hero-image">
            <div className="hero-panel">
              <strong>24/7</strong>
              <span>เข้าถึงคลับได้ตลอดเวลา</span>
            </div>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-box"><strong>30+</strong><span>เครื่องออกกำลังกาย</span></div>
          <div className="stat-box"><strong>12</strong><span>คลาสต่อสัปดาห์</span></div>
          <div className="stat-box"><strong>4</strong><span>โซนฝึกหลัก</span></div>
        </div>

        <div className="content-grid two-columns">
          <div className="content-panel">
            <h3>สิ่งอำนวยความสะดวก</h3>
            <ul className="feature-list">
              <li>พื้นที่ยิมคาร์ดิโอพร้อมอุปกรณ์ทันสมัย</li>
              <li>เวทเทรนนิ่งและ functional training</li>
              <li>บรรยากาศที่เงียบและผ่อนคลาย</li>
              <li>ห้องแต่งตัว น้ำดื่ม และพื้นที่พักฟื้น</li>
            </ul>
          </div>

          <div className="content-panel accent">
            <h3>สำหรับทุกระดับ</h3>
            <ul className="feature-list">
              <li>ผู้เริ่มต้นสามารถเริ่มได้ง่าย</li>
              <li>นักกีฬามืออาชีพมีพื้นที่ฝึกแบบลึกขึ้น</li>
              <li>แผนการฝึกและเทรนเนอร์คอยดูแล</li>
              <li>ติดตามความก้าวหน้าอย่างต่อเนื่อง</li>
            </ul>
          </div>
        </div>

        <div className="cta-bar">
          <span>พร้อมเริ่มต้นลุยเป้าหมายของคุณได้แล้ว</span>
          <Link href="/membership" className="primary-btn">สมัครสมาชิก</Link>
        </div>
      </div>
    </main>
  );
}
