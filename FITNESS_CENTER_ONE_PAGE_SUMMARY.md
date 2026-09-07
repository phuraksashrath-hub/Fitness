# Fitness Center Management System (OOP Full Stack) — One Page Summary

## 1) Project Goal
ระบบเว็บสำหรับจัดการฟิตเนส: สมาชิก, แพ็กเกจ, การจองเทรนเนอร์, การชำระเงิน, และรายงานการใช้งาน  
เน้นการประยุกต์ใช้ **OOP + Design Patterns + Full Stack Architecture**

---

## 2) Tech Stack
- **Frontend:** Next.js (TypeScript)
- **Backend:** ASP.NET Core Web API (C#)
- **Database:** PostgreSQL
- **Auth:** JWT + Role-based Authorization
- **API Docs:** Swagger/OpenAPI

---

## 3) Architecture
`Client (Next.js) → Controller → Service → Repository → PostgreSQL`

- **Controller:** รับ/ส่ง HTTP Request/Response
- **Service:** จัดการ Business Logic
- **Repository:** จัดการ Data Access
- **DB:** เก็บข้อมูลเชิงสัมพันธ์ (Relational)

---

## 4) Core Domain Classes (>=10)
1. User (Base)
2. Member : User
3. Trainer : User
4. MembershipPlan
5. Subscription
6. WorkoutProgram
7. WorkoutSession
8. Equipment
9. Payment (Base)
10. CreditCardPayment : Payment
11. PromptPayPayment : Payment

---

## 5) OOP & Design Patterns Used
### OOP
- **Inheritance:** `User → Member, Trainer`
- **Polymorphism:** `Payment.ProcessPayment()` ต่างกันตาม method
- **Encapsulation:** ซ่อน logic ไว้ใน Service/Entity methods
- **Abstraction:** ใช้ interface เช่น Repository/Strategy

### Design Patterns
- **Factory Pattern:** `PaymentFactory` สร้าง payment object จาก method
- **Strategy Pattern:** `IDiscountStrategy` (student / renewal / none)
- **Repository Pattern:** แยก data access ออกจาก business logic

---

## 6) Main Business Rules
1. สมาชิกต้องมีสถานะ ACTIVE และไม่หมดอายุจึงจองได้
2. ต้องมี `remaining_sessions > 0` ก่อนจอง
3. เทรนเนอร์ห้ามมีเวลาซ้อนกันในช่วงเดียวกัน
4. การจ่ายเงินต้องคำนวณส่วนลดก่อนบันทึกยอดสุทธิ
5. การเลื่อนนัดต้องผ่านการตรวจสอบ conflict อีกครั้ง

---

## 7) Main Use Cases (>=10)
1. Register / Login
2. Subscribe Membership
3. Renew Membership
4. Book Trainer Session
5. Cancel Session
6. Reschedule Session
7. Log Workout Program
8. Process Payment
9. Generate Receipt
10. Manage Equipment
11. Maintenance Request
12. Usage/Revenue Report

---

## 8) Key Database Tables
- users
- members
- trainers
- membership_plans
- subscriptions
- workout_sessions
- workout_programs
- payments
- equipment
- maintenance_requests

> มี Unique Index ป้องกันการจอง trainer ซ้ำ timeslot เดียวกัน

---

## 9) Key APIs (Sample)
- `POST /api/auth/login`
- `POST /api/subscriptions`
- `POST /api/sessions/book`
- `PUT /api/sessions/{id}/cancel`
- `PUT /api/sessions/{id}/reschedule`
- `POST /api/payments/process`
- `GET /api/reports/usage`

---

## 10) Demo Flow (Short)
1. Login
2. Subscribe plan
3. Book trainer session
4. Process payment (with discount)
5. View sessions → cancel/reschedule

---

## 11) Learning Outcomes
- ออกแบบระบบเชิงวัตถุจากโจทย์ธุรกิจจริง
- เขียน Full Stack แบบแยก Layer มาตรฐาน
- ใช้ Design Patterns กับงานจริง
- จัดการข้อจำกัดเชิงธุรกิจ (Business Constraints) และความถูกต้องของข้อมูล
