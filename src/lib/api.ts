import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

export type CurrentUser = {
  memberId: string;
  fullName: string;
  email: string;
  role: string;
};

export type DashboardMetric = {
  label: string;
  value: number;
};

export type MembershipPlan = {
  id: string;
  planName: string;
  durationDays: number;
  price: number;
  maxSessionsPerMonth: number;
};

export type SubscriptionSummary = {
  id: string;
  memberId: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: string;
  remainingSessions: number;
  price: number;
  durationDays: number;
};

export type TrainerSummary = {
  id: string;
  fullName: string;
  specialty: string;
};

export type SessionSummary = {
  id: string;
  memberId: string;
  trainerId: string;
  subscriptionId: string;
  trainerName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: string;
};

export type PaymentSummary = {
  id: string;
  memberId: string;
  subscriptionId?: string | null;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  method: string;
  createdAt: string;
};

export type AdminMember = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
};

export type AdminTrainer = {
  id: string;
  fullName: string;
  email: string;
  specialty: string;
  role: string;
};

export type AdminSubscription = {
  id: string;
  memberName: string;
  planName: string;
  status: string;
  remainingSessions: number;
  startDate: string;
  endDate: string;
};

export type AdminPayment = {
  id: string;
  memberName: string;
  method: string;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  createdAt: string;
};

export type TrainerDashboard = {
  trainerName: string;
  specialty: string;
  todaySessions: number;
  upcomingSessions: number;
  activeMembers: number;
  weeklyHours: number;
  upcomingSchedule: Array<{
    id: string;
    memberName: string;
    planName: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    status: string;
  }>;
  memberProgress: Array<{
    memberName: string;
    planName: string;
    remainingSessions: number;
    subscriptionStatus: string;
  }>;
};

export const setAuthToken = (token?: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = "Bearer " + token;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common.Authorization;
};

export const decodeJwtPayload = (token: string) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

export const getCurrentUserFromToken = (): CurrentUser | null => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  return {
    memberId:
      payload.sub ||
      payload.nameid ||
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      "",
    fullName: payload.fullName || payload.name || "Member",
    email: payload.email || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "",
    role: payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "MEMBER",
  };
};

export const getPublicPlans = () => api.get<MembershipPlan[]>("/subscriptions/plans");
export const createMemberSubscription = (data: { memberId: string; planId: string }) => api.post<SubscriptionSummary>("/subscriptions", data);
export const getMemberSubscriptions = (memberId: string) => api.get<SubscriptionSummary[]>("/subscriptions/me", { params: { memberId } });
export const getTrainers = () => api.get<TrainerSummary[]>("/sessions/trainers");
export const getTrainerDashboard = () => api.get<TrainerDashboard>("/trainers/dashboard");
export const bookMemberSession = (data: {
  memberId: string;
  trainerId: string;
  subscriptionId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
}) => api.post<SessionSummary>("/sessions/book", data);
export const getMemberSessions = (memberId: string) => api.get<SessionSummary[]>("/sessions/me", { params: { memberId } });
export const cancelMemberSession = (id: string) => api.put(`/sessions/${id}/cancel`);
export const rescheduleMemberSession = (id: string, data: { sessionDate: string; startTime: string; endTime: string }) =>
  api.put(`/sessions/${id}/reschedule`, data);
export const processMemberPayment = (data: {
  memberId: string;
  subscriptionId?: string | null;
  amount: number;
  method: string;
  discountType: string;
}) => api.post("/payments/process", data);
export const getMemberPayments = (memberId: string) => api.get<PaymentSummary[]>("/payments/me", { params: { memberId } });

export const getAdminSummary = () => api.get<DashboardMetric[]>("/admin/summary");
export const getAdminMembers = () => api.get<AdminMember[]>("/admin/members");
export const updateAdminMember = (id: string, data: Record<string, string>) => api.put<AdminMember>(`/admin/members/${id}`, data);
export const deleteAdminMember = (id: string) => api.delete(`/admin/members/${id}`);
export const getAdminPlans = () => api.get<MembershipPlan[]>("/admin/plans");
export const createAdminPlan = (data: Record<string, string | number>) => api.post<MembershipPlan>("/admin/plans", data);
export const updateAdminPlan = (id: string, data: Record<string, string | number>) => api.put<MembershipPlan>(`/admin/plans/${id}`, data);
export const getAdminTrainers = () => api.get<AdminTrainer[]>("/admin/trainers");
export const createAdminTrainer = (data: { fullName: string; email: string; password: string; specialty: string }) =>
  api.post<AdminTrainer>("/admin/trainers", data);
export const updateAdminTrainer = (id: string, data: { fullName: string; email: string; specialty: string; role: string }) =>
  api.put<AdminTrainer>(`/admin/trainers/${id}`, data);
export const getAdminSubscriptions = () => api.get<AdminSubscription[]>("/admin/subscriptions");
export const getAdminPayments = () => api.get<AdminPayment[]>("/admin/payments");

export default api;
