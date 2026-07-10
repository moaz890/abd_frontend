// ─────────────────────────────────────────────────────────────────────────────
// lib/api.ts — API client helpers
// All fetch calls go through these functions.
// Typed stubs — logic will be filled in Phase 18.
// ─────────────────────────────────────────────────────────────────────────────

import type { Lead, LeadStatus, PaginatedLeads, SiteContent } from './types';

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/$/, '');

// ── Helpers ────────────────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('abd_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error ?? `HTTP ${res.status}`);
  }
  return json as T;
}

// ── Auth ───────────────────────────────────────────────────────────────────────
export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: { _id: string; username: string };
}

export async function loginAdmin(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<LoginResponse>(res);
}

// ── Leads ──────────────────────────────────────────────────────────────────────
export interface SubmitLeadPayload {
  fullName: string;
  phone: string;
  isQualified: boolean;
  state: string;
  monthlySalary: number;
  monthlyObligations?: number;
  hasRealEstateLoan?: boolean;
  workSector: string;
  serviceDuration: string;
}

export async function submitLead(payload: SubmitLeadPayload): Promise<{ lead: Lead }> {
  const res = await fetch(`${API_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ lead: Lead }>(res);
}

export async function getLeads(
  token: string,
  params?: { page?: number; status?: string; search?: string }
): Promise<PaginatedLeads> {
  const query = new URLSearchParams();
  if (params?.page)   query.set('page', String(params.page));
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${API_URL}/api/leads?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<PaginatedLeads>(res);
}

export async function updateLeadStatus(
  token: string,
  id: string,
  status: LeadStatus
): Promise<{ lead: Lead }> {
  const res = await fetch(`${API_URL}/api/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  return handleResponse<{ lead: Lead }>(res);
}

export async function deleteLead(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/leads/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? `HTTP ${res.status}`);
  }
}

// ── Content ────────────────────────────────────────────────────────────────────
export async function getContent(): Promise<SiteContent> {
  const res = await fetch(`${API_URL}/api/content`);
  return handleResponse<SiteContent>(res);
}

export async function updateContent(
  token: string,
  section: string,
  data: object
): Promise<{ content: SiteContent }> {
  const res = await fetch(`${API_URL}/api/content`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ section, data }),
  });
  return handleResponse<{ content: SiteContent }>(res);
}

export async function uploadContentImage(
  token: string,
  file: File,
  type?: string
): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  if (type) {
    formData.append('type', type);
  }

  const res = await fetch(`${API_URL}/api/content/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await handleResponse<{ url: string }>(res);
  return data.url;
}
