import Link from "next/link";

const navItems = [
  { label: "หน้าแรก", href: "/" },
  { label: "คลับ", href: "/club", active: true },
  { label: "สมาชิก", href: "/member" },
  { label: "ผู้ฝึกสอนส่วนตัว", href: "/trainer" },
  { label: "บทความ", href: "/articles" },
  { label: "Jetts App", href: "/app" },
  { label: "สมัครงาน", href: "/management" },
  { label: "Visitor Pass", href: "/visitor" },
];

const features = [
  { icon: "01", title: "เปิด 24 ชั่วโมง", text: "เข้าฟิตได้ทุกเวลา เหมาะกับคนทำงานและคนที่มีเวลาแน่น" },
  { icon: "02", title: "อุปกรณ์ครบครัน", text: "เครื่องออกกำลังกายหลากหลาย พร้อมพื้นที่สำหรับคาร์ดิโอและความแรง" },
  { icon: "03", title: "เทรนเนอร์มืออาชีพ", text: "คำแนะนำที่ตรงเป้าหมาย ช่วยเพิ่มประสิทธิภาพและลดความเสี่ยงจากการบาดเจ็บ" },
  { icon: "04", title: "ออกกำลังกายอย่างต่อเนื่อง", text: "แอปและระบบติดตามความก้าวหน้า ช่วยให้คุณรักษาความสม่ำเสมอ" },
];

const plans = [
  { name: "Basic", price: "1,550", note: "ต่อเดือน", perks: ["เข้าฟิตได้ 24 ชั่วโมง", "เครื่องคาร์ดิโอพื้นฐาน", "ติดตามความก้าวหน้า"] },
  { name: "Standard", price: "2,490", note: "ต่อเดือน", perks: ["ทุกสิทธิ์ Basic", "คอร์สยืดเหยียด 1 ครั้ง/สัปดาห์", "คำปรึกษาเทรนเนอร์"], featured: true },
  { name: "Premium", price: "3,990", note: "ต่อเดือน", perks: ["ทุกสิทธิ์ Standard", "เทรนเนอร์ส่วนตัว 2 ครั้ง/เดือน", "เข้าร่วมคลาสพิเศษ"] },
];

const testimonials = [
  { name: "ออม", text: "ทุกวันหลังเลิกงานผมเข้าฟิตได้เลย ทำให้มีเวลาออกกำลังกายและรู้สึกดีขึ้น" },
  { name: "บีม", text: "เทรนเนอร์ให้คำแนะนำดีมาก ช่วยปรับเทคนิคและทำให้ค่อย ๆ พัฒนาจนเห็นผล" },
  { name: "นัท", text: "คอร์ส Premium เหมาะกับคนที่ต้องการผลงานชัดเจน และบอกได้เลยว่าใช้แล้วรู้สึกเปลี่ยน" },
];

const experienceHighlights = [
  { title: "พื้นที่ออกกำลังกายแบบพรีเมียม", text: "คอนเซปต์คลับที่ออกแบบให้ใช้สบายและตอบโจทย์ทั้งคนเริ่มต้นจนถึงผู้ฝึกสอนระดับมืออาชีพ" },
  { title: "คลาสและกิจกรรมที่หลากหลาย", text: "สภาพแวดล้อมที่มีเมนูการเคลื่อนไหวหลากหลาย เช่น HIIT, Strength, Yoga และ Cardio" },
  { title: "ระบบติดตามความก้าวหน้า", text: "สมาชิกสามารถเห็นผลลัพธ์และแผนการฝึกผ่านระบบที่อัปเดตแบบต่อเนื่อง" },
];

const journeySteps = [
  { step: "01", title: "สมัครสมาชิก", text: "สร้างบัญชีสมาชิกและเลือกแพ็กเกจที่เหมาะกับเป้าหมาย" },
  { step: "02", title: "ยืนยันแพ็กเกจและชำระเงิน", text: "ผูกแพ็กเกจกับบัญชีจริง พร้อมดูยอดก่อนลดและยอดสุทธิ" },
  { step: "03", title: "จองเทรนเนอร์", text: "เลือกเทรนเนอร์ ช่วงเวลา และติดตาม session ที่เหลือได้ทันที" },
];

const trainers = [
  { name: "Coach Palm", specialty: "Strength & Conditioning", note: "วางแผนการฝึกแบบ progressive overload สำหรับคนเริ่มต้นถึงระดับ advanced" },
  { name: "Coach Mint", specialty: "Mobility & Recovery", note: "ช่วยปรับท่าทาง ลดอาการล้า และทำให้ฝึกต่อเนื่องได้อย่างปลอดภัย" },
  { name: "Coach Natt", specialty: "HIIT & Fat Burn", note: "ออกแบบคลาสเผาผลาญและฝึกแบบเป็นรอบให้เหมาะกับตารางชีวิตจริง" },
];

const faqs = [
  { question: "สมัครแล้วต้องทำอะไรต่อ?", answer: "ระบบจะพาไปล็อกอิน ยืนยันแพ็กเกจ ชำระเงิน และเริ่มจองเทรนเนอร์ได้ทันที" },
  { question: "สามารถดู session คงเหลือได้ที่ไหน?", answer: "ดูได้ใน dashboard, หน้า subscriptions และหน้าจอง session ก่อนยืนยันทุกครั้ง" },
  { question: "ถ้าต้องการเลื่อนเวลาเทรนทำได้ไหม?", answer: "ทำได้จากหน้า Sessions โดยระบบจะตรวจเวลาซ้ำซ้อนของเทรนเนอร์ให้อีกครั้ง" },
];

const promoCards = [
  { title: "เล่นฟิตเนสฟรีเพิ่มอีก 1 เดือน", text: "สำหรับแพ็กเกจรายปีที่สมัครภายในโปรโมชัน" },
  { title: "ฟิตหุ่นกับเทรนเนอร์ฟรี 2 ครั้ง", text: "เริ่มต้นวางแผนอย่างมั่นใจกับโค้ชมืออาชีพ" },
];

const clubHighlights = [
  { title: "เข้าใช้ได้กว่า 300 สาขา", text: "วางตารางฝึกได้ยืดหยุ่น ไม่ว่าคุณจะอยู่ในเมืองหรือเดินทาง" },
  { title: "ดีไซน์คลับแบบ commercial fitness", text: "ภาพรวมหน้าเว็บและภายในคลับใช้ภาษาดีไซน์ที่ชัดขึ้น ใกล้ภาพตัวอย่างมากขึ้น" },
];

export default function LandingPage() {
  return (
    <div className="jets-page">
      <header className="jets-header" id="home">
        <div className="jets-brand-wrap">
          <div className="jets-brand">
            <span className="jets-word">jetts</span>
            <small>24 hour fitness</small>
          </div>
        </div>

        <nav className="jets-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={`nav-link-item ${item.active ? "active" : ""}`}>
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
          <div className="hero-stripes" aria-hidden="true" />
          <div className="hero-content">
            <div className="hero-label">YOUR STRONGER SEASON</div>
            <h1>STARTS NOW</h1>
            <div className="hero-price">
              <span>ถึงเวลาฟิตกว่าเดิม</span>
              <strong>เริ่มต้นเพียง 1,550 บ.</strong>
              <span>/ เดือน*</span>
            </div>
            <ul className="hero-checks">
              <li>สมัครสมาชิก → ล็อกอิน → ซื้อแพ็กเกจ → ชำระเงิน → จองเทรนเนอร์</li>
              <li>ติดตาม session และประวัติการชำระเงินได้จาก dashboard</li>
            </ul>
            <div className="hero-offer">
              <span>เมื่อสมัครสมาชิก PALM FITNESS 12 เดือน</span>
              <strong>วันนี้ - 30 ก.ย. 69</strong>
              <em>*เงื่อนไขเป็นไปตามที่บริษัทกำหนด</em>
            </div>
          </div>
          <div className="hero-promo-card">
            <div className="hero-promo-free">FREE</div>
            <div>
              <strong>Starter Pack</strong>
              <p>รับ session trainer ฟรี พร้อม onboarding plan สำหรับสมาชิกใหม่</p>
            </div>
          </div>
        </section>

        <section className="info-band">
          <div className="info-stat"><strong>24/7</strong><span>เวลาเปิด</span></div>
          <div className="info-stat"><strong>50+</strong><span>เครื่องออกกำลังกาย</span></div>
          <div className="info-stat"><strong>1,200+</strong><span>สมาชิกที่ใช้งาน</span></div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <p className="eyebrow">PROMOTION</p>
            <h2>ข้อเสนอที่ชัดขึ้นในโทน commercial gym</h2>
          </div>
          <div className="promo-grid">
            {promoCards.map((item) => (
              <article key={item.title} className="promo-card">
                <span className="promo-tag">LIMITED</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section split-showcase-section">
          <div className="split-showcase-card">
            <div className="split-showcase-copy">
              <p className="eyebrow">CLUB EXPERIENCE</p>
              <h2>เลย์เอาต์และภาพลักษณ์ที่ใกล้ตัวอย่างมากขึ้น</h2>
              <p>ปรับ hero, โปรโมชัน, section split และการ์ดสำคัญให้มีคอนทราสต์และความรู้สึกแบบ commercial club มากขึ้น โดยยังยึดระบบเดิมเป็นฐาน</p>
              <div className="split-highlight-list">
                {clubHighlights.map((item) => (
                  <article key={item.title} className="split-highlight-item">
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="split-showcase-visual" aria-hidden="true" />
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

        <section className="content-section">
          <div className="section-heading">
            <p className="eyebrow">MEMBER JOURNEY</p>
            <h2>ต่อยอดของเดิมให้เป็น flow ใช้งานจริง</h2>
          </div>
          <div className="journey-step-grid">
            {journeySteps.map((item) => (
              <article key={item.step} className="journey-step-card">
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
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
                <div className="plan-price"><strong>{plan.price}</strong><span>{plan.note}</span></div>
                <ul>
                  {plan.perks.map((perk) => <li key={perk}>{perk}</li>)}
                </ul>
                <Link href="/membership" className="secondary-btn">สมัครเลย</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <p className="eyebrow">TRAINERS</p>
            <h2>โค้ชที่พร้อมพาคุณไปถึงเป้าหมาย</h2>
          </div>
          <div className="trainer-grid">
            {trainers.map((trainer) => (
              <article key={trainer.name} className="trainer-card">
                <div className="trainer-avatar">{trainer.name.split(" ")[1]?.charAt(0) || "C"}</div>
                <h3>{trainer.name}</h3>
                <span>{trainer.specialty}</span>
                <p>{trainer.note}</p>
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

        <section className="content-section faq-section">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2>คำถามที่พบบ่อยก่อนเริ่มใช้งาน</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <article key={faq.question} className="faq-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
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
