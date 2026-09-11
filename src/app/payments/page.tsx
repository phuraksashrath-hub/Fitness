"use client";

import { useState } from "react";
import api, { setAuthToken } from "@/lib/api";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PaymentPage() {
  const [form, setForm] = useState({
    memberId: "b23fe533-1241-454e-a7bf-0d49db15cbde",
    subscriptionId: "9f829af0-12a4-45e8-a973-ea6c4c3ffb39",
    amount: 1800,
    method: "CREDIT_CARD",
    discountType: "none",
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
        discountType: form.discountType,
      };

      const res = await api.post("/payments/process", payload);
      setMsg(`Paid! paymentId: ${res.data.id}, finalAmount: ${res.data.finalAmount}`);
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Payment failed");
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="form-card">
            <h2>Process Payment</h2>
            <p className="auth-subtitle">Complete a payment and apply the correct discount rule.</p>
            <form onSubmit={submit} className="form-grid">
              <div className="two-col">
                <input className="input" placeholder="Member ID" value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })} />
                <input className="input" placeholder="Subscription ID" value={form.subscriptionId} onChange={(e) => setForm({ ...form, subscriptionId: e.target.value })} />
              </div>
              <input className="input" placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />

              <div className="two-col">
                <select className="select" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="PROMPTPAY">PromptPay</option>
                </select>

                <select className="select" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                  <option value="none">No discount</option>
                  <option value="student">Student</option>
                  <option value="renewal">Renewal</option>
                </select>
              </div>

              <button className="form-btn" type="submit">Pay now</button>
            </form>
            <div className={`notice ${msg ? (msg.toLowerCase().includes("paid") ? "success" : "error") : ""}`}>{msg}</div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}