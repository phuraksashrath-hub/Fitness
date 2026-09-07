"use client";

import { useState } from "react";
import api, { setAuthToken } from "@/lib/api";

export default function PaymentPage() {
  const [form, setForm] = useState({
    memberId: "",
    subscriptionId: "",
    amount: 0,
    method: "CREDIT_CARD",
    discountType: "none"
  });
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) setAuthToken(token);

      const payload = {
        memberId: form.memberId,
        subscriptionId: form.subscriptionId || null,
        amount: Number(form.amount),
        method: form.method,
        discountType: form.discountType
      };

      const res = await api.post("/payments/process", payload);
      setMsg(`Paid! paymentId: ${res.data.id}, finalAmount: ${res.data.finalAmount}`);
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Process Payment</h1>
      <form onSubmit={submit}>
        <input placeholder="Member ID" value={form.memberId} onChange={e => setForm({ ...form, memberId: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input placeholder="Subscription ID (optional)" value={form.subscriptionId} onChange={e => setForm({ ...form, subscriptionId: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input placeholder="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} style={{ width: "100%", marginBottom: 8 }} />
        
        <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} style={{ width: "100%", marginBottom: 8 }}>
          <option value="CREDIT_CARD">CREDIT_CARD</option>
          <option value="PROMPTPAY">PROMPTPAY</option>
        </select>

        <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} style={{ width: "100%", marginBottom: 8 }}>
          <option value="none">none</option>
          <option value="student">student</option>
          <option value="renewal">renewal</option>
        </select>

        <button type="submit">Pay</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}