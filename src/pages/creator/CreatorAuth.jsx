import { useState } from 'react';
import { Link } from 'react-router-dom';
import { creatorSignup, creatorLogin } from '../../lib/creators';
import { validateName, validateEmail, validatePassword } from '../../lib/validation';

export default function CreatorAuth({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((fe) => ({ ...fe, [name]: '' }));
  };

  const validate = () => {
    const fe = {};
    if (isSignup) fe.name = validateName(form.name);
    fe.email = validateEmail(form.email);
    fe.password = validatePassword(form.password);
    Object.keys(fe).forEach((k) => !fe[k] && delete fe[k]);
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const body = isSignup
        ? { name: form.name.trim(), email: form.email.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password };
      const res = isSignup ? await creatorSignup(body) : await creatorLogin(body);
      onAuth(res.creator);
    } catch (err) {
      // map field-level errors from the API if present
      if (Array.isArray(err.errors)) {
        const fe = {};
        err.errors.forEach((x) => { fe[x.field] = x.message; });
        setFieldErrors((prev) => ({ ...prev, ...fe }));
      }
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setFieldErrors({});
  };

  return (
    <div className="min-h-screen bg-ink text-fg font-sans flex items-center justify-center px-5 relative overflow-hidden">
      <div className="aurora opacity-60" aria-hidden />

      <div className="relative w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8 select-none">
          <img src="/Logo.webp" alt="Divyan Technologies logo" width={32} height={32} className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-[15px] tracking-tight">Divyan<span className="grad-text">.tech</span></span>
        </Link>

        <div className="glass rounded-2xl p-7">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-full mb-6">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 font-sans text-[13px] font-semibold py-2 rounded-full transition-colors ${
                  mode === m ? 'bg-fg text-ink' : 'text-fg/70 hover:text-fg'
                }`}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <h1 className="font-display font-extrabold text-2xl tracking-tight mb-1">
            {isSignup ? 'Join as a creator' : 'Creator sign in'}
          </h1>
          <p className="font-sans text-[13px] text-mid mb-6">
            {isSignup ? 'Start your application in seconds.' : 'Access your creator dashboard.'}
          </p>

          <form onSubmit={submit} noValidate className="space-y-4">
            {isSignup && (
              <AuthField label="Full name" name="name" value={form.name} onChange={onChange}
                placeholder="RJVR" autoComplete="name" error={fieldErrors.name} />
            )}
            <AuthField label="Email" name="email" type="email" value={form.email} onChange={onChange}
              placeholder="you@example.com" autoComplete={isSignup ? 'email' : 'username'} error={fieldErrors.email} />
            <AuthField label="Password" name="password" type="password" value={form.password} onChange={onChange}
              placeholder={isSignup ? 'At least 8 characters' : '••••••••'}
              autoComplete={isSignup ? 'new-password' : 'current-password'} error={fieldErrors.password} />

            {error && (
              <p role="alert" className="text-[13px] text-red-300 border border-red-400/30 bg-red-400/10 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-sans text-sm font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-6 py-3.5 rounded-full transition-colors duration-300 shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>
        </div>

        <Link to="/" className="block text-center mt-5 font-sans text-[12px] text-soft hover:text-fg transition-colors">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}

function AuthField({ label, name, value, onChange, type = 'text', placeholder, autoComplete, error }) {
  return (
    <div>
      <label htmlFor={`auth-${name}`} className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">{label}</label>
      <input
        id={`auth-${name}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={`w-full bg-white/5 border rounded-xl px-4 py-3 font-sans text-[14px] text-fg placeholder:text-soft focus:outline-none transition-colors ${
          error ? 'border-red-400/50 focus:border-red-400' : 'border-line focus:border-indigo'
        }`}
      />
      {error && <p className="mt-1.5 font-sans text-[12px] text-red-300">{error}</p>}
    </div>
  );
}
