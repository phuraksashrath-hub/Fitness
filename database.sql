CREATE TABLE users (
  id UUID PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN','TRAINER','MEMBER')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE members (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(20),
  birth_date DATE,
  emergency_contact VARCHAR(120)
);

CREATE TABLE trainers (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialty VARCHAR(120),
  bio TEXT
);

CREATE TABLE membership_plans (
  id UUID PRIMARY KEY,
  plan_name VARCHAR(60) NOT NULL,
  duration_days INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  max_sessions_per_month INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES membership_plans(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE','EXPIRED','CANCELLED')),
  remaining_sessions INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE workout_programs (
  id UUID PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES trainers(id),
  title VARCHAR(120) NOT NULL,
  goal TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES trainers(id),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('BOOKED','COMPLETED','CANCELLED','RESCHEDULED')),
  notes TEXT
);

CREATE TABLE payments (
  id UUID PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('CREDIT_CARD','PROMPTPAY')),
  paid_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING','PAID','FAILED'))
);

CREATE TABLE equipment (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(60),
  purchase_date DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('AVAILABLE','MAINTENANCE','OUT_OF_ORDER'))
);

CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  issue_description TEXT NOT NULL,
  reported_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP,
  status VARCHAR(20) NOT NULL CHECK (status IN ('OPEN','IN_PROGRESS','RESOLVED'))
);

-- กันการจองชนเวลา trainer คนเดียวกัน
CREATE UNIQUE INDEX uq_trainer_timeslot
ON workout_sessions (trainer_id, session_date, start_time, end_time)
WHERE status IN ('BOOKED','RESCHEDULED');