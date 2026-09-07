"use client";

import { useState } from "react";
import api, { setAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.accessToken;
      localStorage.setItem("token", token);
      setAuthToken(token);
      setMsg("Login success");
      router.push("/dashboard");
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Login</h1>
      <form onSubmit={onLogin}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
        <button type="submit">Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}