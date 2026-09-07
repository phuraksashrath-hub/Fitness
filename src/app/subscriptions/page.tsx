"use client";

import { useState } from "react";
import api, { setAuthToken } from "@/lib/api";

export default function SubscriptionPage() {
  const [memberId, setMemberId] = useState("");
  const [planId, setPlanId] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) setAuthToken(token);

      const res = await api.post("/subscriptions", { memberId, planId });
      setMsg(`Subscribed! subscriptionId: ${res.data.id}`);
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Subscribe failed");
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Subscribe Membership</h1>
      <form onSubmit={submit}>
        <input placeholder="Member ID (UUID)" value={memberId} onChange={e => setMemberId(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
        <input placeholder="Plan ID (UUID)" value={planId} onChange={e => setPlanId(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
        <button type="submit">Subscribe</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}