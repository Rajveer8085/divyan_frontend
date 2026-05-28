import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, assetUrl } from '../../lib/api';

const EMPTY = { id: null, name: '', role: '', tag: '', quote: '' };

const initialsOf = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || '?';

const fmtDate = (d) =>
  new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

function MiniAvatar({ member }) {
  if (member.img) {
    return <img src={assetUrl(member.img)} alt={member.name} className="w-12 h-12 rounded-xl object-cover" />;
  }
  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.grad || 'from-indigo to-cyan'} flex items-center justify-center font-display font-bold text-ink/85 text-sm`}>
      {member.initials || initialsOf(member.name)}
    </div>
  );
}

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('team');

  // Team state
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const fileRef = useRef(null);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);

  const editing = Boolean(form.id);
  const unread = messages.filter((m) => !m.read).length;

  const guard = (err) => { if (/session|authentication/i.test(err.message)) onLogout(); };

  // ── Team ──────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    try {
      const res = await api('/api/employees');
      setList(res.data || []);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onPhoto = (e) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };
  const resetForm = () => {
    setForm(EMPTY); setPhotoFile(null); setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };
  const startEdit = (m) => {
    setForm({ id: m.id, name: m.name, role: m.role, tag: m.tag || '', quote: m.quote || '' });
    setPhotoFile(null);
    setPhotoPreview(m.img ? assetUrl(m.img) : null);
    setError(''); setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(''); setNotice('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('role', form.role);
      fd.append('tag', form.tag);
      fd.append('quote', form.quote);
      if (photoFile) fd.append('photo', photoFile);

      if (editing) {
        await api(`/api/employees/${form.id}`, { method: 'PUT', body: fd, isForm: true, auth: true });
        setNotice('Member updated.');
      } else {
        await api('/api/employees', { method: 'POST', body: fd, isForm: true, auth: true });
        setNotice('Member added.');
      }
      resetForm();
      await load();
    } catch (err) { setError(err.message); guard(err); } finally { setSubmitting(false); }
  };
  const remove = async (m) => {
    if (!window.confirm(`Remove ${m.name}? This cannot be undone.`)) return;
    try {
      await api(`/api/employees/${m.id}`, { method: 'DELETE', auth: true });
      if (form.id === m.id) resetForm();
      await load();
    } catch (err) { setError(err.message); guard(err); }
  };

  // ── Messages ──────────────────────────────────────────
  const loadMessages = async () => {
    setMsgLoading(true);
    try {
      const res = await api('/api/contact', { auth: true });
      setMessages(res.data || []);
    } catch (err) { setError(err.message); guard(err); } finally { setMsgLoading(false); }
  };
  useEffect(() => { if (tab === 'messages') loadMessages(); /* eslint-disable-next-line */ }, [tab]);

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

  const TabBtn = ({ id, label, badge }) => (
    <button
      onClick={() => setTab(id)}
      className={`relative font-sans text-[13px] font-semibold px-4 py-2 rounded-full transition-colors ${
        tab === id ? 'bg-fg text-ink' : 'text-fg/70 hover:text-fg glass'
      }`}
    >
      {label}
      {badge > 0 && (
        <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-indigo text-fg text-[10px] font-bold align-middle">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="max-w-page mx-auto px-5 sm:px-6 md:px-10 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo to-cyan shadow-glow">
            <span className="font-display font-extrabold text-ink text-[15px]">D</span>
          </span>
          <div>
            <div className="font-display font-bold text-[15px] tracking-tight leading-none">Admin Console</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-soft mt-1">Divyan Technologies</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="font-sans text-[13px] font-medium text-fg/70 hover:text-fg glass px-4 py-2 rounded-full transition-colors">View site</Link>
          <button onClick={onLogout} className="font-sans text-[13px] font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-4 py-2 rounded-full transition-colors">Log out</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8">
        <TabBtn id="team" label="Team" />
        <TabBtn id="messages" label="Messages" badge={unread} />
      </div>

      {tab === 'team' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <section className="lg:col-span-5">
            <form onSubmit={submit} className="glass rounded-2xl p-6 lg:sticky lg:top-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-lg tracking-tight">{editing ? 'Edit member' : 'Add member'}</h2>
                {editing && <button type="button" onClick={resetForm} className="font-sans text-[12px] text-soft hover:text-fg transition-colors">+ New instead</button>}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="w-16 h-16 rounded-xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo to-cyan flex items-center justify-center font-display font-bold text-ink/85">{initialsOf(form.name)}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">Photo {editing && '(leave empty to keep current)'}</label>
                    <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto}
                      className="block w-full text-[12px] text-mid file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-fg file:text-ink hover:file:bg-indigo hover:file:text-fg file:cursor-pointer" />
                  </div>
                </div>

                <Field label="Full name" name="name" value={form.name} onChange={onChange} placeholder="Anil Kushwah" required />
                <Field label="Role" name="role" value={form.role} onChange={onChange} placeholder="Founder & CEO" required />
                <Field label="Tag" name="tag" value={form.tag} onChange={onChange} placeholder="Leadership" />
                <div>
                  <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">Quote</label>
                  <textarea name="quote" rows="3" value={form.quote} onChange={onChange} placeholder="A short personal quote…"
                    className="w-full bg-white/5 border border-line rounded-xl px-4 py-3 font-sans text-[14px] text-fg placeholder:text-soft focus:outline-none focus:border-indigo transition-colors resize-none" />
                </div>

                {error && <p className="text-[13px] text-red-300 border border-red-400/30 bg-red-400/10 rounded-xl px-4 py-2.5">{error}</p>}
                {notice && <p className="text-[13px] text-emerald border border-emerald/30 bg-emerald/10 rounded-xl px-4 py-2.5">{notice}</p>}

                <button type="submit" disabled={submitting}
                  className="w-full font-sans text-sm font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-6 py-3.5 rounded-full transition-colors duration-300 shadow-glow disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Saving…' : editing ? 'Save changes' : 'Add member'}
                </button>
              </div>
            </form>
          </section>

          {/* List */}
          <section className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg tracking-tight">Team roster</h2>
              <span className="font-mono text-[11px] text-soft">{list.length} members</span>
            </div>

            {loading ? (
              <div className="glass rounded-2xl p-8 text-center text-soft font-sans text-sm">Loading…</div>
            ) : list.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center text-soft font-sans text-sm">No members yet — add your first one.</div>
            ) : (
              <ul className="space-y-3">
                {list.map((m) => (
                  <li key={m.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                    <MiniAvatar member={m} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-[15px] text-fg truncate">{m.name}</h3>
                        {m.tag && <span className="font-mono text-[9px] uppercase tracking-widest text-indigo bg-indigo/12 px-2 py-0.5 rounded-full shrink-0">{m.tag}</span>}
                      </div>
                      <p className="font-sans text-[12.5px] text-mid truncate">{m.role}</p>
                      {m.quote && <p className="font-sans text-[12px] text-soft italic truncate mt-0.5">“{m.quote}”</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => startEdit(m)} className="font-sans text-[12px] font-medium text-fg/80 hover:text-fg border border-line hover:border-indigo/40 px-3 py-1.5 rounded-full transition-colors">Edit</button>
                      <button onClick={() => remove(m)} className="font-sans text-[12px] font-medium text-red-300 hover:text-red-200 border border-red-400/20 hover:border-red-400/50 px-3 py-1.5 rounded-full transition-colors">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : (
        /* ── Messages tab ── */
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg tracking-tight">Contact enquiries</h2>
            <span className="font-mono text-[11px] text-soft">{messages.length} total · {unread} unread</span>
          </div>

          {error && <p className="mb-4 text-[13px] text-red-300 border border-red-400/30 bg-red-400/10 rounded-xl px-4 py-2.5">{error}</p>}

          {msgLoading ? (
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
      )}
    </div>
  );
}

const Field = ({ label, name, value, onChange, placeholder, required = false }) => (
  <div>
    <label className="block font-sans text-[11px] uppercase tracking-wider text-soft font-medium mb-2">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="w-full bg-white/5 border border-line rounded-xl px-4 py-3 font-sans text-[14px] text-fg placeholder:text-soft focus:outline-none focus:border-indigo transition-colors" />
  </div>
);
