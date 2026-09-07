"use client";

import { useState } from "react";
import api, { setAuthToken } from "@/lib/api";

export default function BookSessionPage() {
  const [form, setForm] = useState({
    memberId: "",
    trainerId: "",
    subscriptionId: "",
    sessionDate: "",
    startTime: "",
    endTime: ""
  });
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) setAuthToken(token);

      const res = await api.post("/sessions/book", form);
      setMsg(`Booked! sessionId: ${res.data.id}`);
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Book Trainer Session</h1>
      <form onSubmit={submit}>
        <input placeholder="Member ID" value={form.memberId} onChange={e => setForm({ ...form, memberId: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input placeholder="Trainer ID" value={form.trainerId} onChange={e => setForm({ ...form, trainerId: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input placeholder="Subscription ID" value={form.subscriptionId} onChange={e => setForm({ ...form, subscriptionId: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input type="date" value={form.sessionDate} onChange={e => setForm({ ...form, sessionDate: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <button type="submit">Book</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}