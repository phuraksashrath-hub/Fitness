import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
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

export const getCurrentUserFromToken = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  return {
    memberId: payload.sub || payload.nameid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "",
    fullName: payload.fullName || payload.name || "Member",
    email: payload.email || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "",
    role: payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "MEMBER",
  };
};

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