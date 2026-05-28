import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, setToken } from '../../lib/api';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api('/api/auth/login', { method: 'POST', body: { email, password } });
      setToken(res.token);
      onLogin();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden">
      <div className="aurora opacity-60" aria-hidden />

      <div className="relative w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8 select-none">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo to-cyan shadow-glow">
            <span className="font-display font-extrabold text-ink text-[15px]">D</span>
          </span>
          <span className="font-display font-bold text-[15px] tracking-tight">Divyan<span className="grad-text">.tech</span></span>
        </Link>

        <form onSubmit={submit} className="glass rounded-2xl p-7">
          <h1 className="font-display font-extrabold text-2xl tracking-tight mb-1">Admin sign in</h1>
          <p className="font-sans text-[13px] text-mid mb-6">Manage your team roster.</p>

          <div className="space-y-4">
            <div>
              <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rjvr.com"
                autoComplete="username"
                required
                className="w-full bg-white/5 border border-line rounded-xl px-4 py-3 font-sans text-[14px] text-fg placeholder:text-soft focus:outline-none focus:border-indigo transition-colors"
              />
            </div>
            <div>
              <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full bg-white/5 border border-line rounded-xl px-4 py-3 font-sans text-[14px] text-fg placeholder:text-soft focus:outline-none focus:border-indigo transition-colors"
              />
            </div>

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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>

        <Link to="/" className="block text-center mt-5 font-sans text-[12px] text-soft hover:text-fg transition-colors">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
