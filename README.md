# 🏋️ Fitness Center Management System

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Frontend-Next.js-000000?logo=next.js">
  <img alt="ASP.NET Core" src="https://img.shields.io/badge/Backend-ASP.NET%20Core-512BD4?logo=dotnet">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-Educational-informational">
  <img alt="Status" src="https://img.shields.io/badge/Status-Portfolio%20Project-success">
</p>

A full-stack web application for managing fitness center operations — including memberships, trainer bookings, payments, workout tracking, equipment maintenance, and usage reports.

> Designed as an **OOP + Full Stack** academic project with practical business logic.

---

## 🇺🇸 English

### ✨ Highlights
- Role-based access: **Admin / Trainer / Member**
- Membership subscription & renewal
- Trainer booking / cancel / reschedule
- Payment processing (Credit Card / PromptPay)
- Equipment maintenance management
- Usage & revenue reports
- Swagger API documentation

### 🧱 Tech Stack
- **Frontend:** Next.js (TypeScript), Axios
- **Backend:** ASP.NET Core Web API, EF Core, JWT
- **Database:** PostgreSQL

### 🧭 Architecture
`Controller → Service → Repository → PostgreSQL`

### 🧠 OOP & Patterns
- **Inheritance:** `User → Member, Trainer`
- **Polymorphism:** `Payment.ProcessPayment()` with multiple implementations
- **Factory Pattern:** `PaymentFactory`
- **Strategy Pattern:** `IDiscountStrategy` (student / renewal / none)
- **Repository Pattern:** data access abstraction

### 📌 Core Business Rules
- Only **ACTIVE** and non-expired subscriptions can book sessions
- Cannot book when remaining sessions = 0
- Trainer schedule conflicts are blocked
- Discount is calculated before final payment amount
- Reschedule validates conflicts again

### 🔌 API Overview (Sample)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/subscriptions`
- `POST /api/sessions/book`
- `PUT /api/sessions/{id}/cancel`
- `PUT /api/sessions/{id}/reschedule`
- `POST /api/payments/process`
- `GET /api/reports/usage`
- `GET /api/reports/revenue`

### 🚀 Getting Started
#### 1) Clone
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

#### 2) Backend
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

#### 3) Frontend
```bash
cd ../frontend
npm install
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000` (or configured port)

---

## 🇹🇭 ภาษาไทย

### ✨ ความสามารถหลัก
- ระบบสิทธิ์ผู้ใช้: **Admin / Trainer / Member**
- สมัครและต่ออายุสมาชิก
- จอง / ยกเลิก / เลื่อนนัดเทรนเนอร์
- ชำระเงิน (บัตรเครดิต / พร้อมเพย์)
- จัดการอุปกรณ์และงานซ่อมบำรุง
- รายงานการใช้งานและรายได้
- เอกสาร API ผ่าน Swagger

### 🧱 เทคโนโลยี
- **Frontend:** Next.js (TypeScript), Axios
- **Backend:** ASP.NET Core Web API, EF Core, JWT
- **Database:** PostgreSQL

### 🧠 แนวคิด OOP และ Design Patterns
- **Inheritance:** `User` เป็นคลาสแม่ของ `Member`, `Trainer`
- **Polymorphism:** `Payment.ProcessPayment()` ทำงานต่างกันตามชนิดการจ่าย
- **Factory Pattern:** `PaymentFactory` สร้าง object การชำระเงิน
- **Strategy Pattern:** กลยุทธ์ส่วนลด (`student`, `renewal`, `none`)
- **Repository Pattern:** แยก business logic ออกจากการเข้าถึงข้อมูล

### 📌 กฎธุรกิจสำคัญ
- สมาชิกต้อง ACTIVE และยังไม่หมดอายุจึงจองได้
- session คงเหลือต้องมากกว่า 0
- ไม่ให้เวลาจองเทรนเนอร์ซ้อนกัน
- คำนวณส่วนลดก่อนบันทึกยอดชำระจริง
- การเลื่อนนัดต้องตรวจเวลาซ้ำอีกครั้ง

### 🎬 ลำดับเดโมแนะนำ
1. Login  
2. Subscribe Plan  
3. Book Session  
4. Process Payment  
5. ดูรายการนัด + Cancel/Reschedule  

---

## 🗂 Suggested Project Structure

```txt
fitness-center-management-system/
  backend/
    Controllers/
    Services/
    Repositories/
    Domain/
    Data/
  frontend/
    src/app/
    src/components/
    src/lib/
  database.sql
  README.md
```

---

## ⚙️ Example Backend Configuration

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=fitness_center;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Key": "THIS_IS_A_DEMO_SECRET_KEY_CHANGE_IT",
    "Issuer": "FitnessCenter.Api",
    "Audience": "FitnessCenter.Client"
  }
}
```

---

## 👤 Author

**<YOUR_NAME>**  
GitHub: [@<your-username>](https://github.com/<your-username>)  
Email: `<your-email@example.com>`

> Replace placeholders before publishing.

---

## 📄 License

For educational and portfolio purposes.