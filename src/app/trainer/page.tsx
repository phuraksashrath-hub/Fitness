"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  completeTrainerSession,
  getCurrentUserFromToken,
  getTrainerDashboard,
  saveTrainerSessionNotes,
  setAuthToken,
  TrainerDashboard,
} from "@/lib/api";

const formatTime = (value: string) => value?.slice(0, 5) || value;

export default function TrainerPage() {
  const [userName, setUserName] = useState("Trainer");
  const [dashboard, setDashboard] = useState<TrainerDashboard | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadDashboard = async () => {
    const res = await getTrainerDashboard();
    setDashboard(res.data);
    setNotesDraft(Object.fromEntries((res.data.upcomingSchedule || []).map((item) => [item.id, item.trainerNotes || ""])));
  };

  useEffect(() => {
    const user = getCurrentUserFromToken();
    setUserName(user?.fullName || "Trainer");
    setAuthToken(localStorage.getItem("token"));

    loadDashboard()
      .catch(() => setNotice("โหลดข้อมูล trainer ไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, []);

  const heroStats = useMemo(() => [
    { label: "วันนี้", value: dashboard?.todaySessions ?? 0 },
    { label: "นัดหมายล่วงหน้า", value: dashboard?.upcomingSessions ?? 0 },
    { label: "สมาชิกที่ดูแล", value: dashboard?.activeMembers ?? 0 },
    { label: "ชั่วโมงสัปดาห์นี้", value: dashboard?.weeklyHours ?? 0 },
  ], [dashboard]);

  const saveNotes = async (sessionId: string) => {
    try {
      setBusyId(sessionId);
      await saveTrainerSessionNotes(sessionId, notesDraft[sessionId] || "");
      await loadDashboard();
      setNotice("บันทึก notes แล้ว");
    } catch (err: any) {
      setNotice(err?.response?.data?.message || "บันทึก notes ไม่สำเร็จ");
    } finally {
      setBusyId(null);
    }
  };

  const markCompleted = async (sessionId: string) => {
    try {
      setBusyId(sessionId);
      await completeTrainerSession(sessionId, notesDraft[sessionId] || "");
      await loadDashboard();
      setNotice("อัปเดต session เป็น completed แล้ว");
    } catch (err: any) {
      setNotice(err?.response?.data?.message || "อัปเดต session ไม่สำเร็จ");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <ProtectedRoute roles={["TRAINER"]}>
      <main className="control-page trainer-control-page">
        <section className="control-shell trainer-shell">
          <header className="control-hero trainer-hero">
            <div className="control-hero-copy">
              <span className="control-tag">Trainer dashboard</span>
              <h1>{dashboard?.trainerName || userName}</h1>
              <p>
                {dashboard?.specialty || "General fitness"} • มองเห็นตารางสอน สมาชิกที่ดูแล และจัดการผลลัพธ์แต่ละ session ได้ในมุมมองเดียว
              </p>
              <div className="control-hero-actions">
                <Link href="/sessions/book" className="jets-join-btn">Book session</Link>
                <Link href="/login" className="control-secondary-link">Switch account</Link>
              </div>
            </div>
            <div className="control-ribbon-card">
              <span>Coach mode</span>
              <strong>Ready to lead</strong>
              <small>ใช้ demo trainer: coach.palm@palmfitness.com / trainer123</small>
            </div>
          </header>

          {notice && <div className="control-notice">{notice}</div>}

          <div className="control-metric-grid">
            {heroStats.map((item) => (
              <article key={item.label} className="control-metric-card trainer-metric-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          {loading ? (
            <div className="control-panel">กำลังโหลดข้อมูล...</div>
          ) : (
            <>
              <section className="control-two-column">
                <article className="control-panel dark-panel">
                  <div className="control-panel-head">
                    <div>
                      <span className="panel-kicker">Upcoming schedule</span>
                      <h2>ตารางสอนถัดไป</h2>
                    </div>
                    <span>{dashboard?.upcomingSchedule.length || 0} sessions</span>
                  </div>
                  <div className="schedule-list trainer-action-list">
                    {dashboard?.upcomingSchedule.length ? dashboard.upcomingSchedule.map((session) => (
                      <div key={session.id} className="schedule-item trainer-action-card">
                        <div className="trainer-action-header">
                          <div>
                            <strong>{session.memberName}</strong>
                            <p>{session.planName}</p>
                          </div>
                          <div className="schedule-meta">
                            <span>{session.sessionDate}</span>
                            <small>{formatTime(session.startTime)} - {formatTime(session.endTime)}</small>
                          </div>
                        </div>
                        <textarea
                          className="trainer-notes-input"
                          placeholder="เพิ่ม session note สำหรับสมาชิกคนนี้"
                          value={notesDraft[session.id] || ""}
                          onChange={(e) => setNotesDraft((prev) => ({ ...prev, [session.id]: e.target.value }))}
                        />
                        <div className="trainer-action-buttons">
                          <button type="button" className="table-action-button" onClick={() => saveNotes(session.id)} disabled={busyId === session.id}>
                            Save notes
                          </button>
                          <button type="button" className="membership-submit trainer-complete-button" onClick={() => markCompleted(session.id)} disabled={busyId === session.id}>
                            Mark completed
                          </button>
                        </div>
                      </div>
                    )) : <p>ยังไม่มีตารางสอนล่วงหน้า</p>}
                  </div>
                </article>

                <article className="control-panel">
                  <div className="control-panel-head">
                    <div>
                      <span className="panel-kicker">Member progress</span>
                      <h2>สมาชิกที่ดูแล</h2>
                    </div>
                    <span>{dashboard?.memberProgress.length || 0} people</span>
                  </div>
                  <div className="progress-list">
                    {dashboard?.memberProgress.length ? dashboard.memberProgress.map((member) => (
                      <div key={`${member.memberName}-${member.planName}`} className="progress-item">
                        <div>
                          <strong>{member.memberName}</strong>
                          <p>{member.planName}</p>
                        </div>
                        <div className="progress-badge-wrap">
                          <span className={`status-chip ${member.subscriptionStatus.toLowerCase()}`}>{member.subscriptionStatus}</span>
                          <small>{member.remainingSessions} sessions left</small>
                        </div>
                      </div>
                    )) : <p>ยังไม่มีข้อมูลสมาชิก</p>}
                  </div>
                </article>
              </section>

              <section className="control-panel">
                <div className="control-panel-head">
                  <div>
                    <span className="panel-kicker">Coach workflow</span>
                    <h2>สิ่งที่ trainer จัดการได้ตอนนี้</h2>
                  </div>
                </div>
                <div className="journey-step-grid">
                  <article className="journey-step-card">
                    <span>01</span>
                    <h3>ดู session วันนี้</h3>
                    <p>เช็กภาพรวมการสอนวันนี้และเตรียมสมาชิกแต่ละคนล่วงหน้า</p>
                  </article>
                  <article className="journey-step-card">
                    <span>02</span>
                    <h3>บันทึก session notes</h3>
                    <p>จดประเด็นสำคัญของสมาชิกแต่ละคนก่อนหรือหลังการเทรนได้ทันที</p>
                  </article>
                  <article className="journey-step-card">
                    <span>03</span>
                    <h3>mark completed</h3>
                    <p>ปิดงานหลังสอนเสร็จเพื่อให้ระบบแสดงสถานะผลลัพธ์ตรงกับการใช้งานจริง</p>
                  </article>
                </div>
              </section>
            </>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
