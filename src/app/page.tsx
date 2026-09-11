import Link from "next/link";

const navItems = [
  { label: "หน้าแรก", href: "/" },
  { label: "คลับ", href: "/club", active: true },
  { label: "สมาชิก", href: "/member" },
  { label: "ผู้ฝึกสอนส่วนตัว", href: "/trainer" },
  { label: "บทความ", href: "/articles" },
  { label: "Palm App", href: "/app" },
  { label: "สั่งการ", href: "/management" },
  { label: "Visitor Pass", href: "/visitor" },
];

const features = [
  {
    icon: "01",
    title: "เปิด 24 ชั่วโมง",
    text: "เข้าฟิตได้ทุกเวลา เหมาะกับคนทำงานและคนที่มีเวลาแน่น",
  },
  {
    icon: "02",
    title: "อุปกรณ์ครบครัน",
    text: "เครื่องออกกำลังกายหลากหลาย พร้อมพื้นที่สำหรับคาร์ดิโอและความแรง",
  },
  {
    icon: "03",
    title: "เทรนเนอร์มืออาชีพ",
    text: "คำแนะนำที่ตรงเป้าหมาย ช่วยเพิ่มประสิทธิภาพและลดความเสี่ยงจากการบาดเจ็บ",
  },
  {
    icon: "04",
    title: "ออกกำลังกายอย่างต่อเนื่อง",
    text: "แอปและระบบติดตามความก้าวหน้า ช่วยให้คุณรักษาความสม่ำเสมอ",
  },
];

const plans = [
  {
    name: "Basic",
    price: "1,550",
    note: "ต่อเดือน",
    perks: ["เข้าฟิตได้ 24 ชั่วโมง", "เครื่องคาร์ดิโอพื้นฐาน", "ติดตามความก้าวหน้า"],
  },
  {
    name: "Standard",
    price: "2,490",
    note: "ต่อเดือน",
    perks: ["ทุกสิทธิ์ Basic", "คอร์สยืดเหยียด 1 ครั้ง/สัปดาห์", "คำปรึกษาเทรนเนอร์"],
    featured: true,
  },
  {
    name: "Premium",
    price: "3,990",
    note: "ต่อเดือน",
    perks: ["ทุกสิทธิ์ Standard", "เทรนเนอร์ส่วนตัว 2 ครั้ง/เดือน", "เข้าร่วมคลาสพิเศษ"],
  },
];

const testimonials = [
  {
    name: "ออม",
    text: "ทุกวันหลังเลิกงานผมเข้าฟิตได้เลย ทำให้มีเวลาออกกำลังกายและรู้สึกดีขึ้น",
  },
  {
    name: "บีม",
    text: "เทรนเนอร์ให้คำแนะนำดีมาก ช่วยปรับเทคนิคและทำให้ค่อย ๆ พัฒนาจนเห็นผล",
  },
  {
    name: "นัท",
    text: "คอร์ส Premium เหมาะกับคนที่ต้องการผลงานชัดเจน และบอกได้เลยว่าใช้แล้วรู้สึกเปลี่ยน",
  },
];

const experienceHighlights = [
  {
    title: "พื้นที่ออกกำลังกายแบบพรีเมียม",
    text: "คอนเซปต์คลับที่ออกแบบให้ใช้สบายและตอบโจทย์ทั้งคนเริ่มต้นจนถึงผู้ฝึกสอนระดับมืออาชีพ",
  },
  {
    title: "คลาสและกิจกรรมที่หลากหลาย",
    text: "ยกเว้นความซ้ำซากจากสภาพแวดล้อมที่มีเมนูการเคลื่อนไหวหลากหลาย เช่น HIIT, Strength, Yoga และ Cardio",
  },
  {
    title: "ระบบติดตามความก้าวหน้า",
    text: "สมาชิกสามารถเห็นผลลัพธ์และแผนการฝึกผ่านระบบที่พร้อมให้ความคุ้มครองและอัปเดตแบบต่อเนื่อง",
  },
];

export default function LandingPage() {
  return (
    <div className="jets-page">
      <header className="jets-header" id="home">
        <div className="jets-brand-wrap">
          <div className="jets-brand">
            <span className="jets-word">Palm</span>
            <small>24 hour fitness</small>
          </div>
        </div>

        <nav className="jets-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`nav-link-item ${item.active ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/membership" className="jets-join-btn" aria-label="สมัครสมาชิก">
          <span className="plus-sign">+</span>
          สมัครสมาชิก
        </Link>
      </header>

      <main className="jets-main">
        <section className="jets-hero">
          <div className="hero-visual" aria-hidden="true" />

          <div className="hero-content">
            <div className="hero-label">YOUR STRONGER SEASON</div>
            <h1>STARTS NOW</h1>

            <div className="hero-price">
              <span>ถึงเวลาฟิตกว่าเดิม</span>
              <strong>เริ่มต้นเพียง 1,550 บ.</strong>
              <span>/ เดือน*</span>
            </div>

            <ul className="hero-checks">
              <li>ฟิตหนักกับเทรนเนอร์ฟรี 2 ครั้ง</li>
              <li>เล่นฟิตเนสฟรีเพิ่มอีก 1 เดือน</li>
            </ul>

            <div className="hero-offer">
              <span>“เมื่อสมัครสมาชิก Palm Fitness 12 เดือน</span>
              <strong>วันนี้ - 30 ก.ย. 69</strong>
              <em>*เงื่อนไขเป็นไปตามที่บริษัทกำหนด</em>
            </div>
          </div>

        </section>

        <section className="info-band">
          <div className="info-stat">
            <strong>24/7</strong>
            <span>เวลาเปิด</span>
          </div>
          <div className="info-stat">
            <strong>50+</strong>
            <span>เครื่องออกกำลังกาย</span>
          </div>
          <div className="info-stat">
            <strong>1,200+</strong>
            <span>สมาชิกที่ใช้งาน</span>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <p className="eyebrow">WHAT YOU GET</p>
            <h2>ประสบการณ์ที่ตอบโจทย์ทุกระดับการฝึก</h2>
          </div>

          <div className="experience-grid">
            {experienceHighlights.map((item) => (
              <article key={item.title} className="experience-card">
                <span className="experience-number">•</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <p className="eyebrow">WHY PALM</p>
            <h2>ออกกำลังกายแบบมีแผนและคงความต่อเนื่อง</h2>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section plans-section">
          <div className="section-heading">
            <p className="eyebrow">MEMBERSHIP</p>
            <h2>เลือกแผนที่ใช่สำหรับคุณ</h2>
          </div>

          <div className="plan-grid">
            {plans.map((plan) => (
              <article key={plan.name} className={`plan-card ${plan.featured ? "featured" : ""}`}>
                <div className="plan-topline">{plan.name}</div>
                <div className="plan-price">
                  <strong>{plan.price}</strong>
                  <span>{plan.note}</span>
                </div>
                <ul>
                  {plan.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                <Link href="/membership" className="secondary-btn">
                  สมัครเลย
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section testimonials-section">
          <div className="section-heading">
            <p className="eyebrow">TESTIMONIALS</p>
            <h2>ประสบการณ์จากสมาชิกจริง</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article key={item.name} className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p>“{item.text}”</p>
                <strong>{item.name}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <div>
            <p className="eyebrow">START TODAY</p>
            <h2>เริ่มต้นเปลี่ยนตัวเองให้แข็งแรงขึ้น</h2>
          </div>
          <Link href="/membership" className="jets-join-btn">
            <span className="plus-sign">+</span>
            สมัครสมาชิกตอนนี้
          </Link>
        </section>
      </main>
    </div>
  );
}