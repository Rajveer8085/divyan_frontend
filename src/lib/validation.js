// Client-side validation mirroring the Creator API spec (§4 field reference).
// Each validator returns an error string, or '' when valid.

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
export const isHttpUrl = (v) => /^https?:\/\/.+/i.test(String(v).trim());

// ── Auth ────────────────────────────────────────────────
export const validateName = (v) => {
  const s = String(v || '').trim();
  if (!s) return 'Name is required.';
  if (s.length > 80) return 'Name must be 80 characters or fewer.';
  return '';
};

export const validateEmail = (v) => {
  const s = String(v || '').trim();
  if (!s) return 'Email is required.';
  if (!isEmail(s)) return 'Enter a valid email address.';
  return '';
};

export const validatePassword = (v) => {
  const s = String(v || '');
  if (!s) return 'Password is required.';
  if (s.length < 8) return 'Password must be at least 8 characters.';
  if (s.length > 128) return 'Password must be 128 characters or fewer.';
  return '';
};

// ── Profile · identity ──────────────────────────────────
export const validateFullLegalName = (v) =>
  String(v || '').length > 120 ? 'Legal name must be 120 characters or fewer.' : '';

export const validatePhone = (v) => {
  const s = String(v || '').trim();
  if (!s) return '';
  if (s.length < 6 || s.length > 20) return 'Phone must be 6–20 characters.';
  if (!/^[\d\s+().-]+$/.test(s)) return 'Phone may only contain digits, spaces and + ( ) - .';
  return '';
};

export const validateDateOfBirth = (v) => {
  const s = String(v || '').trim();
  if (!s) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return 'Use the format YYYY-MM-DD.';
  const dob = new Date(s);
  if (Number.isNaN(dob.getTime())) return 'Enter a valid date.';
  const now = new Date();
  const age = (now - dob) / (365.25 * 24 * 3600 * 1000);
  if (age < 18) return 'You must be at least 18 years old.';
  if (age > 100) return 'Date of birth cannot be more than 100 years ago.';
  return '';
};

export const maxLen = (v, n, label) =>
  String(v || '').length > n ? `${label} must be ${n} characters or fewer.` : '';

// ── Social profiles ─────────────────────────────────────
export const SOCIAL_PLATFORMS = ['instagram', 'youtube', 'linkedin', 'twitter', 'facebook', 'tiktok', 'other'];

export const validateSocialProfile = (sp) => {
  const errs = {};
  if (!sp.platform || !SOCIAL_PLATFORMS.includes(sp.platform)) errs.platform = 'Select a platform.';
  if (!sp.url || !isHttpUrl(sp.url)) errs.url = 'Enter a valid http(s):// URL.';
  if (sp.handle && String(sp.handle).length > 80) errs.handle = 'Handle ≤ 80 characters.';
  ['followerCount', 'avgLikes', 'avgComments', 'avgShares'].forEach((k) => {
    if (sp[k] !== '' && sp[k] != null) {
      const n = Number(sp[k]);
      if (!Number.isInteger(n) || n < 0) errs[k] = 'Must be a whole number ≥ 0.';
    }
  });
  return errs;
};

// ── Audience ────────────────────────────────────────────
export const AGE_RANGES = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+', 'mixed'];

export const validateGenderSplit = (gs = {}) => {
  const vals = ['male', 'female', 'other'].map((k) => Number(gs[k] || 0));
  if (vals.some((n) => n < 0 || n > 100)) return 'Each share must be between 0 and 100.';
  if (vals.reduce((a, b) => a + b, 0) > 100) return 'Gender split must total 100 or less.';
  return '';
};

export const validateEngagementRate = (v) => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  if (Number.isNaN(n) || n < 0 || n > 100) return 'Engagement rate must be 0–100%.';
  return '';
};

// ── Portfolio ───────────────────────────────────────────
export const validateUrlField = (v, label = 'URL') => {
  if (!v) return '';
  return isHttpUrl(v) ? '' : `${label} must be a valid http(s):// URL.`;
};

// ── Legal & commercial ──────────────────────────────────
export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
export const PAYOUT_METHODS = ['bank', 'upi', 'paypal'];

export const validatePan = (v) => {
  if (!v) return '';
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(v).toUpperCase())
    ? '' : 'PAN looks invalid (format: ABCDE1234F).';
};

export const validateGstin = (v) => {
  if (!v) return '';
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/.test(String(v).toUpperCase())
    ? '' : 'GSTIN looks invalid (15-character format).';
};

export const validateIfsc = (v) => {
  if (!v) return '';
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(String(v).toUpperCase())
    ? '' : 'IFSC looks invalid (format: HDFC0001234).';
};

export const validateUpi = (v) => {
  if (!v) return '';
  return /^[\w.-]+@[\w.-]+$/.test(String(v)) ? '' : 'UPI ID looks invalid (format: name@bank).';
};

export const validateBankAccountNumber = (v) => {
  if (!v) return '';
  return /^\d{6,20}$/.test(String(v)) ? '' : 'Account number must be 6–20 digits.';
};

export const validateMoney = (v, label = 'Rate') => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  if (Number.isNaN(n) || n < 0) return `${label} must be a number ≥ 0.`;
  return '';
};
