import Link from "next/link";

export default function TrainerPage() {
  return (
    <main className="detail-page-shell">
      <div className="detail-page-card">
        <div className="detail-page-topbar">
          <Link href="/" className="detail-back-link">← กลับหน้าแรก</Link>
          <span className="detail-badge">ผู้ฝึกสอนส่วนตัว</span>
        </div>

        <div className="detail-hero">
          <div className="detail-hero-copy">
            <p className="eyebrow">Private coaching</p>
            <h1>ทีมเทรนเนอร์ที่คัดสรรเพื่อผลลัพธ์ที่ยั่งยืน</h1>
          </div>
          <div className="detail-hero-visual trainer-hero-image">
            <div className="hero-panel">
              <strong>1:1</strong>
              <span>การดูแลแบบเฉพาะบุคคล</span>
            </div>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-box"><strong>8+</strong><span>เทรนเนอร์ประสบการณ์</span></div>
          <div className="stat-box"><strong>90%</strong><span>คนที่ปฏิบัติตามแผน</span></div>
          <div className="stat-box"><strong>4</strong><span>เป้าหมายหลัก</span></div>
        </div>

        <div className="content-grid two-columns">
          <div className="content-panel">
            <h3>บริการหลัก</h3>
            <ul className="feature-list">
              <li>ออกแบบโปรแกรมรวมทั้งการออกกำลังกายและโภชนาการ</li>
              <li>ตรวจสอบความก้าวหน้าและปรับแผนอย่างต่อเนื่อง</li>
              <li>ให้คำปรึกษาเรื่องฟื้นฟูร่างกายและการลดอาการบาดเจ็บ</li>
              <li>คอยดูแลแบบรายสัปดาห์เพื่อให้บรรลุเป้าหมาย</li>
            </ul>
          </div>

          <div className="content-panel accent">
            <h3>ผลลัพธ์ที่คาดหวัง</h3>
            <ul className="feature-list">
              <li>ลดไขมันและปรับสัดส่วน</li>
              <li>เพิ่มความแข็งแรงและกล้ามเนื้อ</li>
              <li>ปรับพฤติกรรมการฝึกให้เป็นนิสัย</li>
              <li>เพิ่มความมั่นใจและสุขภาพ</li>
            </ul>
          </div>
        </div>

        <div className="cta-bar">
          <span>พบกับเทรนเนอร์ที่เหมาะกับเป้าหมายของคุณ</span>
          <Link href="/membership" className="primary-btn">สมัครสมาชิก</Link>
        </div>
      </div>
    </main>
  );
}
