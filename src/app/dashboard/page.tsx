"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api, { getCurrentUserFromToken, clearAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";

const navItems = [
  "ภาพรวม",
  "สมาชิก",
  "ผู้ฝึกสอน",
  "รายรับ",
  "คลาส",
  "โปรโมชั่น",
  "รายงาน",
  "ตั้งค่า",
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; email: string; role: string; memberId: string } | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUserFromToken();
    setUser(currentUser);

    if (!currentUser?.memberId) {
      setLoading(false);
      return;
    }

    api
      .get("/sessions/me", { params: { memberId: currentUser.memberId } })
      .then((res) => setSessions(res.data || []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    clearAuthToken();
    router.push("/login");
  };

  const upcoming = sessions.filter((s) => s.status === "BOOKED").length;
  const completed = sessions.filter((s) => s.status === "COMPLETED").length;
  const totalMinutes = sessions.reduce((sum, s) => {
    const start = new Date(`2024-01-01T${s.startTime}`).getTime();
    const end = new Date(`2024-01-01T${s.endTime}`).getTime();
    return sum + Math.max(0, (end - start) / 60000);
  }, 0);

  return (
    <ProtectedRoute>
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">
            <span className="dashboard-brand-mark">P</span>
            <div>
              <strong>Palm</strong>
              <small>24 hour fitness</small>
            </div>
          </div>

          <div className="dashboard-profile-mini">
            <div className="dashboard-avatar">{user?.fullName?.charAt(0)?.toUpperCase() || "A"}</div>
            <div>
              <strong>{user?.fullName || "Member"}</strong>
              <small>{user?.role || "MEMBER"}</small>
            </div>
          </div>

          <nav className="dashboard-side-nav">
            {navItems.map((item, index) => (
              <button key={item} className={`dashboard-nav-item ${index === 0 ? "active" : ""}`} type="button">
                <span>{index === 0 ? "▣" : index === 1 ? "◉" : index === 2 ? "◎" : index === 3 ? "$" : index === 4 ? "▤" : index === 5 ? "✦" : index === 6 ? "◫" : "⚙"}</span>
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-topbar">
            <div className="dashboard-topbar-left">
              <button className="dashboard-menu-button" type="button">☰</button>
              <div>
                <small>แดชบอร์ด</small>
                <strong>ภาพรวมคลับ</strong>
              </div>
            </div>

            <div className="dashboard-user-area" onClick={logout} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && logout()}>
              <div className="dashboard-avatar small">{user?.fullName?.charAt(0)?.toUpperCase() || "A"}</div>
              <div>
                <strong>{user?.fullName || "Member"}</strong>
                <small>{user?.email || "member@palmfitness.com"}</small>
              </div>
              <span className="dashboard-logout">ออก</span>
            </div>
          </header>

          {loading ? (
            <div className="dashboard-empty-state">กำลังโหลดข้อมูล...</div>
          ) : (
            <>
              <section className="dashboard-stats-grid">
                <div className="dashboard-stat-card red">
                  <span>การจองล่วงหน้า</span>
                  <strong>{upcoming}</strong>
                  <small>เซสชันที่กำลังค้าง</small>
                </div>
                <div className="dashboard-stat-card green">
                  <span>การฝึกทั้งหมด</span>
                  <strong>{sessions.length}</strong>
                  <small>{completed} รายการเสร็จสิ้น</small>
                </div>
                <div className="dashboard-stat-card gray">
                  <span>เวลาฝึกรวม</span>
                  <strong>{Math.round(totalMinutes / 60)}h</strong>
                  <small>โดยประมาณ</small>
                </div>
                <div className="dashboard-stat-card dark">
                  <span>สเตตัส</span>
                  <strong>{user?.role || "MEMBER"}</strong>
                  <small>ออนไลน์</small>
                </div>
              </section>

              <section className="dashboard-content-grid">
                <div className="dashboard-panel large">
                  <div className="dashboard-panel-header">
                    <h3>สรุปผลงาน</h3>
                    <span>เดือนนี้</span>
                  </div>
                  <div className="dashboard-chart-bars" aria-label="Analytics chart">
                    {[48, 62, 56, 74, 90, 68, 82].map((height, index) => (
                      <span key={index} style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>

                <div className="dashboard-panel">
                  <div className="dashboard-panel-header">
                    <h3>กิจกรรมเร็ว</h3>
                    <span>วันนี้</span>
                  </div>
                  <ul className="dashboard-task-list">
                    <li><strong>09:30</strong> ตรวจสอบการชำระค่าบริการ</li>
                    <li><strong>11:15</strong> จัดสรรแผนฝึกสำหรับสมาชิกใหม่</li>
                    <li><strong>16:40</strong> อัปเดตความคืบหน้าของคลาส</li>
                  </ul>
                </div>
              </section>

              <section className="dashboard-footer-row">
                <div className="dashboard-panel slim">
                  <div className="dashboard-panel-header">
                    <h3>ผู้ใช้งานปัจจุบัน</h3>
                  </div>
                  <div className="dashboard-user-inline">
                    <span>{user?.fullName || "Loading..."}</span>
                    <small>{user?.role || "MEMBER"}</small>
                  </div>
                </div>

                <div className="dashboard-panel slim">
                  <div className="dashboard-panel-header">
                    <h3>เซสชันล่าสุด</h3>
                  </div>
                  <div className="dashboard-session-list">
                    {sessions.length > 0 ? (
                      sessions.slice(0, 3).map((session) => (
                        <div key={session.id} className="dashboard-session-item">
                          <strong>{session.status}</strong>
                          <small>{session.sessionDate || "-"} • {session.startTime || "-"}</small>
                        </div>
                      ))
                    ) : (
                      <span className="dashboard-empty-inline">ยังไม่มีข้อมูลเซสชัน</span>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}