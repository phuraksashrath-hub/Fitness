"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  createAdminPlan,
  deleteAdminMember,
  getAdminMembers,
  getAdminPlans,
  getAdminSummary,
  getCurrentUserFromToken,
  updateAdminMember,
  updateAdminPlan,
} from "@/lib/api";

const emptyPlan = {
  planName: "",
  durationDays: 30,
  price: 1990,
  maxSessionsPerMonth: 12,
};

export default function AdminPage() {
  const [user, setUser] = useState<{ fullName: string; email: string; role: string } | null>(null);
  const [summary, setSummary] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [newPlan, setNewPlan] = useState(emptyPlan);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("Overview");
  const [chartTooltip, setChartTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

  const loadAdminData = async () => {
    try {
      const [summaryRes, membersRes, plansRes] = await Promise.all([
        getAdminSummary(),
        getAdminMembers(),
        getAdminPlans(),
      ]);
      setSummary(summaryRes.data || []);
      setMembers(membersRes.data || []);
      setPlans(plansRes.data || []);
    } catch (error) {
      console.error("Admin load failed", error);
    }
  };

  useEffect(() => {
    const currentUser = getCurrentUserFromToken();
    setUser(currentUser);

    loadAdminData().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const sections = ["Overview", "Members", "Plans", "Activity"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: "-15% 0px -45% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleMemberChange = async (id: string, field: string, value: string) => {
    const member = members.find((x) => x.id === id);
    if (!member) return;

    const updated = { ...member, [field]: value };
    await updateAdminMember(id, updated);
    setMembers((prev) => prev.map((x) => (x.id === id ? updated : x)));
  };

  const handleDeleteMember = async (id: string) => {
    await deleteAdminMember(id);
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const handlePlanChange = async (id: string, field: string, value: string | number) => {
    const plan = plans.find((x) => x.id === id);
    if (!plan) return;

    const updated = { ...plan, [field]: value };
    await updateAdminPlan(id, updated);
    setPlans((prev) => prev.map((x) => (x.id === id ? updated : x)));
  };

  const handleCreatePlan = async () => {
    if (!newPlan.planName.trim()) return;

    const result = await createAdminPlan(newPlan);
    setPlans((prev) => [...prev, result.data]);
    setNewPlan(emptyPlan);
  };

  if (loading) return <div style={{ padding: 24 }}>กำลังโหลดข้อมูล...</div>;

  if (!user || user.role !== "ADMIN") {
    return <div style={{ padding: 24 }}>ไม่มีสิทธิ์เข้าถึง: สำหรับผู้ดูแลระบบเท่านั้น</div>;
  }

  const summaryCards = summary.length
    ? summary.map((item) => ({
        label: item.label === "Members" ? "MEMBERS" : item.label === "Plans" ? "PLANS" : "SUBSCRIPTIONS",
        value: item.value,
      }))
    : [
        { label: "MEMBERS", value: members.length },
        { label: "PLANS", value: plans.length },
        { label: "SUBSCRIPTIONS", value: 0 },
      ];

  const monthlyRevenue = plans.reduce((total, plan) => total + (Number(plan.price) || 0), 0);

  const statCards = [
    {
      label: "MEMBERS",
      value: members.length,
      change: "+12.4%",
      subtitle: "member growth",
      progress: 76,
      icon: "◎",
      accent: "#f12745",
    },
    {
      label: "PLANS",
      value: plans.length,
      change: "+2 new",
      subtitle: "active packages",
      progress: 64,
      icon: "◇",
      accent: "#d3a75b",
    },
    {
      label: "REVENUE",
      value: `฿${monthlyRevenue.toLocaleString()}`,
      change: "+18.2%",
      subtitle: "this month",
      progress: 82,
      icon: "◈",
      accent: "#b28b60",
    },
  ];

  const recentMembers = (members.slice(0, 4) as any[]).map((member, index) => ({
    name: member.fullName || "Unknown member",
    role: member.role || "MEMBER",
    plan: plans[index]?.planName || "Premium",
    status: index % 2 === 0 ? "Active" : index % 3 === 0 ? "New" : "Review",
  }));

  const sidebarItems = [
    { key: "Overview", label: "ภาพรวม", icon: "⌂" },
    { key: "Members", label: "สมาชิก", icon: "◉" },
    { key: "Plans", label: "แพ็กเกจ", icon: "▣" },
    { key: "Activity", label: "กิจกรรม", icon: "◌" },
  ];

  const chartMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const weeklyTraffic = [42, 55, 49, 68, 72, 80, 92];
  const monthlyBars = [38, 52, 46, 74, 67, 81, 92, 76];
  const lineSeries = [
    { label: "Members", values: [28, 32, 38, 46, 58, 68, 74, 82], color: "#f12745" },
    { label: "Revenue", values: [16, 18, 24, 29, 35, 41, 49, 56], color: "#d9aa68" },
  ];

  const handleSidebarClick = (key: string) => {
    setActiveSection(key);
    document.getElementById(key)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const buildLinePath = (values: number[], width: number, height: number, padding: number) => {
    const min = 0;
    const max = 100;
    const stepX = (width - padding * 2) / (values.length - 1);

    return values
      .map((value, index) => {
        const x = padding + index * stepX;
        const y = height - padding - ((value - min) / (max - min || 1)) * (height - padding * 2);
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0d0d0f 0%, #121214 100%)", display: "flex", color: "#111111" }}>
        <aside style={{ position: "sticky", top: 20, alignSelf: "flex-start", width: 240, height: "calc(100vh - 40px)", background: "linear-gradient(180deg, #171719 0%, #0d0d0f 100%)", color: "#fff", padding: "22px 16px", borderRight: "1px solid rgba(255,255,255,0.08)", boxShadow: "18px 0 40px rgba(15,15,16,0.22)", borderRadius: "0 20px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 8px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 18 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: "linear-gradient(135deg, #e2b765 0%, #b98d42 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, color: "#111", boxShadow: "0 12px 22px rgba(226,183,101,0.25)" }}>P</div>
            <div>
              <div style={{ fontWeight: 900, letterSpacing: 0.5, fontSize: 17 }}>Palm</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.68)", letterSpacing: 0.8 }}>24 hour fitness</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 12, marginBottom: 18, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #e2b765 0%, #b98d42 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#111", boxShadow: "0 8px 18px rgba(226,183,101,0.28)" }}>{user.fullName.charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{user.fullName}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{user.role}</div>
            </div>
          </div>

          <nav style={{ display: "grid", gap: 8 }}>
            {sidebarItems.map((item) => {
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSidebarClick(item.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    border: isActive ? "1px solid rgba(217,170,104,0.28)" : "1px solid transparent",
                    borderRadius: 12,
                    padding: "11px 12px",
                    background: isActive ? "linear-gradient(90deg, rgba(217,170,104,0.18) 0%, rgba(255,255,255,0.05) 100%)" : "transparent",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.78)",
                    fontSize: 15,
                    fontWeight: 700,
                    textAlign: "left",
                    cursor: "pointer",
                    boxShadow: isActive ? "inset 0 0 0 1px rgba(217,170,104,0.1), 0 12px 18px rgba(217,170,104,0.08)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? "rgba(217,170,104,0.12)" : "rgba(255,255,255,0.04)", color: isActive ? "#f7d7a1" : "rgba(255,255,255,0.7)", fontSize: 12 }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main style={{ flex: 1, padding: "26px 28px 40px" }}>
          <div style={{ maxWidth: 1290, margin: "0 auto" }}>
            <header style={{ position: "sticky", top: 0, zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, padding: "14px 18px 12px", marginBottom: 22, background: "rgba(240,239,238,0.78)", border: "1px solid rgba(17,17,17,0.06)", borderRadius: 22, boxShadow: "0 16px 30px rgba(17,17,17,0.08)", backdropFilter: "blur(12px)" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.8, color: "#b98d42", textTransform: "uppercase", marginBottom: 8 }}>PALM ADMIN</div>
                <h1 style={{ margin: 0, fontSize: 58, lineHeight: 0.9, letterSpacing: -3.2, fontWeight: 900, fontFamily: 'Georgia, "Times New Roman", serif', color: "#111" }}>Dashboard</h1>
              </div>

              <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.84) 0%, rgba(246,240,232,0.9) 100%)", border: "1px solid rgba(17,17,17,0.08)", borderRadius: 18, padding: "16px 20px", minWidth: 250, boxShadow: "0 18px 32px rgba(17,17,17,0.06)" }}>
                <div style={{ fontSize: 23, fontWeight: 800, lineHeight: 1.2, color: "#111" }}>{user.fullName}</div>
                <div style={{ color: "#666", fontSize: 15, marginTop: 2 }}>{user.email}</div>
              </div>
            </header>

            <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18, marginBottom: 28 }}>
              {statCards.map((item) => (
                <div key={item.label} style={{ background: "linear-gradient(135deg, #171718 0%, #131315 100%)", border: "1px solid rgba(226,183,101,0.18)", borderRadius: 24, padding: "22px 18px 18px", boxShadow: "0 18px 30px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.accent}1a`, border: `1px solid ${item.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", color: item.accent, fontWeight: 900, fontSize: 20 }}>{item.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#111", background: "linear-gradient(135deg, #e2b765 0%, #d9aa68 100%)", borderRadius: 999, padding: "6px 10px" }}>{item.change}</div>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, letterSpacing: 2.2, textTransform: "uppercase", fontWeight: 700 }}>{item.label}</div>
                  <div style={{ fontSize: 42, lineHeight: 1.1, fontWeight: 900, letterSpacing: -2, marginTop: 12, color: "#f7f4ef" }}>{item.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, marginTop: 8 }}>{item.subtitle}</div>
                  <div style={{ marginTop: 16, height: 8, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ width: `${item.progress}%`, height: "100%", background: "linear-gradient(90deg, #d9aa68 0%, #e2b765 40%, #f12745 100%)", borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </section>

            <section id="Overview" style={{ display: "grid", gridTemplateColumns: "1.65fr 0.95fr", gap: 22, marginBottom: 28, scrollMarginTop: 20 }}>
              <div style={{ background: "linear-gradient(135deg, #171718 0%, #111214 100%)", borderRadius: 24, padding: 20, border: "1px solid rgba(226,183,101,0.16)", boxShadow: "0 18px 30px rgba(0,0,0,0.18)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: 2.2, color: "#d9aa68", textTransform: "uppercase", fontWeight: 800 }}>Overview</div>
                    <h3 style={{ margin: "7px 0 0", fontSize: 26, fontWeight: 900, letterSpacing: -1.2, color: "#f3efe9" }}>Performance trend</h3>
                  </div>
                  <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                    {lineSeries.map((item) => (
                      <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: "#666" }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, display: "inline-block", boxShadow: `0 0 0 3px ${item.color}22` }} />
                        <span style={{ color: "#e9e1d3" }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ position: "relative", paddingTop: 6 }} onMouseLeave={() => setChartTooltip(null)}>
                  <svg viewBox="0 0 640 220" style={{ width: "100%", height: 220, display: "block" }}>
                    {[0, 25, 50, 75, 100].map((tick) => {
                      const y = 22 + (100 - tick) * 1.55;
                      return (
                        <g key={tick}>
                          <line x1={28} x2={612} y1={y} y2={y} stroke="rgba(17,17,17,0.08)" strokeWidth="1" />
                          <line x1={32} x2={32} y1={22} y2={178} stroke="rgba(17,17,17,0.05)" strokeWidth="1" />
                          <text x={4} y={y + 4} fill="#7a7a7a" fontSize="11" fontWeight="700">{tick}%</text>
                        </g>
                      );
                    })}

                    {lineSeries.map((series) => (
                      <path
                        key={series.label}
                        d={buildLinePath(series.values, 640, 220, 32)}
                        fill="none"
                        stroke={series.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}

                    {lineSeries.flatMap((series) =>
                      series.values.map((value, index) => {
                        const x = 32 + index * ((640 - 64) / (series.values.length - 1));
                        const y = 220 - 32 - ((value - 0) / (100 - 0 || 1)) * (220 - 64);
                        return (
                          <g key={`${series.label}-${index}`}>
                            <circle
                              cx={x}
                              cy={y}
                              r="5"
                              fill={series.color}
                              stroke="#fff"
                              strokeWidth="2"
                              onMouseEnter={(event) => {
                                const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                                const relativeX = ((event.clientX - (rect?.left ?? 0)) / (rect?.width ?? 1)) * 640;
                                const relativeY = ((event.clientY - (rect?.top ?? 0)) / (rect?.height ?? 1)) * 220;
                                setChartTooltip({ x: relativeX, y: relativeY, label: series.label, value });
                              }}
                              onMouseMove={(event) => {
                                const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                                const relativeX = ((event.clientX - (rect?.left ?? 0)) / (rect?.width ?? 1)) * 640;
                                const relativeY = ((event.clientY - (rect?.top ?? 0)) / (rect?.height ?? 1)) * 220;
                                setChartTooltip({ x: relativeX, y: relativeY, label: series.label, value });
                              }}
                              onMouseLeave={() => setChartTooltip(null)}
                              style={{ cursor: "pointer" }}
                            />
                          </g>
                        );
                      })
                    )}

                    {chartMonths.map((label, index) => (
                      <text key={label} x={32 + index * ((640 - 64) / 7)} y={208} fill="#7a7a7a" fontSize="11" fontWeight="700" textAnchor="middle">{label}</text>
                    ))}
                  </svg>

                  {chartTooltip && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${(chartTooltip.x / 640) * 100}%`,
                        top: `${(chartTooltip.y / 220) * 100}%`,
                        transform: "translate(-50%, -132%)",
                        background: "linear-gradient(135deg, rgba(17,17,17,0.97) 0%, rgba(20,20,20,0.9) 100%)",
                        color: "#fff",
                        padding: "10px 12px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        boxShadow: "0 18px 30px rgba(17,17,17,0.22)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        pointerEvents: "none",
                        minWidth: 116,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: lineSeries.find((series) => series.label === chartTooltip.label)?.color ?? "#f12745", display: "inline-block" }} />
                        <span style={{ textTransform: "uppercase", letterSpacing: 1.1, opacity: 0.8 }}>{chartTooltip.label}</span>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.8 }}>{chartTooltip.value}%</div>
                      <div style={{ opacity: 0.72, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" }}>Monthly trend</div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gap: 18 }}>
                <div style={{ background: "linear-gradient(135deg, #171718 0%, #0f0f10 100%)", color: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(226,183,101,0.12)", boxShadow: "0 16px 36px rgba(17,17,17,0.18)" }}>
                  <div style={{ fontSize: 12, letterSpacing: 2, color: "rgba(255,255,255,0.72)", textTransform: "uppercase", fontWeight: 800 }}>Club load</div>
                  <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginTop: 10 }}>84%</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", marginTop: 4 }}>Peak occupancy</div>
                  <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
                    {[
                      { label: "AM", value: 38 },
                      { label: "PM", value: 68 },
                      { label: "EVENING", value: 91 },
                    ].map((slot) => (
                      <div key={slot.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.72)", marginBottom: 4 }}>
                          <span>{slot.label}</span>
                          <span>{slot.value}%</span>
                        </div>
                        <div style={{ height: 7, borderRadius: 999, background: "rgba(255,255,255,0.10)", overflow: "hidden" }}>
                          <div style={{ width: `${slot.value}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #f12745 0%, #d3a75b 100%)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "linear-gradient(135deg, #141415 0%, #111214 100%)", borderRadius: 24, padding: 20, border: "1px solid rgba(226,183,101,0.12)", boxShadow: "0 16px 30px rgba(17,17,17,0.04)" }}>
                  <div style={{ fontSize: 12, letterSpacing: 2, color: "#d9aa68", textTransform: "uppercase", fontWeight: 800 }}>Monthly pulse</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, marginTop: 20 }}>
                    {monthlyBars.map((value, index) => (
                      <div key={index} style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", height: "100%" }}>
                        <div style={{ width: "100%", height: `${value}%`, borderRadius: "8px 8px 0 0", background: index % 2 === 0 ? "linear-gradient(180deg, #d9aa68 0%, #b28b60 100%)" : "linear-gradient(180deg, #f12745 0%, #d5102d 100%)" }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 22, marginBottom: 28 }}>
              <div style={{ background: "linear-gradient(135deg, #171718 0%, #121315 100%)", borderRadius: 24, padding: 20, border: "1px solid rgba(226,183,101,0.12)", boxShadow: "0 14px 28px rgba(17,17,17,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#f7f4ef" }}>Recent members</h3>
                  <span style={{ fontSize: 12, color: "#e5d8bf", fontWeight: 700, background: "rgba(217,170,104,0.08)", padding: "6px 10px", borderRadius: 999 }}>{members.length} total</span>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {recentMembers.map((member) => (
                    <div key={member.name} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center", padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(217,170,104,0.08)" }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #e2b765 0%, #b98d42 100%)", color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{member.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 800, color: "#f7f4ef" }}>{member.name}</div>
                        <div style={{ fontSize: 12, color: "#d3c8b8" }}>{member.plan} · {member.role}</div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: member.status === "Active" ? "#0e9f6e" : member.status === "New" ? "#d9aa68" : "#b28b60", background: member.status === "Active" ? "rgba(14,159,110,0.12)" : member.status === "New" ? "rgba(217,170,104,0.12)" : "rgba(178,139,96,0.12)", padding: "6px 8px", borderRadius: 999 }}>{member.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg, #f9f8f7 0%, #f1efee 100%)", borderRadius: 24, padding: 20, border: "1px solid rgba(17,17,17,0.06)", boxShadow: "0 14px 28px rgba(17,17,17,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Performance</h3>
                  <span style={{ fontSize: 12, color: "#666", fontWeight: 700 }}>This week</span>
                </div>
                <div style={{ display: "grid", gap: 14 }}>
                  {plans.slice(0, 3).map((plan, index) => (
                    <div key={plan.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontWeight: 700 }}>{plan.planName}</span>
                        <span style={{ color: "#666", fontWeight: 700 }}>{70 + index * 10}%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 999, background: "rgba(17,17,17,0.08)", overflow: "hidden" }}>
                        <div style={{ width: `${70 + index * 10}%`, height: "100%", borderRadius: 999, background: index % 2 === 0 ? "linear-gradient(90deg, #d5102d 0%, #f12745 100%)" : "linear-gradient(90deg, #b28b60 0%, #d3a75b 100%)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg, #1c1c1d 0%, #101011 100%)", color: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 16px 30px rgba(17,17,17,0.18)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Club usage</h3>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>Peak hours</span>
                </div>
                <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: -2, marginBottom: 6 }}>84%</div>
                <div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 18 }}>Occupancy today</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    { label: "6 AM–9 AM", percent: 38 },
                    { label: "12 PM–3 PM", percent: 64 },
                    { label: "5 PM–9 PM", percent: 91 },
                  ].map((slot) => (
                    <div key={slot.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.72)", marginBottom: 5 }}>
                        <span>{slot.label}</span>
                        <span>{slot.percent}%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
                        <div style={{ width: `${slot.percent}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #f12745 0%, #d3a75b 100%)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="Members" style={{ display: "grid", gridTemplateColumns: "1.28fr 0.92fr", gap: 28, scrollMarginTop: 20 }}>
              <div style={{ background: "#f5f4f3", borderRadius: 24, padding: 22, border: "1px solid rgba(17,17,17,0.06)", boxShadow: "0 12px 28px rgba(17,17,17,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <h2 style={{ margin: 0, fontSize: 36, letterSpacing: -1.6, fontWeight: 900, fontFamily: 'Georgia, "Times New Roman", serif' }}>Members</h2>
                  <span style={{ color: "#666", fontSize: 16, fontStyle: "italic" }}>Manage account roles</span>
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  {members.map((member) => (
                    <div key={member.id} style={{ display: "grid", gridTemplateColumns: "1.15fr 1.25fr 0.95fr 0.8fr 68px", gap: 10, alignItems: "center", border: "1px solid #dedad7", borderRadius: 14, padding: 10, background: "#f9f8f7" }}>
                      <input value={member.fullName} onChange={(e) => handleMemberChange(member.id, "fullName", e.target.value)} style={{ height: 46, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111" }} />
                      <input value={member.email} onChange={(e) => handleMemberChange(member.id, "email", e.target.value)} style={{ height: 46, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111" }} />
                      <input value={member.phone || "-"} onChange={(e) => handleMemberChange(member.id, "phone", e.target.value)} style={{ height: 46, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111" }} />
                      <select value={member.role} onChange={(e) => handleMemberChange(member.id, "role", e.target.value)} style={{ height: 46, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111" }}>
                        <option value="MEMBER">MEMBER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="TRAINER">TRAINER</option>
                      </select>
                      <button type="button" onClick={() => handleDeleteMember(member.id)} style={{ height: 46, background: "linear-gradient(135deg, #f12745 0%, #d5102d 100%)", color: "white", border: 0, borderRadius: 10, cursor: "pointer", fontWeight: 800, fontSize: 16, boxShadow: "0 8px 18px rgba(213,16,45,0.25)" }}>
                        ลบ
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div id="Plans" style={{ background: "#f5f4f3", borderRadius: 24, padding: 22, border: "1px solid rgba(17,17,17,0.06)", boxShadow: "0 12px 28px rgba(17,17,17,0.04)", scrollMarginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <h2 style={{ margin: 0, fontSize: 36, letterSpacing: -1.6, fontWeight: 900, fontFamily: 'Georgia, "Times New Roman", serif' }}>Plans</h2>
                  <span style={{ color: "#666", fontSize: 16, fontStyle: "italic" }}>จัดการราคา</span>
                </div>

                <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
                  {plans.map((plan) => (
                    <div key={plan.id} style={{ border: "1px solid #dedad7", borderRadius: 14, padding: 12, background: "#faf9f8" }}>
                      <input value={plan.planName} onChange={(e) => handlePlanChange(plan.id, "planName", e.target.value)} style={{ width: "100%", height: 52, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111", marginBottom: 10 }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <input type="number" value={plan.durationDays} onChange={(e) => handlePlanChange(plan.id, "durationDays", Number(e.target.value))} style={{ height: 52, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111" }} />
                        <input type="number" value={plan.price} onChange={(e) => handlePlanChange(plan.id, "price", Number(e.target.value))} style={{ height: 52, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111" }} />
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <input type="number" value={plan.maxSessionsPerMonth} onChange={(e) => handlePlanChange(plan.id, "maxSessionsPerMonth", Number(e.target.value))} style={{ width: "100%", height: 52, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111" }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid rgba(17,17,17,0.06)", paddingTop: 18 }}>
                  <h3 style={{ margin: "0 0 12px", fontSize: 24, fontWeight: 800 }}>สร้างแพ็กเกจใหม่</h3>
                  <div style={{ display: "grid", gap: 10 }}>
                    <input placeholder="ชื่อแพ็กเกจ" value={newPlan.planName} onChange={(e) => setNewPlan({ ...newPlan, planName: e.target.value })} style={{ height: 52, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <input type="number" placeholder="วัน" value={newPlan.durationDays} onChange={(e) => setNewPlan({ ...newPlan, durationDays: Number(e.target.value) })} style={{ height: 52, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111" }} />
                      <input type="number" placeholder="ราคา" value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })} style={{ height: 52, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111" }} />
                    </div>
                    <input type="number" placeholder="จำนวนครั้ง / เดือน" value={newPlan.maxSessionsPerMonth} onChange={(e) => setNewPlan({ ...newPlan, maxSessionsPerMonth: Number(e.target.value) })} style={{ height: 52, border: "1px solid #d9d4d1", borderRadius: 10, background: "#fff", padding: "0 12px", fontSize: 20, color: "#111" }} />
                    <button type="button" onClick={handleCreatePlan} style={{ height: 52, background: "linear-gradient(135deg, #f12745 0%, #d5102d 100%)", color: "white", border: 0, borderRadius: 12, cursor: "pointer", fontWeight: 800, fontSize: 18, boxShadow: "0 10px 18px rgba(213,16,45,0.25)" }}>
                      + สร้างแพ็กเกจ
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section id="Activity" style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 22, marginBottom: 28, scrollMarginTop: 20 }}>
              <div style={{ background: "linear-gradient(135deg, #171718 0%, #121315 100%)", borderRadius: 24, padding: 20, border: "1px solid rgba(226,183,101,0.12)", boxShadow: "0 14px 28px rgba(17,17,17,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#f7f4ef" }}>Recent members</h3>
                  <span style={{ fontSize: 12, color: "#e5d8bf", fontWeight: 700, background: "rgba(217,170,104,0.08)", padding: "6px 10px", borderRadius: 999 }}>{members.length} total</span>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {recentMembers.map((member) => (
                    <div key={member.name} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center", padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(217,170,104,0.08)" }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #e2b765 0%, #b98d42 100%)", color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{member.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 800, color: "#f7f4ef" }}>{member.name}</div>
                        <div style={{ fontSize: 12, color: "#d3c8b8" }}>{member.plan} · {member.role}</div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: member.status === "Active" ? "#0e9f6e" : member.status === "New" ? "#d9aa68" : "#b28b60", background: member.status === "Active" ? "rgba(14,159,110,0.12)" : member.status === "New" ? "rgba(217,170,104,0.12)" : "rgba(178,139,96,0.12)", padding: "6px 8px", borderRadius: 999 }}>{member.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg, #171718 0%, #121315 100%)", borderRadius: 24, padding: 20, border: "1px solid rgba(226,183,101,0.12)", boxShadow: "0 14px 28px rgba(17,17,17,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#f7f4ef" }}>Performance</h3>
                  <span style={{ fontSize: 12, color: "#d9aa68", fontWeight: 700 }}>This week</span>
                </div>
                <div style={{ display: "grid", gap: 14 }}>
                  {plans.slice(0, 3).map((plan, index) => (
                    <div key={plan.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, color: "#f7f4ef" }}>{plan.planName}</span>
                        <span style={{ color: "#d9aa68", fontWeight: 700 }}>{70 + index * 10}%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <div style={{ width: `${70 + index * 10}%`, height: "100%", borderRadius: 999, background: index % 2 === 0 ? "linear-gradient(90deg, #d9aa68 0%, #e2b765 100%)" : "linear-gradient(90deg, #b28b60 0%, #d9aa68 100%)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg, #1c1c1d 0%, #101011 100%)", color: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(217,170,104,0.12)", boxShadow: "0 16px 30px rgba(17,17,17,0.18)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Club usage</h3>
                  <span style={{ fontSize: 12, color: "#d9aa68", fontWeight: 700 }}>Peak hours</span>
                </div>
                <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: -2, marginBottom: 6 }}>84%</div>
                <div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 18 }}>Occupancy today</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    { label: "6 AM–9 AM", percent: 38 },
                    { label: "12 PM–3 PM", percent: 64 },
                    { label: "5 PM–9 PM", percent: 91 },
                  ].map((slot) => (
                    <div key={slot.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.72)", marginBottom: 5 }}>
                        <span>{slot.label}</span>
                        <span>{slot.percent}%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
                        <div style={{ width: `${slot.percent}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #d9aa68 0%, #e2b765 100%)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
