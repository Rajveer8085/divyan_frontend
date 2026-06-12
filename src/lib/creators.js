import { api } from './api';

// ── Creator (cookie-based session — never stores a token) ──────────────
export const creatorSignup = (body) =>
  api('/api/creators/signup', { method: 'POST', body, credentials: 'include' });

export const creatorLogin = (body) =>
  api('/api/creators/login', { method: 'POST', body, credentials: 'include' });

export const creatorLogout = () =>
  api('/api/creators/logout', { method: 'POST', credentials: 'include' });

export const creatorMe = () =>
  api('/api/creators/me', { credentials: 'include' });

export const creatorUpdateProfile = (partialFields) =>
  api('/api/creators/profile', { method: 'PUT', body: partialFields, credentials: 'include' });

// ── Admin (Bearer token — same auth as the rest of the admin panel) ────
export const adminListCreators = (status) =>
  api(`/api/creators${status ? `?status=${encodeURIComponent(status)}` : ''}`, { auth: true });

export const adminVetCreator = (id, fields) =>
  api(`/api/creators/${id}/vetting`, { method: 'PATCH', body: fields, auth: true });

export const adminDeleteCreator = (id) =>
  api(`/api/creators/${id}`, { method: 'DELETE', auth: true });

// Shared constants
export const CREATOR_STATUSES = ['pending', 'under_review', 'approved', 'rejected', 'suspended'];

export const STATUS_LABEL = {
  pending: 'Pending',
  under_review: 'Under review',
  approved: 'Approved',
  rejected: 'Rejected',
  suspended: 'Suspended',
};

// Tailwind classes for each status pill (uses existing theme tokens).
export const STATUS_STYLE = {
  pending:      'text-soft bg-white/5 border-line',
  under_review: 'text-cyan bg-cyan/10 border-cyan/30',
  approved:     'text-emerald bg-emerald/10 border-emerald/30',
  rejected:     'text-red-300 bg-red-400/10 border-red-400/30',
  suspended:    'text-violet bg-violet/10 border-violet/30',
};
