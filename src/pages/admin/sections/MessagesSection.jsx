import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

const fmtDate = (d) =>
  new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export default function MessagesSection({ onAuthError, onUnreadChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const unread = messages.filter((m) => !m.read).length;
  const guard = (err) => { if (err.status === 401 || err.status === 403 || /session|authentication|unauthor/i.test(err.message || '')) onAuthError?.(); };

  const load = async () => {
    setLoading(true);
    try {
      const res = await api('/api/contact', { auth: true });
      setMessages(res.data || []);
    } catch (err) { setError(err.message); guard(err); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => { onUnreadChange?.(unread); }, [unread, onUnreadChange]);

  const toggleRead = async (m) => {
    try {
      await api(`/api/contact/${m.id}`, { method: 'PATCH', body: { read: !m.read }, auth: true });
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: !x.read } : x)));
    } catch (err) { setError(err.message); guard(err); }
  };
  const deleteMessage = async (m) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api(`/api/contact/${m.id}`, { method: 'DELETE', auth: true });
      setMessages((prev) => prev.filter((x) => x.id !== m.id));
    } catch (err) { setError(err.message); guard(err); }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg tracking-tight">Contact enquiries</h2>
        <span className="font-mono text-[11px] text-soft">{messages.length} total · {unread} unread</span>
      </div>

      {error && <p className="mb-4 text-[13px] text-red-300 border border-red-400/30 bg-red-400/10 rounded-xl px-4 py-2.5">{error}</p>}

      {loading ? (
        <div className="glass rounded-2xl p-8 text-center text-soft font-sans text-sm">Loading…</div>
      ) : messages.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center text-soft font-sans text-sm">No enquiries yet.</div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={`glass rounded-2xl p-5 ${!m.read ? 'border-indigo/30' : ''}`}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-[15px] text-fg">{m.subject}</h3>
                    {!m.read && <span className="font-mono text-[9px] uppercase tracking-widest text-indigo bg-indigo/12 px-2 py-0.5 rounded-full">New</span>}
                  </div>
                  <p className="font-sans text-[12.5px] text-mid mt-0.5">
                    <span className="text-fg/90 font-medium">{m.name}</span> ·{' '}
                    <a href={`mailto:${m.email}`} className="hover:text-indigo transition-colors">{m.email}</a>
                    {m.phone ? <> · {m.phone}</> : null}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-soft whitespace-nowrap shrink-0">{fmtDate(m.createdAt)}</span>
              </div>

              <p className="font-sans text-[13.5px] text-fg/80 leading-relaxed whitespace-pre-wrap bg-white/5 border border-line rounded-xl px-4 py-3 mt-2">
                {m.message}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => toggleRead(m)} className="font-sans text-[12px] font-medium text-fg/80 hover:text-fg border border-line hover:border-indigo/40 px-3 py-1.5 rounded-full transition-colors">
                  {m.read ? 'Mark unread' : 'Mark read'}
                </button>
                <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="font-sans text-[12px] font-medium text-ink bg-fg hover:bg-indigo hover:text-fg px-3 py-1.5 rounded-full transition-colors">Reply</a>
                <button onClick={() => deleteMessage(m)} className="font-sans text-[12px] font-medium text-red-300 hover:text-red-200 border border-red-400/20 hover:border-red-400/50 px-3 py-1.5 rounded-full transition-colors ml-auto">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
