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
};

export const setAuthToken = (token?: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `******;
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

export const getAdminSummary = () => api.get("/admin/summary");
export const getAdminMembers = () => api.get("/admin/members");
export const getAdminMemberById = (id: string) => api.get(`/admin/members/${id}`);
export const getAdminMemberDetail = (id: string) => api.get(`/admin/members/${id}/detail`);
export const updateAdminMember = (id: string, data: Record<string, string>) => api.put(`/admin/members/${id}`, data);
export const deleteAdminMember = (id: string) => api.delete(`/admin/members/${id}`);
export const getAdminPlans = () => api.get("/admin/plans");
export const createAdminPlan = (data: Record<string, string | number>) => api.post("/admin/plans", data);
export const updateAdminPlan = (id: string, data: Record<string, string | number>) => api.put(`/admin/plans/${id}`, data);

export default api;
