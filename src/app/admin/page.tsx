"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  AdminMember,
  AdminPayment,
  AdminSubscription,
  AdminTrainer,
  createAdminPlan,
  createAdminTrainer,
  DashboardMetric,
  deleteAdminMember,
  getAdminMembers,
  getAdminPayments,
  getAdminPlans,
  getAdminSubscriptions,
  getAdminSummary,
  getAdminTrainers,
  getCurrentUserFromToken,
  MembershipPlan,
  setAuthToken,
  updateAdminMember,
  updateAdminPlan,
  updateAdminTrainer,
} from "@/lib/api";

const emptyPlan = { planName: "", durationDays: 30, price: 1990, maxSessionsPerMonth: 12 };
const emptyTrainer = { fullName: "", email: "", password: "trainer123", specialty: "General fitness" };
const tabs = ["Overview", "Members", "Plans", "Trainers", "Subscriptions", "Payments"] as const;

type TabKey = (typeof tabs)[number];

export default function AdminPage() {
  const [user, setUser] = useState<{ fullName: string; email: string; role: string } | null>(null);
  const [summary, setSummary] = useState<DashboardMetric[]>([]);
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [trainers, setTrainers] = useState<AdminTrainer[]>([]);
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [newPlan, setNewPlan] = useState(emptyPlan);
  const [newTrainer, setNewTrainer] = useState(emptyTrainer);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("Overview");
  const [notice, setNotice] = useState("");

  const loadAdminData = async () => {
    const [summaryRes, membersRes, plansRes, trainersRes, subscriptionsRes, paymentsRes] = await Promise.all([
      getAdminSummary(),
      getAdminMembers(),
      getAdminPlans(),
      getAdminTrainers(),
      getAdminSubscriptions(),
      getAdminPayments(),
    ]);

    setSummary(summaryRes.data || []);
    setMembers(membersRes.data || []);
    setPlans(plansRes.data || []);
    setTrainers(trainersRes.data || []);
    setSubscriptions(subscriptionsRes.data || []);
    setPayments(paymentsRes.data || []);
  };

  useEffect(() => {
    const currentUser = getCurrentUserFromToken();
    setUser(currentUser);
    setAuthToken(localStorage.getItem("token"));

    loadAdminData()
      .catch(() => setNotice("โหลดข้อมูล admin ไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, []);

  const summaryMap = useMemo(() => Object.fromEntries(summary.map((item) => [item.label, item.value])), [summary]);
  const revenueValue = Number(summaryMap.Revenue || 0).toLocaleString();

  const handleMemberChange = async (id: string, field: keyof AdminMember, value: string) => {
    const target = members.find((item) => item.id === id);
    if (!target) return;

    const updated = { ...target, [field]: value };
    const payload = { fullName: updated.fullName, email: updated.email, phone: updated.phone, role: updated.role };
    await updateAdminMember(id, payload);
    setMembers((prev) => prev.map((item) => (item.id === id ? updated : item)));
    setNotice("อัปเดตข้อมูลสมาชิกแล้ว");
  };

  const handleDeleteMember = async (id: string) => {
    await deleteAdminMember(id);
    setMembers((prev) => prev.filter((item) => item.id !== id));
    setNotice("ลบสมาชิกแล้ว");
  };

  const handlePlanChange = async (id: string, field: keyof MembershipPlan, value: string | number) => {
    const target = plans.find((item) => item.id === id);
    if (!target) return;

    const updated = { ...target, [field]: value };
    await updateAdminPlan(id, {
      planName: updated.planName,
      durationDays: Number(updated.durationDays),
      price: Number(updated.price),
      maxSessionsPerMonth: Number(updated.maxSessionsPerMonth),
    });
    setPlans((prev) => prev.map((item) => (item.id === id ? updated : item)));
    setNotice("อัปเดตแพ็กเกจแล้ว");
  };

  const handleCreatePlan = async () => {
    if (!newPlan.planName.trim()) return;
    const res = await createAdminPlan(newPlan);
    setPlans((prev) => [...prev, res.data]);
    setNewPlan(emptyPlan);
    setNotice("เพิ่มแพ็กเกจใหม่แล้ว");
  };

  const handleTrainerChange = async (id: string, field: keyof AdminTrainer, value: string) => {
    const target = trainers.find((item) => item.id === id);
    if (!target) return;

    const updated = { ...target, [field]: value };
    await updateAdminTrainer(id, {
      fullName: updated.fullName,
      email: updated.email,
      specialty: updated.specialty,
      role: updated.role,
    });
    setTrainers((prev) => prev.map((item) => (item.id === id ? updated : item)));
    setNotice("อัปเดต trainer แล้ว");
  };

  const handleCreateTrainer = async () => {
    if (!newTrainer.fullName.trim() || !newTrainer.email.trim()) return;
    const res = await createAdminTrainer(newTrainer);
    setTrainers((prev) => [...prev, res.data]);
    setNewTrainer(emptyTrainer);
    setNotice("เพิ่ม trainer ใหม่แล้ว");
  };

  if (loading) return <div style={{ padding: 24 }}>กำลังโหลดข้อมูล...</div>;
  if (!user || user.role !== "ADMIN") return <div style={{ padding: 24 }}>ไม่มีสิทธิ์เข้าถึง</div>;

  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <main className="control-page admin-control-page">
        <section className="control-shell">
          <header className="control-hero admin-hero">
            <div className="control-hero-copy">
              <span className="control-tag">Palm control room</span>
              <h1>Admin Management</h1>
              <p>ขยายหลังบ้านให้คุมสมาชิก แพ็กเกจ trainer การสมัคร และรายการชำระเงินในสไตล์ที่ใกล้ภาพอ้างอิงมากขึ้น</p>
            </div>
            <div className="control-ribbon-card">
              <span>Signed in as</span>
              <strong>{user.fullName}</strong>
              <small>{user.email}</small>
            </div>
          </header>

          <div className="control-tabbar">
            {tabs.map((tab) => (
              <button key={tab} type="button" className={tab === activeTab ? "active" : ""} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {notice && <div className="control-notice">{notice}</div>}

          <section className="control-metric-grid">
            <article className="control-metric-card"><span>Members</span><strong>{summaryMap.Members || members.length}</strong></article>
            <article className="control-metric-card"><span>Trainers</span><strong>{summaryMap.Trainers || trainers.length}</strong></article>
            <article className="control-metric-card"><span>Subscriptions</span><strong>{summaryMap.Subscriptions || subscriptions.length}</strong></article>
            <article className="control-metric-card accent"><span>Revenue</span><strong>฿{revenueValue}</strong></article>
          </section>

          {activeTab === "Overview" && (
            <section className="control-two-column">
              <article className="control-panel dark-panel">
                <div className="control-panel-head">
                  <div><span className="panel-kicker">Fresh activity</span><h2>Latest payments</h2></div>
                  <span>{payments.length} total</span>
                </div>
                <div className="schedule-list compact-list">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="schedule-item">
                      <div>
                        <strong>{payment.memberName}</strong>
                        <p>{payment.method}</p>
                      </div>
                      <div className="schedule-meta">
                        <span>฿{Number(payment.finalAmount).toLocaleString()}</span>
                        <small>{new Date(payment.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="control-panel">
                <div className="control-panel-head">
                  <div><span className="panel-kicker">Operations</span><h2>Live system snapshot</h2></div>
                </div>
                <div className="journey-step-grid">
                  <article className="journey-step-card"><span>01</span><h3>Members</h3><p>{members.length} accounts พร้อมให้แก้ role และข้อมูลติดต่อ</p></article>
                  <article className="journey-step-card"><span>02</span><h3>Trainers</h3><p>{trainers.length} coaches พร้อม specialty สำหรับการจับคู่ session</p></article>
                  <article className="journey-step-card"><span>03</span><h3>Plans</h3><p>{plans.length} แพ็กเกจที่พร้อมขายใน flow สมัครสมาชิก</p></article>
                </div>
              </article>
            </section>
          )}

          {activeTab === "Members" && (
            <section className="control-panel">
              <div className="control-panel-head"><div><span className="panel-kicker">Member management</span><h2>จัดการสมาชิก</h2></div></div>
              <div className="control-table-wrap">
                <table className="control-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th /></tr></thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id}>
                        <td><input value={member.fullName} onChange={(e) => handleMemberChange(member.id, "fullName", e.target.value)} /></td>
                        <td><input value={member.email} onChange={(e) => handleMemberChange(member.id, "email", e.target.value)} /></td>
                        <td><input value={member.phone} onChange={(e) => handleMemberChange(member.id, "phone", e.target.value)} /></td>
                        <td><select value={member.role} onChange={(e) => handleMemberChange(member.id, "role", e.target.value)}><option value="MEMBER">MEMBER</option><option value="TRAINER">TRAINER</option><option value="ADMIN">ADMIN</option></select></td>
                        <td><button type="button" className="table-action-button danger" onClick={() => handleDeleteMember(member.id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "Plans" && (
            <section className="control-panel">
              <div className="control-panel-head"><div><span className="panel-kicker">Plan management</span><h2>จัดการแพ็กเกจ</h2></div></div>
              <div className="control-create-grid">
                <input placeholder="Plan name" value={newPlan.planName} onChange={(e) => setNewPlan({ ...newPlan, planName: e.target.value })} />
                <input type="number" placeholder="Days" value={newPlan.durationDays} onChange={(e) => setNewPlan({ ...newPlan, durationDays: Number(e.target.value) })} />
                <input type="number" placeholder="Price" value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })} />
                <input type="number" placeholder="Sessions" value={newPlan.maxSessionsPerMonth} onChange={(e) => setNewPlan({ ...newPlan, maxSessionsPerMonth: Number(e.target.value) })} />
                <button type="button" className="membership-submit" onClick={handleCreatePlan}>Add plan</button>
              </div>
              <div className="control-table-wrap">
                <table className="control-table">
                  <thead><tr><th>Name</th><th>Duration</th><th>Price</th><th>Sessions</th></tr></thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan.id}>
                        <td><input value={plan.planName} onChange={(e) => handlePlanChange(plan.id, "planName", e.target.value)} /></td>
                        <td><input type="number" value={plan.durationDays} onChange={(e) => handlePlanChange(plan.id, "durationDays", Number(e.target.value))} /></td>
                        <td><input type="number" value={plan.price} onChange={(e) => handlePlanChange(plan.id, "price", Number(e.target.value))} /></td>
                        <td><input type="number" value={plan.maxSessionsPerMonth} onChange={(e) => handlePlanChange(plan.id, "maxSessionsPerMonth", Number(e.target.value))} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "Trainers" && (
            <section className="control-panel">
              <div className="control-panel-head"><div><span className="panel-kicker">Trainer management</span><h2>จัดการ trainer</h2></div></div>
              <div className="control-create-grid trainer-create-grid">
                <input placeholder="Full name" value={newTrainer.fullName} onChange={(e) => setNewTrainer({ ...newTrainer, fullName: e.target.value })} />
                <input placeholder="Email" value={newTrainer.email} onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })} />
                <input placeholder="Specialty" value={newTrainer.specialty} onChange={(e) => setNewTrainer({ ...newTrainer, specialty: e.target.value })} />
                <input placeholder="Password" value={newTrainer.password} onChange={(e) => setNewTrainer({ ...newTrainer, password: e.target.value })} />
                <button type="button" className="membership-submit" onClick={handleCreateTrainer}>Add trainer</button>
              </div>
              <div className="trainer-grid">
                {trainers.map((trainer) => (
                  <article key={trainer.id} className="trainer-card admin-trainer-card">
                    <div className="trainer-avatar">{trainer.fullName.charAt(0).toUpperCase()}</div>
                    <input value={trainer.fullName} onChange={(e) => handleTrainerChange(trainer.id, "fullName", e.target.value)} />
                    <input value={trainer.email} onChange={(e) => handleTrainerChange(trainer.id, "email", e.target.value)} />
                    <input value={trainer.specialty} onChange={(e) => handleTrainerChange(trainer.id, "specialty", e.target.value)} />
                    <select value={trainer.role} onChange={(e) => handleTrainerChange(trainer.id, "role", e.target.value)}>
                      <option value="TRAINER">TRAINER</option>
                    </select>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === "Subscriptions" && (
            <section className="control-panel">
              <div className="control-panel-head"><div><span className="panel-kicker">Subscription visibility</span><h2>รายการสมัครแพ็กเกจ</h2></div></div>
              <div className="control-table-wrap">
                <table className="control-table">
                  <thead><tr><th>Member</th><th>Plan</th><th>Status</th><th>Remaining</th><th>Period</th></tr></thead>
                  <tbody>
                    {subscriptions.map((subscription) => (
                      <tr key={subscription.id}>
                        <td>{subscription.memberName}</td>
                        <td>{subscription.planName}</td>
                        <td><span className={`status-chip ${subscription.status.toLowerCase()}`}>{subscription.status}</span></td>
                        <td>{subscription.remainingSessions}</td>
                        <td>{subscription.startDate} - {subscription.endDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "Payments" && (
            <section className="control-panel">
              <div className="control-panel-head"><div><span className="panel-kicker">Payment records</span><h2>ประวัติการชำระเงิน</h2></div></div>
              <div className="control-table-wrap">
                <table className="control-table">
                  <thead><tr><th>Member</th><th>Method</th><th>Amount</th><th>Discount</th><th>Final</th><th>Date</th></tr></thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.memberName}</td>
                        <td>{payment.method}</td>
                        <td>{Number(payment.amount).toLocaleString()}</td>
                        <td>{Number(payment.discountAmount).toLocaleString()}</td>
                        <td>{Number(payment.finalAmount).toLocaleString()}</td>
                        <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
