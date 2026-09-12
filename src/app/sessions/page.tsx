"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  cancelMemberSession,
  getCurrentUserFromToken,
  getMemberSessions,
  rescheduleMemberSession,
  SessionSummary,
  setAuthToken,
} from "@/lib/api";

const toTimeInput = (value: string) => value?.slice(0, 5) || "09:00";
const badgeClass = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "booked") return "confirmed";
  if (normalized === "cancelled") return "cancelled";
  if (normalized === "completed") return "completed";
  return "pending";
};

export default function SessionsPage() {
  const [memberId, setMemberId] = useState("");
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ sessionDate: "", startTime: "09:00", endTime: "10:00" });

  const loadSessions = async (currentMemberId: string) => {
    const res = await getMemberSessions(currentMemberId);
    setSessions(res.data || []);
  };

  useEffect(() => {
    const user = getCurrentUserFromToken();
    const token = localStorage.getItem("token");
    if (!user?.memberId) return;

    setMemberId(user.memberId);
    setAuthToken(token);
    loadSessions(user.memberId)
      .catch(() => setMsg("ไม่สามารถโหลดรายการ session ได้"))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = useMemo(() => sessions.filter((item) => item.status === "BOOKED").length, [sessions]);
  const completed = useMemo(() => sessions.filter((item) => item.status === "COMPLETED").length, [sessions]);
  const cancelled = useMemo(() => sessions.filter((item) => item.status === "CANCELLED").length, [sessions]);

  const handleCancel = async (id: string) => {
    try {
      await cancelMemberSession(id);
      await loadSessions(memberId);
      setMsg("ยกเลิก session สำเร็จ");
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "ยกเลิก session ไม่สำเร็จ");
    }
  };

  const startEditing = (session: SessionSummary) => {
    setEditingId(session.id);
    setDraft({
      sessionDate: session.sessionDate,
      startTime: toTimeInput(session.startTime),
      endTime: toTimeInput(session.endTime),
    });
  };

  const handleReschedule = async (id: string) => {
    try {
      await rescheduleMemberSession(id, draft);
      await loadSessions(memberId);
      setEditingId(null);
      setMsg("เลื่อนเวลา session สำเร็จ");
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "เลื่อนเวลาไม่สำเร็จ");
    }
  };

  return (
    <ProtectedRoute roles={["MEMBER"]}>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-row">
            <div>
              <p className="eyebrow">Training schedule</p>
              <h1 className="page-title">My Sessions</h1>
            </div>
            <Link className="form-btn secondary" href="/sessions/book">+ Book a session</Link>
          </div>

          <div className="metrics-grid">
            <div className="metric-card accent">
              <span>Upcoming</span>
              <strong>{upcoming}</strong>
            </div>
            <div className="metric-card">
              <span>Completed</span>
              <strong>{completed}</strong>
            </div>
            <div className="metric-card">
              <span>Cancelled</span>
              <strong>{cancelled}</strong>
            </div>
          </div>

          <div className={`notice ${msg ? (msg.includes("สำเร็จ") ? "success" : "error") : ""}`}>{msg}</div>

          <div className="table-card">
            <div className="table-header">
              <h2>Booking history</h2>
              <span>{sessions.length} รายการ</span>
            </div>

            {loading ? (
              <p>กำลังโหลดข้อมูล...</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Trainer</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.length > 0 ? sessions.map((session) => (
                    <Fragment key={session.id}>
                      <tr>
                        <td>{session.sessionDate}</td>
                        <td>{toTimeInput(session.startTime)} - {toTimeInput(session.endTime)}</td>
                        <td>{session.trainerName}</td>
                        <td><span className={`status-pill ${badgeClass(session.status)}`}>{session.status}</span></td>
                        <td>
                          <div className="table-actions">
                            <button type="button" className="table-action-button" onClick={() => startEditing(session)} disabled={session.status !== "BOOKED"}>
                              Reschedule
                            </button>
                            <button type="button" className="table-action-button danger" onClick={() => handleCancel(session.id)} disabled={session.status !== "BOOKED"}>
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                      {editingId === session.id && (
                        <tr key={`${session.id}-editor`}>
                          <td colSpan={5}>
                            <div className="inline-editor">
                              <input className="input" type="date" value={draft.sessionDate} onChange={(e) => setDraft({ ...draft, sessionDate: e.target.value })} />
                              <input className="input" type="time" value={draft.startTime} onChange={(e) => setDraft({ ...draft, startTime: e.target.value })} />
                              <input className="input" type="time" value={draft.endTime} onChange={(e) => setDraft({ ...draft, endTime: e.target.value })} />
                              <button type="button" className="form-btn" onClick={() => handleReschedule(session.id)}>Save</button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )) : (
                    <tr>
                      <td colSpan={5}>ยังไม่มี session ที่จองไว้</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
