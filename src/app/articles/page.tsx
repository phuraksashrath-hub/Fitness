import Link from "next/link";

const articleTopics = [
  {
    title: "Nutrition for Better Recovery",
    body: "เรียนรู้ว่าการจัดสรรโปรตีน คาร์โบไฮเดรต และน้ำหล่อเลี้ยงร่างกายอย่างเหมาะสมช่วยให้ฟื้นฟูได้เร็วขึ้นและออกกำลังกายต่อเนื่องได้ดีขึ้น",
  },
  {
    title: "How to Build a Strong Routine",
    body: "จัดตารางฝึกที่คงที่ ช่วยลดความเหนื่อยล้าและรักษาแรงจูงใจให้ทำสิ่งที่ต้องการต่อเนื่องแบบมีระบบ",
  },
  {
    title: "Performance & Mobility",
    body: "การยืดเหยียดและฝึกความยืดหยุ่นเป็นส่วนสำคัญที่ช่วยให้การเคลื่อนไหวดีขึ้น ลดอาการเครียดจากการฝึก",
  },
];

export default function ArticlesPage() {
  return (
    <main className="detail-page-shell">
      <div className="detail-page-card">
        <div className="detail-page-topbar">
          <Link href="/" className="detail-back-link">← กลับหน้าแรก</Link>
          <span className="detail-badge">บทความ</span>
        </div>

        <div className="detail-hero">
          <div className="detail-hero-copy">
            <p className="eyebrow">Knowledge hub</p>
            <h1>บทความและแนวทางการดูแลสุขภาพแบบใช้ได้จริง</h1>
          </div>
          <div className="detail-hero-visual articles-hero-image">
            <div className="hero-panel">
              <strong>Weekly</strong>
              <span>คอนเทนต์ใหม่ทุกสัปดาห์</span>
            </div>
          </div>
        </div>

        <div className="content-grid article-grid">
          {articleTopics.map((item) => (
            <article key={item.title} className="content-panel article-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Link href="/" className="text-link">อ่านเพิ่มเติม →</Link>
            </article>
          ))}
        </div>

        <div className="cta-bar">
          <span>เรียนรู้แนวทางที่ช่วยให้คุณเริ่มและรักษาความสม่ำเสมอได้</span>
          <Link href="/membership" className="primary-btn">สมัครสมาชิก</Link>
        </div>
      </div>
    </main>
  );
}
